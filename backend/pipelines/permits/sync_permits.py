"""
Sync LADBS building permits from LA City Socrata API.
Handles both current (2020+) and legacy (2012-2019) datasets.

Usage:
    python -m backend.pipelines.permits.sync_permits
"""

import asyncio
import logging
import os
from datetime import datetime

import asyncpg
import httpx

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

SOCRATA_BASE = "https://data.lacity.org/resource"
DATASETS = {
    "current": "pi9x-tg5x",  # 2020-present
    "legacy": "vdg9-hy7c",   # 2012-2019
}
SOCRATA_PAGE_SIZE = 50000
SOCRATA_APP_TOKEN = os.getenv("SOCRATA_APP_TOKEN", "")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/lacityscape")


async def get_last_sync_date(conn: asyncpg.Connection) -> str | None:
    row = await conn.fetchrow(
        "SELECT MAX(completed_at) as last_run FROM pipeline_runs "
        "WHERE pipeline = 'permits' AND status = 'completed'"
    )
    if row and row["last_run"]:
        return row["last_run"].strftime("%Y-%m-%dT%H:%M:%S")
    return None


async def create_pipeline_run(conn: asyncpg.Connection) -> int:
    return await conn.fetchval(
        "INSERT INTO pipeline_runs (pipeline, status) VALUES ('permits', 'running') RETURNING id"
    )


async def update_pipeline_run(
    conn: asyncpg.Connection,
    run_id: int,
    status: str,
    processed: int = 0,
    inserted: int = 0,
    updated: int = 0,
    error: str | None = None,
):
    await conn.execute(
        "UPDATE pipeline_runs SET status = $1, completed_at = NOW(), "
        "records_processed = $2, records_inserted = $3, records_updated = $4, "
        "error_message = $5 WHERE id = $6",
        status, processed, inserted, updated, error, run_id,
    )


def parse_permit(raw: dict) -> dict:
    def parse_ts(val):
        if not val:
            return None
        try:
            return datetime.fromisoformat(val.replace("T", " ").split(".")[0])
        except (ValueError, AttributeError):
            return None

    def parse_float(val):
        if not val:
            return None
        try:
            return float(val)
        except (ValueError, TypeError):
            return None

    def parse_bool(val):
        if not val:
            return False
        return str(val).strip().upper() in ("Y", "YES", "TRUE", "1")

    lat = parse_float(raw.get("latitude") or raw.get("lat"))
    lon = parse_float(raw.get("longitude") or raw.get("lon"))

    return {
        "permit_nbr": raw.get("permit_nbr") or raw.get("pcis_permit"),
        "primary_address": raw.get("address") or raw.get("primary_address") or raw.get("address_start"),
        "zip_code": raw.get("zip_code"),
        "council_district": raw.get("council_district") or raw.get("council_dist"),
        "pin_nbr": raw.get("pin_nbr") or raw.get("pin"),
        "apn": raw.get("assessor_parcel_nbr") or raw.get("apn"),
        "zone": raw.get("zone"),
        "area_planning_commission": raw.get("area_planning_commission") or raw.get("apc"),
        "community_plan_area": raw.get("community_plan_area") or raw.get("cpa"),
        "neighborhood_council": raw.get("neighborhood_council"),
        "census_tract": raw.get("census_tract"),
        "permit_group": raw.get("permit_group") or raw.get("group"),
        "permit_type": raw.get("permit_type") or raw.get("type"),
        "permit_sub_type": raw.get("permit_sub_type") or raw.get("sub_type"),
        "use_code": raw.get("use_code"),
        "use_desc": raw.get("use_desc") or raw.get("use_description"),
        "submitted_date": parse_ts(raw.get("submitted_date") or raw.get("date_submitted")),
        "issue_date": parse_ts(raw.get("issue_date") or raw.get("date_issued")),
        "status_desc": raw.get("status_desc") or raw.get("status"),
        "status_date": parse_ts(raw.get("status_date")),
        "valuation": parse_float(raw.get("valuation")),
        "square_footage": parse_float(raw.get("square_footage") or raw.get("floor_area")),
        "construction": raw.get("construction"),
        "work_desc": raw.get("work_desc") or raw.get("work_description") or raw.get("description"),
        "contractor_name": raw.get("contractor_name") or raw.get("contractor"),
        "ev": parse_bool(raw.get("ev")),
        "solar": parse_bool(raw.get("solar")),
        "lat": lat,
        "lon": lon,
    }


async def fetch_dataset(
    client: httpx.AsyncClient,
    dataset_id: str,
    last_sync: str | None = None,
) -> list[dict]:
    all_records = []
    offset = 0
    headers = {}
    if SOCRATA_APP_TOKEN:
        headers["X-App-Token"] = SOCRATA_APP_TOKEN

    while True:
        params = {
            "$limit": SOCRATA_PAGE_SIZE,
            "$offset": offset,
            "$order": ":id",
        }
        if last_sync:
            params["$where"] = f"issue_date > '{last_sync}'"

        url = f"{SOCRATA_BASE}/{dataset_id}.json"
        logger.info(f"Fetching {url} offset={offset}")

        resp = await client.get(url, params=params, headers=headers, timeout=120)
        resp.raise_for_status()
        records = resp.json()

        if not records:
            break

        all_records.extend(records)
        logger.info(f"Fetched {len(records)} records (total: {len(all_records)})")

        if len(records) < SOCRATA_PAGE_SIZE:
            break
        offset += SOCRATA_PAGE_SIZE

    return all_records


async def upsert_permits(conn: asyncpg.Connection, records: list[dict]) -> tuple[int, int]:
    inserted = 0
    updated = 0

    for raw in records:
        parsed = parse_permit(raw)
        if not parsed["permit_nbr"]:
            continue

        geom_expr = "NULL"
        extra_params = []
        if parsed["lat"] and parsed["lon"]:
            geom_expr = "ST_SetSRID(ST_MakePoint($25, $26), 4326)"
            extra_params = [parsed["lon"], parsed["lat"]]
        else:
            geom_expr = "NULL::geometry"
            extra_params = []

        import json
        raw_json = json.dumps(raw)

        if extra_params:
            result = await conn.execute(
                f"""
                INSERT INTO permits (
                    permit_nbr, primary_address, zip_code, council_district,
                    pin_nbr, apn, zone, area_planning_commission,
                    community_plan_area, neighborhood_council, census_tract,
                    permit_group, permit_type, permit_sub_type, use_code,
                    use_desc, submitted_date, issue_date, status_desc,
                    status_date, valuation, square_footage, construction,
                    work_desc, contractor_name, ev, solar, lat, lon,
                    geom, raw_data, updated_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
                    $12, $13, $14, $15, $16, $17, $18, $19, $20,
                    $21, $22, $23, $24, $25, $26, $27, $28, $29,
                    ST_SetSRID(ST_MakePoint($30, $31), 4326), $32::jsonb, NOW()
                )
                ON CONFLICT (permit_nbr) DO UPDATE SET
                    primary_address = EXCLUDED.primary_address,
                    zip_code = EXCLUDED.zip_code,
                    council_district = EXCLUDED.council_district,
                    status_desc = EXCLUDED.status_desc,
                    status_date = EXCLUDED.status_date,
                    valuation = EXCLUDED.valuation,
                    work_desc = EXCLUDED.work_desc,
                    raw_data = EXCLUDED.raw_data,
                    updated_at = NOW()
                """,
                parsed["permit_nbr"], parsed["primary_address"], parsed["zip_code"],
                parsed["council_district"], parsed["pin_nbr"], parsed["apn"],
                parsed["zone"], parsed["area_planning_commission"],
                parsed["community_plan_area"], parsed["neighborhood_council"],
                parsed["census_tract"], parsed["permit_group"], parsed["permit_type"],
                parsed["permit_sub_type"], parsed["use_code"], parsed["use_desc"],
                parsed["submitted_date"], parsed["issue_date"], parsed["status_desc"],
                parsed["status_date"], parsed["valuation"], parsed["square_footage"],
                parsed["construction"], parsed["work_desc"], parsed["contractor_name"],
                parsed["ev"], parsed["solar"], parsed["lat"], parsed["lon"],
                parsed["lon"], parsed["lat"], raw_json,
            )
        else:
            result = await conn.execute(
                """
                INSERT INTO permits (
                    permit_nbr, primary_address, zip_code, council_district,
                    pin_nbr, apn, zone, area_planning_commission,
                    community_plan_area, neighborhood_council, census_tract,
                    permit_group, permit_type, permit_sub_type, use_code,
                    use_desc, submitted_date, issue_date, status_desc,
                    status_date, valuation, square_footage, construction,
                    work_desc, contractor_name, ev, solar, lat, lon,
                    geom, raw_data, updated_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
                    $12, $13, $14, $15, $16, $17, $18, $19, $20,
                    $21, $22, $23, $24, $25, $26, $27, $28, $29,
                    NULL, $30::jsonb, NOW()
                )
                ON CONFLICT (permit_nbr) DO UPDATE SET
                    primary_address = EXCLUDED.primary_address,
                    zip_code = EXCLUDED.zip_code,
                    council_district = EXCLUDED.council_district,
                    status_desc = EXCLUDED.status_desc,
                    status_date = EXCLUDED.status_date,
                    valuation = EXCLUDED.valuation,
                    work_desc = EXCLUDED.work_desc,
                    raw_data = EXCLUDED.raw_data,
                    updated_at = NOW()
                """,
                parsed["permit_nbr"], parsed["primary_address"], parsed["zip_code"],
                parsed["council_district"], parsed["pin_nbr"], parsed["apn"],
                parsed["zone"], parsed["area_planning_commission"],
                parsed["community_plan_area"], parsed["neighborhood_council"],
                parsed["census_tract"], parsed["permit_group"], parsed["permit_type"],
                parsed["permit_sub_type"], parsed["use_code"], parsed["use_desc"],
                parsed["submitted_date"], parsed["issue_date"], parsed["status_desc"],
                parsed["status_date"], parsed["valuation"], parsed["square_footage"],
                parsed["construction"], parsed["work_desc"], parsed["contractor_name"],
                parsed["ev"], parsed["solar"], parsed["lat"], parsed["lon"],
                raw_json,
            )

        if "INSERT" in result:
            inserted += 1
        else:
            updated += 1

    return inserted, updated


async def main():
    logger.info("Starting permit sync pipeline")
    conn = await asyncpg.connect(DATABASE_URL)

    try:
        run_id = await create_pipeline_run(conn)
        last_sync = await get_last_sync_date(conn)
        logger.info(f"Last sync: {last_sync or 'never (full sync)'}")

        total_processed = 0
        total_inserted = 0
        total_updated = 0

        async with httpx.AsyncClient() as client:
            for label, dataset_id in DATASETS.items():
                logger.info(f"Syncing {label} dataset: {dataset_id}")
                records = await fetch_dataset(client, dataset_id, last_sync)
                logger.info(f"Fetched {len(records)} {label} records")

                if records:
                    ins, upd = await upsert_permits(conn, records)
                    total_processed += len(records)
                    total_inserted += ins
                    total_updated += upd
                    logger.info(f"{label}: inserted={ins}, updated={upd}")

        await update_pipeline_run(
            conn, run_id, "completed", total_processed, total_inserted, total_updated
        )
        logger.info(
            f"Pipeline completed: processed={total_processed}, "
            f"inserted={total_inserted}, updated={total_updated}"
        )

    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        await update_pipeline_run(conn, run_id, "failed", error=str(e))
        raise
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())

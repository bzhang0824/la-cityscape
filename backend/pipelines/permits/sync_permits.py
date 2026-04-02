"""
Sync building permits from LADBS Socrata API into PostgreSQL.

Datasets:
  - pi9x-tg5x  (2020-present, primary)
  - vdg9-hy7c  (2012-2019, legacy)

Run:  python -m backend.pipelines.permits.sync_permits
"""

import os
import sys
import json
import logging
import asyncio
from datetime import datetime, timedelta

import httpx
import asyncpg

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
logger = logging.getLogger("sync_permits")

DATABASE_URL = os.environ.get("DATABASE_URL", "")
SOCRATA_APP_TOKEN = os.environ.get("SOCRATA_APP_TOKEN", "")
SOCRATA_BASE = "https://data.lacity.org/resource"

DATASETS = {
    "current": "pi9x-tg5x",  # 2020-present
    "legacy": "vdg9-hy7c",   # 2012-2019
}

PAGE_SIZE = 50000


async def fetch_permits(client: httpx.AsyncClient, dataset_id: str, offset: int = 0, where: str = "") -> list[dict]:
    """Fetch a page of permits from Socrata API."""
    params = {
        "$limit": PAGE_SIZE,
        "$offset": offset,
        "$order": "issue_date DESC",
    }
    if where:
        params["$where"] = where
    if SOCRATA_APP_TOKEN:
        params["$$app_token"] = SOCRATA_APP_TOKEN

    url = f"{SOCRATA_BASE}/{dataset_id}.json"
    resp = await client.get(url, params=params, timeout=120)
    resp.raise_for_status()
    return resp.json()


async def upsert_permits(conn: asyncpg.Connection, permits: list[dict]) -> tuple[int, int]:
    """Upsert permits into the database. Returns (inserted, updated)."""
    inserted = 0
    updated = 0

    for p in permits:
        lat = _float(p.get("lat"))
        lon = _float(p.get("lon"))

        geom_expr = "ST_SetSRID(ST_MakePoint($27, $28), 4326)" if lat and lon else "NULL"

        sql = f"""
            INSERT INTO permits (
                permit_nbr, primary_address, zip_code, council_district, pin_nbr,
                apn, zone, area_planning_commission, community_plan_area,
                neighborhood_council, census_tract, permit_group, permit_type,
                permit_sub_type, use_code, use_desc, submitted_date, issue_date,
                status_desc, status_date, valuation, square_footage, construction,
                work_desc, ev, solar, lat, lon, geom, raw_data
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
                $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
                $27, $28, {geom_expr}, $29
            )
            ON CONFLICT (permit_nbr) DO UPDATE SET
                status_desc = EXCLUDED.status_desc,
                status_date = EXCLUDED.status_date,
                valuation = EXCLUDED.valuation,
                updated_at = NOW()
            RETURNING (xmax = 0) as is_insert
        """

        try:
            result = await conn.fetchval(
                sql,
                p.get("permit_nbr", ""),
                p.get("primary_address"),
                p.get("zip_code"),
                p.get("cd"),
                p.get("pin_nbr"),
                p.get("apn"),
                p.get("zone"),
                p.get("apc"),
                p.get("cpa"),
                p.get("cnc"),
                p.get("ct"),
                p.get("permit_group"),
                p.get("permit_type"),
                p.get("permit_sub_type"),
                p.get("use_code"),
                p.get("use_desc"),
                _timestamp(p.get("submitted_date")),
                _timestamp(p.get("issue_date")),
                p.get("status_desc"),
                _timestamp(p.get("status_date")),
                _float(p.get("valuation")),
                _float(p.get("square_footage")),
                p.get("construction"),
                p.get("work_desc"),
                p.get("ev", "N") == "Y",
                p.get("solar", "N") == "Y",
                lat,
                lon,
                json.dumps(p),
            )
            if result:
                inserted += 1
            else:
                updated += 1
        except Exception as e:
            logger.warning(f"Error upserting permit {p.get('permit_nbr')}: {e}")

    return inserted, updated


async def sync_dataset(conn: asyncpg.Connection, client: httpx.AsyncClient, dataset_id: str, incremental: bool = True):
    """Sync a single Socrata dataset."""
    logger.info(f"Syncing dataset {dataset_id} (incremental={incremental})")

    where = ""
    if incremental:
        # Get last sync date
        last_date = await conn.fetchval(
            "SELECT MAX(issue_date) FROM permits WHERE raw_data->>'_dataset' = $1",
            dataset_id,
        )
        if last_date:
            where = f"issue_date > '{(last_date - timedelta(days=2)).strftime('%Y-%m-%dT00:00:00')}'"
            logger.info(f"Incremental sync from {last_date}")

    total_inserted = 0
    total_updated = 0
    offset = 0

    while True:
        permits = await fetch_permits(client, dataset_id, offset=offset, where=where)
        if not permits:
            break

        # Tag with dataset source
        for p in permits:
            p["_dataset"] = dataset_id

        ins, upd = await upsert_permits(conn, permits)
        total_inserted += ins
        total_updated += upd
        offset += PAGE_SIZE
        logger.info(f"  Page {offset // PAGE_SIZE}: {len(permits)} fetched, {ins} inserted, {upd} updated")

        if len(permits) < PAGE_SIZE:
            break

    logger.info(f"Dataset {dataset_id} complete: {total_inserted} inserted, {total_updated} updated")
    return total_inserted, total_updated


async def main():
    if not DATABASE_URL:
        logger.error("DATABASE_URL not set")
        sys.exit(1)

    conn = await asyncpg.connect(DATABASE_URL)
    client = httpx.AsyncClient()

    # Record pipeline run
    run_id = await conn.fetchval(
        "INSERT INTO pipeline_runs (pipeline, status) VALUES ('sync_permits', 'running') RETURNING id"
    )

    try:
        total_ins = 0
        total_upd = 0

        for name, dataset_id in DATASETS.items():
            logger.info(f"=== Syncing {name} dataset ({dataset_id}) ===")
            ins, upd = await sync_dataset(conn, client, dataset_id)
            total_ins += ins
            total_upd += upd

        await conn.execute(
            """UPDATE pipeline_runs
               SET completed_at = NOW(), records_inserted = $1, records_updated = $2,
                   records_processed = $1 + $2, status = 'success'
               WHERE id = $3""",
            total_ins, total_upd, run_id,
        )
        logger.info(f"Pipeline complete: {total_ins} inserted, {total_upd} updated")

    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        await conn.execute(
            "UPDATE pipeline_runs SET completed_at = NOW(), status = 'failed', error_message = $1 WHERE id = $2",
            str(e), run_id,
        )
        raise
    finally:
        await client.aclose()
        await conn.close()


def _float(v):
    if v is None:
        return None
    try:
        return float(v)
    except (ValueError, TypeError):
        return None


def _timestamp(v):
    if not v:
        return None
    try:
        return datetime.fromisoformat(v.replace("T", " ").split(".")[0])
    except (ValueError, AttributeError):
        return None


if __name__ == "__main__":
    asyncio.run(main())

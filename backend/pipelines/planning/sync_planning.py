"""
Sync planning cases from LA City Planning API.

Usage:
    python -m backend.pipelines.planning.sync_planning
"""

import asyncio
import json
import logging
import os
from datetime import datetime

import asyncpg
import httpx

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

PLANNING_API_URL = "https://planning.lacity.org/dcpapi/general/newcases"
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/lacityscape")


async def create_pipeline_run(conn: asyncpg.Connection) -> int:
    return await conn.fetchval(
        "INSERT INTO pipeline_runs (pipeline, status) VALUES ('planning', 'running') RETURNING id"
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


def parse_case(raw: dict) -> dict:
    def parse_date(val):
        if not val:
            return None
        try:
            if "T" in str(val):
                return datetime.fromisoformat(str(val).split("T")[0]).date()
            return datetime.strptime(str(val), "%Y-%m-%d").date()
        except (ValueError, AttributeError):
            return None

    def parse_float(val):
        if not val:
            return None
        try:
            return float(val)
        except (ValueError, TypeError):
            return None

    return {
        "case_number": raw.get("caseNumber") or raw.get("case_number"),
        "address": raw.get("address") or raw.get("projectAddress"),
        "filing_date": parse_date(raw.get("filingDate") or raw.get("filing_date")),
        "case_type": raw.get("caseType") or raw.get("case_type"),
        "council_district": raw.get("councilDistrict") or raw.get("council_district"),
        "community_plan_area": raw.get("communityPlanArea") or raw.get("community_plan_area"),
        "project_description": raw.get("projectDescription") or raw.get("description"),
        "pdis_url": raw.get("pdisUrl") or raw.get("pdis_url"),
        "applicant": raw.get("applicant"),
        "applicant_company": raw.get("applicantCompany") or raw.get("applicant_company"),
        "representative": raw.get("representative"),
        "representative_company": raw.get("representativeCompany") or raw.get("representative_company"),
        "entitlements_requested": raw.get("entitlementsRequested") or raw.get("entitlements"),
        "environmental_flag": raw.get("environmentalFlag") or raw.get("environmental"),
        "on_hold": bool(raw.get("onHold") or raw.get("on_hold")),
        "completed": bool(raw.get("completed")),
        "use_type": raw.get("useType") or raw.get("use_type"),
        "source": "la_city_planning",
        "lat": parse_float(raw.get("latitude") or raw.get("lat")),
        "lon": parse_float(raw.get("longitude") or raw.get("lon")),
    }


async def fetch_cases(client: httpx.AsyncClient) -> list[dict]:
    logger.info(f"Fetching from {PLANNING_API_URL}")
    resp = await client.get(PLANNING_API_URL, timeout=120)
    resp.raise_for_status()
    data = resp.json()

    if isinstance(data, list):
        return data
    if isinstance(data, dict) and "cases" in data:
        return data["cases"]
    if isinstance(data, dict) and "data" in data:
        return data["data"]
    return [data] if data else []


async def upsert_cases(conn: asyncpg.Connection, records: list[dict]) -> tuple[int, int]:
    inserted = 0
    updated = 0

    for raw in records:
        parsed = parse_case(raw)
        if not parsed["case_number"]:
            continue

        raw_json = json.dumps(raw)

        if parsed["lat"] and parsed["lon"]:
            result = await conn.execute(
                """
                INSERT INTO planning_cases (
                    case_number, address, filing_date, case_type,
                    council_district, community_plan_area, project_description,
                    pdis_url, applicant, applicant_company, representative,
                    representative_company, entitlements_requested, environmental_flag,
                    on_hold, completed, use_type, source, lat, lon,
                    geom, raw_data, updated_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
                    $13, $14, $15, $16, $17, $18, $19, $20,
                    ST_SetSRID(ST_MakePoint($21, $22), 4326), $23::jsonb, NOW()
                )
                ON CONFLICT (case_number) DO UPDATE SET
                    address = EXCLUDED.address,
                    project_description = EXCLUDED.project_description,
                    on_hold = EXCLUDED.on_hold,
                    completed = EXCLUDED.completed,
                    raw_data = EXCLUDED.raw_data,
                    updated_at = NOW()
                """,
                parsed["case_number"], parsed["address"], parsed["filing_date"],
                parsed["case_type"], parsed["council_district"],
                parsed["community_plan_area"], parsed["project_description"],
                parsed["pdis_url"], parsed["applicant"], parsed["applicant_company"],
                parsed["representative"], parsed["representative_company"],
                parsed["entitlements_requested"], parsed["environmental_flag"],
                parsed["on_hold"], parsed["completed"], parsed["use_type"],
                parsed["source"], parsed["lat"], parsed["lon"],
                parsed["lon"], parsed["lat"], raw_json,
            )
        else:
            result = await conn.execute(
                """
                INSERT INTO planning_cases (
                    case_number, address, filing_date, case_type,
                    council_district, community_plan_area, project_description,
                    pdis_url, applicant, applicant_company, representative,
                    representative_company, entitlements_requested, environmental_flag,
                    on_hold, completed, use_type, source, lat, lon,
                    geom, raw_data, updated_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
                    $13, $14, $15, $16, $17, $18, $19, $20,
                    NULL, $21::jsonb, NOW()
                )
                ON CONFLICT (case_number) DO UPDATE SET
                    address = EXCLUDED.address,
                    project_description = EXCLUDED.project_description,
                    on_hold = EXCLUDED.on_hold,
                    completed = EXCLUDED.completed,
                    raw_data = EXCLUDED.raw_data,
                    updated_at = NOW()
                """,
                parsed["case_number"], parsed["address"], parsed["filing_date"],
                parsed["case_type"], parsed["council_district"],
                parsed["community_plan_area"], parsed["project_description"],
                parsed["pdis_url"], parsed["applicant"], parsed["applicant_company"],
                parsed["representative"], parsed["representative_company"],
                parsed["entitlements_requested"], parsed["environmental_flag"],
                parsed["on_hold"], parsed["completed"], parsed["use_type"],
                parsed["source"], parsed["lat"], parsed["lon"],
                raw_json,
            )

        if "INSERT" in result:
            inserted += 1
        else:
            updated += 1

    return inserted, updated


async def main():
    logger.info("Starting planning case sync pipeline")
    conn = await asyncpg.connect(DATABASE_URL)

    try:
        run_id = await create_pipeline_run(conn)

        async with httpx.AsyncClient() as client:
            records = await fetch_cases(client)
            logger.info(f"Fetched {len(records)} planning cases")

            if records:
                inserted, updated = await upsert_cases(conn, records)
                await update_pipeline_run(
                    conn, run_id, "completed", len(records), inserted, updated
                )
                logger.info(f"Completed: inserted={inserted}, updated={updated}")
            else:
                await update_pipeline_run(conn, run_id, "completed", 0, 0, 0)
                logger.info("No records to process")

    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        await update_pipeline_run(conn, run_id, "failed", error=str(e))
        raise
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())

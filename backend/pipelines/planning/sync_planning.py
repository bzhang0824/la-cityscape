"""
Sync planning cases from LA City Planning API into PostgreSQL.

API: https://planning.lacity.org/dcpapi/general/newcases
Returns ~100 cases filed in last 2 weeks.
Case types: ENV, EAR, CPC, DIR, VTT, TT, ZA

Run:  python -m backend.pipelines.planning.sync_planning
"""

import os
import sys
import json
import logging
import asyncio
from datetime import datetime

import httpx
import asyncpg

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
logger = logging.getLogger("sync_planning")

DATABASE_URL = os.environ.get("DATABASE_URL", "")
PLANNING_API_URL = "https://planning.lacity.gov/dcpapi/general/newcases"

# Case type prefixes we track
CASE_TYPES = ["ENV", "EAR", "CPC", "DIR", "VTT", "TT", "ZA"]


async def fetch_planning_cases(client: httpx.AsyncClient) -> list[dict]:
    """Fetch new planning cases from LA City Planning API."""
    resp = await client.get(PLANNING_API_URL, timeout=60)
    resp.raise_for_status()
    data = resp.json()
    logger.info(f"Fetched {len(data)} cases from Planning API")
    return data


def parse_case(raw: dict) -> dict | None:
    """Parse a raw API case into our schema."""
    case_num = raw.get("caseNum", "").strip()
    if not case_num:
        return None

    # Filter by case type prefix
    prefix = case_num.split("-")[0] if "-" in case_num else case_num[:3]
    if prefix not in CASE_TYPES:
        return None

    return {
        "case_number": case_num,
        "address": raw.get("address", "").strip() or None,
        "filing_date": _parse_date(raw.get("date")),
        "case_type": prefix,
        "council_district": str(raw.get("cd", "")).strip() or None,
        "community_plan_area": raw.get("cpa", "").strip() or None,
        "project_description": raw.get("desc", "").strip() or None,
        "pdis_url": raw.get("url", "").strip() or None,
        "source": "LA City Planning API",
        "city": "Los Angeles",
        "raw_data": json.dumps(raw),
    }


async def upsert_cases(conn: asyncpg.Connection, cases: list[dict]) -> tuple[int, int]:
    """Upsert planning cases. Returns (inserted, updated)."""
    inserted = 0
    updated = 0

    for c in cases:
        try:
            result = await conn.fetchval(
                """INSERT INTO planning_cases (
                       case_number, address, filing_date, case_type,
                       council_district, community_plan_area, project_description,
                       pdis_url, source, city, raw_data
                   ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                   ON CONFLICT (case_number) DO UPDATE SET
                       project_description = COALESCE(EXCLUDED.project_description, planning_cases.project_description),
                       updated_at = NOW()
                   RETURNING (xmax = 0) as is_insert""",
                c["case_number"],
                c["address"],
                c["filing_date"],
                c["case_type"],
                c["council_district"],
                c["community_plan_area"],
                c["project_description"],
                c["pdis_url"],
                c["source"],
                c["city"],
                c["raw_data"],
            )
            if result:
                inserted += 1
            else:
                updated += 1
        except Exception as e:
            logger.warning(f"Error upserting case {c['case_number']}: {e}")

    return inserted, updated


async def main():
    if not DATABASE_URL:
        logger.error("DATABASE_URL not set")
        sys.exit(1)

    conn = await asyncpg.connect(DATABASE_URL, statement_cache_size=0)
    client = httpx.AsyncClient()

    run_id = await conn.fetchval(
        "INSERT INTO pipeline_runs (pipeline, status) VALUES ('sync_planning', 'running') RETURNING id"
    )

    try:
        raw_cases = await fetch_planning_cases(client)
        parsed = [parse_case(c) for c in raw_cases]
        parsed = [c for c in parsed if c is not None]
        logger.info(f"Parsed {len(parsed)} relevant cases from {len(raw_cases)} total")

        ins, upd = await upsert_cases(conn, parsed)

        await conn.execute(
            """UPDATE pipeline_runs
               SET completed_at = NOW(), records_processed = $1,
                   records_inserted = $2, records_updated = $3, status = 'success'
               WHERE id = $4""",
            len(parsed), ins, upd, run_id,
        )
        logger.info(f"Pipeline complete: {ins} inserted, {upd} updated")

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


def _parse_date(v):
    if not v:
        return None
    try:
        return datetime.strptime(v.strip(), "%m/%d/%Y").date()
    except (ValueError, AttributeError):
        try:
            return datetime.fromisoformat(v.strip().split("T")[0]).date()
        except (ValueError, AttributeError):
            return None


if __name__ == "__main__":
    asyncio.run(main())

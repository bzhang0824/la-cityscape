from fastapi import APIRouter, Query
from backend.api.database import get_pool

router = APIRouter()


@router.get("")
async def search(q: str = Query(..., min_length=2)):
    pool = await get_pool()
    query_pattern = f"%{q.upper()}%"

    async with pool.acquire() as conn:
        permits = await conn.fetch(
            "SELECT id, permit_nbr, primary_address, permit_type, issue_date, valuation "
            "FROM permits WHERE UPPER(primary_address) LIKE $1 "
            "OR UPPER(permit_nbr) LIKE $1 "
            "ORDER BY issue_date DESC NULLS LAST LIMIT 10",
            query_pattern,
        )
        planning = await conn.fetch(
            "SELECT id, case_number, address, case_type, filing_date "
            "FROM planning_cases WHERE UPPER(address) LIKE $1 "
            "OR UPPER(case_number) LIKE $1 "
            "ORDER BY filing_date DESC NULLS LAST LIMIT 10",
            query_pattern,
        )
        places_rows = await conn.fetch(
            "SELECT id, name, place_type, slug FROM places "
            "WHERE UPPER(name) LIKE $1 LIMIT 10",
            query_pattern,
        )

    return {
        "permits": [dict(r) for r in permits],
        "planning_cases": [dict(r) for r in planning],
        "places": [dict(r) for r in places_rows],
    }

"""Search endpoint — cross-entity search across addresses, permits, and planning cases."""

from fastapi import APIRouter, Query
from ..database import get_connection

router = APIRouter()


def _serialize(v):
    from datetime import datetime, date
    from decimal import Decimal
    if isinstance(v, (datetime, date)):
        return v.isoformat()
    if isinstance(v, Decimal):
        return float(v)
    return v


@router.get("")
async def search(q: str = Query(..., min_length=2, description="Search query"), limit: int = Query(20, ge=1, le=100)):
    """Search across permits, planning cases, and places by address or keyword."""
    pattern = f"%{q}%"

    async with get_connection() as conn:
        permits = await conn.fetch(
            """SELECT 'permit' as type, permit_nbr as id, primary_address as title,
                      permit_type || ' — ' || COALESCE(use_desc, '') as subtitle,
                      issue_date, lat, lon
               FROM permits
               WHERE primary_address ILIKE $1 OR work_desc ILIKE $1
               ORDER BY issue_date DESC NULLS LAST
               LIMIT $2""",
            pattern,
            limit,
        )
        cases = await conn.fetch(
            """SELECT 'planning_case' as type, case_number as id, address as title,
                      case_type || ' — ' || COALESCE(LEFT(project_description, 100), '') as subtitle,
                      filing_date as issue_date, lat, lon
               FROM planning_cases
               WHERE address ILIKE $1 OR project_description ILIKE $1
               ORDER BY filing_date DESC NULLS LAST
               LIMIT $2""",
            pattern,
            limit,
        )
        place_rows = await conn.fetch(
            """SELECT 'place' as type, slug as id, name as title,
                      place_type as subtitle, NULL::timestamp as issue_date,
                      NULL::float as lat, NULL::float as lon
               FROM places
               WHERE name ILIKE $1
               ORDER BY name
               LIMIT $2""",
            pattern,
            limit,
        )

    results = []
    for rows in [permits, cases, place_rows]:
        for r in rows:
            d = dict(r)
            for k, v in d.items():
                d[k] = _serialize(v)
            results.append(d)

    return {"results": results, "query": q}

from typing import Optional

from fastapi import APIRouter, Query
from backend.api.database import get_pool

router = APIRouter()


@router.get("/stats")
async def planning_stats():
    pool = await get_pool()
    async with pool.acquire() as conn:
        total = await conn.fetchval("SELECT COUNT(*) FROM planning_cases")
        by_type = await conn.fetch(
            "SELECT case_type, COUNT(*) as count FROM planning_cases "
            "GROUP BY case_type ORDER BY count DESC LIMIT 10"
        )
        monthly = await conn.fetch(
            "SELECT date_trunc('month', filing_date) as month, COUNT(*) as count "
            "FROM planning_cases WHERE filing_date IS NOT NULL "
            "GROUP BY month ORDER BY month DESC LIMIT 12"
        )
    return {
        "total": total,
        "by_type": [dict(r) for r in by_type],
        "monthly_trend": [
            {"month": r["month"].isoformat() if r["month"] else None, "count": r["count"]}
            for r in monthly
        ],
    }


@router.get("/{case_number}")
async def get_planning_case(case_number: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, case_number, address, filing_date, case_type, "
            "council_district, community_plan_area, project_description, "
            "pdis_url, applicant, applicant_company, representative, "
            "representative_company, entitlements_requested, environmental_flag, "
            "on_hold, completed, use_type, source, city, lat, lon, "
            "created_at, updated_at "
            "FROM planning_cases WHERE case_number = $1",
            case_number,
        )
    if not row:
        return {"error": "Planning case not found"}
    return dict(row)


@router.get("")
async def list_planning_cases(
    case_type: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    council_district: Optional[str] = None,
    community_plan_area: Optional[str] = None,
    limit: int = Query(default=50, le=1000),
    offset: int = Query(default=0, ge=0),
):
    pool = await get_pool()
    conditions = []
    params = []
    idx = 1

    if case_type:
        conditions.append(f"case_type = ${idx}")
        params.append(case_type)
        idx += 1
    if date_from:
        conditions.append(f"filing_date >= ${idx}::date")
        params.append(date_from)
        idx += 1
    if date_to:
        conditions.append(f"filing_date <= ${idx}::date")
        params.append(date_to)
        idx += 1
    if council_district:
        conditions.append(f"council_district = ${idx}")
        params.append(council_district)
        idx += 1
    if community_plan_area:
        conditions.append(f"community_plan_area = ${idx}")
        params.append(community_plan_area)
        idx += 1

    where = " WHERE " + " AND ".join(conditions) if conditions else ""

    async with pool.acquire() as conn:
        count = await conn.fetchval(f"SELECT COUNT(*) FROM planning_cases{where}", *params)
        rows = await conn.fetch(
            f"SELECT id, case_number, address, filing_date, case_type, "
            f"council_district, community_plan_area, project_description, "
            f"pdis_url, applicant, on_hold, completed, use_type, lat, lon "
            f"FROM planning_cases{where} ORDER BY filing_date DESC NULLS LAST "
            f"LIMIT ${idx} OFFSET ${idx+1}",
            *params, limit, offset,
        )

    return {
        "data": [dict(r) for r in rows],
        "total": count,
        "limit": limit,
        "offset": offset,
    }

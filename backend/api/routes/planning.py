"""Planning case endpoints — browse LA City planning applications."""

from fastapi import APIRouter, Query
from typing import Optional
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
async def list_planning_cases(
    case_type: Optional[str] = Query(None),
    council_district: Optional[str] = Query(None),
    community_plan_area: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    completed: Optional[bool] = Query(None),
    q: Optional[str] = Query(None),
    format: Optional[str] = Query("json"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    conditions = []
    params = []
    idx = 1

    if case_type:
        conditions.append(f"case_type = ${idx}")
        params.append(case_type)
        idx += 1
    if council_district:
        conditions.append(f"council_district = ${idx}")
        params.append(council_district)
        idx += 1
    if community_plan_area:
        conditions.append(f"community_plan_area = ${idx}")
        params.append(community_plan_area)
        idx += 1
    if city:
        conditions.append(f"city = ${idx}")
        params.append(city)
        idx += 1
    if date_from:
        conditions.append(f"filing_date >= ${idx}::date")
        params.append(date_from)
        idx += 1
    if date_to:
        conditions.append(f"filing_date <= ${idx}::date")
        params.append(date_to)
        idx += 1
    if completed is not None:
        conditions.append(f"completed = ${idx}")
        params.append(completed)
        idx += 1
    if q:
        conditions.append(f"(address ILIKE ${idx} OR project_description ILIKE ${idx})")
        params.append(f"%{q}%")
        idx += 1

    where = "WHERE " + " AND ".join(conditions) if conditions else ""

    count_sql = f"SELECT COUNT(*) FROM planning_cases {where}"
    data_sql = f"""
        SELECT id, case_number, address, filing_date, case_type, council_district,
               community_plan_area, project_description, pdis_url, applicant,
               applicant_company, use_type, source, city, on_hold, completed, lat, lon
        FROM planning_cases {where}
        ORDER BY filing_date DESC NULLS LAST
        LIMIT ${idx} OFFSET ${idx+1}
    """
    params.extend([limit, offset])

    async with get_connection() as conn:
        total = await conn.fetchval(count_sql, *params[:-2])
        rows = await conn.fetch(data_sql, *params)

    results = [dict(r) for r in rows]

    if format == "geojson":
        features = []
        for r in results:
            features.append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [r["lon"], r["lat"]]} if r["lat"] and r["lon"] else None,
                "properties": {k: _serialize(v) for k, v in r.items() if k not in ("lat", "lon")},
            })
        return {"type": "FeatureCollection", "features": features, "total": total}

    for r in results:
        for k, v in r.items():
            r[k] = _serialize(v)
    return {"data": results, "total": total, "limit": limit, "offset": offset}


@router.get("/stats")
async def planning_stats():
    async with get_connection() as conn:
        total = await conn.fetchval("SELECT COUNT(*) FROM planning_cases")
        by_type = await conn.fetch(
            "SELECT case_type, COUNT(*) as cnt FROM planning_cases GROUP BY case_type ORDER BY cnt DESC"
        )
        by_city = await conn.fetch(
            "SELECT city, COUNT(*) as cnt FROM planning_cases GROUP BY city ORDER BY cnt DESC LIMIT 15"
        )
        recent_count = await conn.fetchval(
            "SELECT COUNT(*) FROM planning_cases WHERE filing_date >= CURRENT_DATE - INTERVAL '30 days'"
        )
    return {
        "total_cases": total,
        "by_type": [dict(r) for r in by_type],
        "by_city": [dict(r) for r in by_city],
        "last_30_days": recent_count,
    }


@router.get("/{case_number}")
async def get_planning_case(case_number: str):
    async with get_connection() as conn:
        row = await conn.fetchrow("SELECT * FROM planning_cases WHERE case_number = $1", case_number)
    if not row:
        return {"error": "Planning case not found"}, 404
    result = dict(row)
    for k, v in result.items():
        result[k] = _serialize(v)
    return result

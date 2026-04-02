"""Permit endpoints — browse, filter, and export LA building permits."""

from fastapi import APIRouter, Query
from typing import Optional
from ..database import get_connection

router = APIRouter()


@router.get("")
async def list_permits(
    permit_type: Optional[str] = Query(None, description="Filter by permit_type"),
    permit_sub_type: Optional[str] = Query(None),
    council_district: Optional[str] = Query(None),
    community_plan_area: Optional[str] = Query(None),
    zone: Optional[str] = Query(None),
    min_valuation: Optional[float] = Query(None),
    max_valuation: Optional[float] = Query(None),
    date_from: Optional[str] = Query(None, description="YYYY-MM-DD"),
    date_to: Optional[str] = Query(None, description="YYYY-MM-DD"),
    bbox: Optional[str] = Query(None, description="sw_lng,sw_lat,ne_lng,ne_lat"),
    q: Optional[str] = Query(None, description="Search address or work description"),
    format: Optional[str] = Query("json", description="json or geojson"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    """List permits with optional filters. Supports GeoJSON output."""
    conditions = []
    params = []
    idx = 1

    if permit_type:
        conditions.append(f"permit_type = ${idx}")
        params.append(permit_type)
        idx += 1
    if permit_sub_type:
        conditions.append(f"permit_sub_type = ${idx}")
        params.append(permit_sub_type)
        idx += 1
    if council_district:
        conditions.append(f"council_district = ${idx}")
        params.append(council_district)
        idx += 1
    if community_plan_area:
        conditions.append(f"community_plan_area = ${idx}")
        params.append(community_plan_area)
        idx += 1
    if zone:
        conditions.append(f"zone ILIKE ${idx}")
        params.append(f"%{zone}%")
        idx += 1
    if min_valuation is not None:
        conditions.append(f"valuation >= ${idx}")
        params.append(min_valuation)
        idx += 1
    if max_valuation is not None:
        conditions.append(f"valuation <= ${idx}")
        params.append(max_valuation)
        idx += 1
    if date_from:
        conditions.append(f"issue_date >= ${idx}::date")
        params.append(date_from)
        idx += 1
    if date_to:
        conditions.append(f"issue_date <= ${idx}::date")
        params.append(date_to)
        idx += 1
    if bbox:
        parts = bbox.split(",")
        if len(parts) == 4:
            sw_lng, sw_lat, ne_lng, ne_lat = [float(p) for p in parts]
            conditions.append(
                f"ST_Within(geom, ST_MakeEnvelope(${idx}, ${idx+1}, ${idx+2}, ${idx+3}, 4326))"
            )
            params.extend([sw_lng, sw_lat, ne_lng, ne_lat])
            idx += 4
    if q:
        conditions.append(f"(primary_address ILIKE ${idx} OR work_desc ILIKE ${idx})")
        params.append(f"%{q}%")
        idx += 1

    where = "WHERE " + " AND ".join(conditions) if conditions else ""

    # Count query
    count_sql = f"SELECT COUNT(*) FROM permits {where}"

    # Data query
    params.append(limit)
    params.append(offset)
    data_sql = f"""
        SELECT id, permit_nbr, primary_address, zip_code, council_district, apn,
               zone, community_plan_area, neighborhood_council, permit_group,
               permit_type, permit_sub_type, use_desc, submitted_date, issue_date,
               status_desc, valuation, square_footage, work_desc, contractor_name,
               lat, lon
        FROM permits {where}
        ORDER BY issue_date DESC NULLS LAST
        LIMIT ${idx} OFFSET ${idx+1}
    """

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

    # Serialize datetimes
    for r in results:
        for k, v in r.items():
            r[k] = _serialize(v)

    return {"data": results, "total": total, "limit": limit, "offset": offset}


@router.get("/stats")
async def permit_stats(
    council_district: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
):
    """Aggregate permit statistics."""
    conditions = []
    params = []
    idx = 1
    if council_district:
        conditions.append(f"council_district = ${idx}")
        params.append(council_district)
        idx += 1
    if date_from:
        conditions.append(f"issue_date >= ${idx}::date")
        params.append(date_from)
        idx += 1
    if date_to:
        conditions.append(f"issue_date <= ${idx}::date")
        params.append(date_to)
        idx += 1
    where = "WHERE " + " AND ".join(conditions) if conditions else ""

    async with get_connection() as conn:
        total = await conn.fetchval(f"SELECT COUNT(*) FROM permits {where}", *params)
        by_type = await conn.fetch(
            f"SELECT permit_type, COUNT(*) as cnt FROM permits {where} GROUP BY permit_type ORDER BY cnt DESC LIMIT 10",
            *params,
        )
        avg_val = await conn.fetchval(
            f"SELECT ROUND(AVG(valuation)::numeric, 2) FROM permits {where} AND valuation > 0",
            *params,
        ) if params else await conn.fetchval(
            "SELECT ROUND(AVG(valuation)::numeric, 2) FROM permits WHERE valuation > 0"
        )
        monthly = await conn.fetch(
            f"""SELECT TO_CHAR(issue_date, 'YYYY-MM') as month, COUNT(*) as cnt
                FROM permits {where} {"AND" if where else "WHERE"} issue_date IS NOT NULL
                GROUP BY month ORDER BY month DESC LIMIT 24""",
            *params,
        )

    return {
        "total_permits": total,
        "by_type": [dict(r) for r in by_type],
        "avg_valuation": float(avg_val) if avg_val else 0,
        "monthly_trend": [dict(r) for r in monthly],
    }


@router.get("/recent")
async def recent_permits(limit: int = Query(50, ge=1, le=200)):
    """Get the most recently issued permits."""
    async with get_connection() as conn:
        rows = await conn.fetch(
            """SELECT id, permit_nbr, primary_address, permit_type, permit_sub_type,
                      use_desc, issue_date, valuation, zone, council_district, lat, lon
               FROM permits ORDER BY issue_date DESC NULLS LAST LIMIT $1""",
            limit,
        )
    results = [dict(r) for r in rows]
    for r in results:
        for k, v in r.items():
            r[k] = _serialize(v)
    return {"data": results}


@router.get("/{permit_nbr}")
async def get_permit(permit_nbr: str):
    """Get a single permit by number."""
    async with get_connection() as conn:
        row = await conn.fetchrow("SELECT * FROM permits WHERE permit_nbr = $1", permit_nbr)
    if not row:
        return {"error": "Permit not found"}, 404
    result = dict(row)
    for k, v in result.items():
        result[k] = _serialize(v)
    return result


def _serialize(v):
    """Convert non-JSON-serializable values."""
    from datetime import datetime, date
    from decimal import Decimal
    if isinstance(v, (datetime, date)):
        return v.isoformat()
    if isinstance(v, Decimal):
        return float(v)
    return v

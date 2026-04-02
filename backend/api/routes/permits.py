import json
from typing import Optional

from fastapi import APIRouter, Query
from backend.api.database import get_pool

router = APIRouter()


@router.get("/stats")
async def permit_stats():
    pool = await get_pool()
    async with pool.acquire() as conn:
        total = await conn.fetchval("SELECT COUNT(*) FROM permits")
        by_type = await conn.fetch(
            "SELECT permit_type, COUNT(*) as count FROM permits "
            "GROUP BY permit_type ORDER BY count DESC LIMIT 10"
        )
        avg_val = await conn.fetchval(
            "SELECT ROUND(AVG(valuation)::numeric, 2) FROM permits WHERE valuation > 0"
        )
        monthly_trend = await conn.fetch(
            "SELECT date_trunc('month', issue_date) as month, COUNT(*) as count "
            "FROM permits WHERE issue_date IS NOT NULL "
            "GROUP BY month ORDER BY month DESC LIMIT 12"
        )
    return {
        "total": total,
        "by_type": [dict(r) for r in by_type],
        "avg_valuation": float(avg_val) if avg_val else 0,
        "monthly_trend": [
            {"month": r["month"].isoformat() if r["month"] else None, "count": r["count"]}
            for r in monthly_trend
        ],
    }


@router.get("/recent")
async def recent_permits():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, permit_nbr, primary_address, permit_type, permit_sub_type, "
            "issue_date, valuation, zone, status_desc, lat, lon "
            "FROM permits ORDER BY issue_date DESC NULLS LAST LIMIT 50"
        )
    return [dict(r) for r in rows]


@router.get("/{permit_nbr}")
async def get_permit(permit_nbr: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, permit_nbr, primary_address, zip_code, council_district, "
            "pin_nbr, apn, zone, area_planning_commission, community_plan_area, "
            "neighborhood_council, census_tract, permit_group, permit_type, "
            "permit_sub_type, use_code, use_desc, submitted_date, issue_date, "
            "status_desc, status_date, valuation, square_footage, construction, "
            "work_desc, contractor_name, ev, solar, lat, lon, created_at, updated_at "
            "FROM permits WHERE permit_nbr = $1",
            permit_nbr,
        )
    if not row:
        return {"error": "Permit not found"}
    return dict(row)


@router.get("")
async def list_permits(
    permit_type: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    council_district: Optional[str] = None,
    community_plan_area: Optional[str] = None,
    zone: Optional[str] = None,
    min_valuation: Optional[float] = None,
    max_valuation: Optional[float] = None,
    bbox: Optional[str] = None,
    format: Optional[str] = None,
    limit: int = Query(default=50, le=1000),
    offset: int = Query(default=0, ge=0),
):
    pool = await get_pool()
    conditions = []
    params = []
    idx = 1

    if permit_type:
        conditions.append(f"permit_type = ${idx}")
        params.append(permit_type)
        idx += 1
    if date_from:
        conditions.append(f"issue_date >= ${idx}::timestamp")
        params.append(date_from)
        idx += 1
    if date_to:
        conditions.append(f"issue_date <= ${idx}::timestamp")
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
    if zone:
        conditions.append(f"zone = ${idx}")
        params.append(zone)
        idx += 1
    if min_valuation is not None:
        conditions.append(f"valuation >= ${idx}")
        params.append(min_valuation)
        idx += 1
    if max_valuation is not None:
        conditions.append(f"valuation <= ${idx}")
        params.append(max_valuation)
        idx += 1
    if bbox:
        parts = bbox.split(",")
        if len(parts) == 4:
            west, south, east, north = parts
            conditions.append(
                f"ST_Within(geom, ST_MakeEnvelope(${idx}, ${idx+1}, ${idx+2}, ${idx+3}, 4326))"
            )
            params.extend([float(west), float(south), float(east), float(north)])
            idx += 4

    where = " WHERE " + " AND ".join(conditions) if conditions else ""

    async with pool.acquire() as conn:
        count = await conn.fetchval(f"SELECT COUNT(*) FROM permits{where}", *params)

        if format == "geojson":
            rows = await conn.fetch(
                f"SELECT id, permit_nbr, primary_address, permit_type, issue_date, "
                f"valuation, zone, status_desc, lat, lon, "
                f"ST_AsGeoJSON(geom)::json as geometry "
                f"FROM permits{where} ORDER BY issue_date DESC NULLS LAST "
                f"LIMIT ${idx} OFFSET ${idx+1}",
                *params, limit, offset,
            )
            features = []
            for r in rows:
                props = dict(r)
                geom = props.pop("geometry", None)
                props.pop("lat", None)
                props.pop("lon", None)
                features.append({
                    "type": "Feature",
                    "geometry": geom,
                    "properties": props,
                })
            return {
                "type": "FeatureCollection",
                "features": features,
                "total": count,
            }

        rows = await conn.fetch(
            f"SELECT id, permit_nbr, primary_address, permit_type, permit_sub_type, "
            f"issue_date, valuation, zone, status_desc, council_district, "
            f"community_plan_area, lat, lon "
            f"FROM permits{where} ORDER BY issue_date DESC NULLS LAST "
            f"LIMIT ${idx} OFFSET ${idx+1}",
            *params, limit, offset,
        )

    return {
        "data": [dict(r) for r in rows],
        "total": count,
        "limit": limit,
        "offset": offset,
    }

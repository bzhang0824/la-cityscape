"""Places endpoints — council districts, CPAs, neighborhoods."""

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
async def list_places(place_type: Optional[str] = Query(None)):
    """List places, optionally filtered by type."""
    if place_type:
        sql = "SELECT id, name, place_type, slug, properties FROM places WHERE place_type = $1 ORDER BY name"
        async with get_connection() as conn:
            rows = await conn.fetch(sql, place_type)
    else:
        sql = "SELECT id, name, place_type, slug, properties FROM places ORDER BY place_type, name"
        async with get_connection() as conn:
            rows = await conn.fetch(sql)
    return {"data": [dict(r) for r in rows]}


@router.get("/{slug}")
async def get_place(slug: str):
    """Get place detail with boundary GeoJSON and aggregated stats."""
    async with get_connection() as conn:
        place = await conn.fetchrow(
            """SELECT id, name, place_type, slug, properties,
                      ST_AsGeoJSON(boundary)::jsonb as boundary_geojson
               FROM places WHERE slug = $1""",
            slug,
        )
        if not place:
            return {"error": "Place not found"}, 404

        place_dict = dict(place)
        place_type = place_dict["place_type"]
        name = place_dict["name"]

        # Get permit stats for this place
        if place_type == "council_district":
            col = "council_district"
        elif place_type == "community_plan_area":
            col = "community_plan_area"
        elif place_type == "neighborhood_council":
            col = "neighborhood_council"
        else:
            col = "zip_code"

        permit_count = await conn.fetchval(
            f"SELECT COUNT(*) FROM permits WHERE {col} = $1", name
        )
        recent_permits = await conn.fetch(
            f"""SELECT permit_nbr, primary_address, permit_type, issue_date, valuation, lat, lon
                FROM permits WHERE {col} = $1
                ORDER BY issue_date DESC NULLS LAST LIMIT 20""",
            name,
        )
        top_types = await conn.fetch(
            f"""SELECT permit_type, COUNT(*) as cnt FROM permits
                WHERE {col} = $1 GROUP BY permit_type ORDER BY cnt DESC LIMIT 5""",
            name,
        )
        planning_count = await conn.fetchval(
            f"SELECT COUNT(*) FROM planning_cases WHERE {col} = $1", name
        )

    recent = [dict(r) for r in recent_permits]
    for r in recent:
        for k, v in r.items():
            r[k] = _serialize(v)

    return {
        "place": {
            "name": place_dict["name"],
            "type": place_dict["place_type"],
            "slug": place_dict["slug"],
            "properties": place_dict["properties"],
            "boundary": place_dict["boundary_geojson"],
        },
        "stats": {
            "permit_count": permit_count,
            "planning_case_count": planning_count,
            "top_permit_types": [dict(r) for r in top_types],
        },
        "recent_permits": recent,
    }

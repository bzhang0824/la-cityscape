from typing import Optional

from fastapi import APIRouter
from backend.api.database import get_pool

router = APIRouter()


@router.get("")
async def list_places(place_type: Optional[str] = None):
    pool = await get_pool()
    async with pool.acquire() as conn:
        if place_type:
            rows = await conn.fetch(
                "SELECT id, name, place_type, slug, properties "
                "FROM places WHERE place_type = $1 ORDER BY name",
                place_type,
            )
        else:
            rows = await conn.fetch(
                "SELECT id, name, place_type, slug, properties FROM places ORDER BY place_type, name"
            )
    return [dict(r) for r in rows]


@router.get("/{slug}")
async def get_place(slug: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, name, place_type, slug, properties, "
            "ST_AsGeoJSON(boundary)::json as boundary_geojson "
            "FROM places WHERE slug = $1",
            slug,
        )
        if not row:
            return {"error": "Place not found"}

        place = dict(row)

        permit_count = await conn.fetchval(
            "SELECT COUNT(*) FROM permits p, places pl "
            "WHERE pl.slug = $1 AND ST_Within(p.geom, pl.boundary)",
            slug,
        )
        top_types = await conn.fetch(
            "SELECT p.permit_type, COUNT(*) as count FROM permits p, places pl "
            "WHERE pl.slug = $1 AND ST_Within(p.geom, pl.boundary) "
            "GROUP BY p.permit_type ORDER BY count DESC LIMIT 5",
            slug,
        )
        recent_permits = await conn.fetch(
            "SELECT p.id, p.permit_nbr, p.primary_address, p.permit_type, "
            "p.issue_date, p.valuation FROM permits p, places pl "
            "WHERE pl.slug = $1 AND ST_Within(p.geom, pl.boundary) "
            "ORDER BY p.issue_date DESC NULLS LAST LIMIT 10",
            slug,
        )

    place["stats"] = {
        "permit_count": permit_count,
        "top_permit_types": [dict(r) for r in top_types],
        "recent_permits": [dict(r) for r in recent_permits],
    }
    return place

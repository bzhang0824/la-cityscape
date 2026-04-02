from fastapi import APIRouter
from backend.api.database import get_pool

router = APIRouter()


@router.get("/{address:path}")
async def property_report(address: str):
    pool = await get_pool()
    addr_upper = address.upper()

    async with pool.acquire() as conn:
        permits = await conn.fetch(
            "SELECT id, permit_nbr, permit_type, permit_sub_type, issue_date, "
            "submitted_date, valuation, square_footage, work_desc, status_desc, "
            "zone, contractor_name, council_district, community_plan_area, "
            "neighborhood_council, lat, lon "
            "FROM permits WHERE UPPER(primary_address) = $1 "
            "ORDER BY issue_date DESC NULLS LAST",
            addr_upper,
        )

        first_permit = await conn.fetchrow(
            "SELECT zone, council_district, community_plan_area, "
            "neighborhood_council, census_tract, apn, lat, lon "
            "FROM permits WHERE UPPER(primary_address) = $1 "
            "AND zone IS NOT NULL LIMIT 1",
            addr_upper,
        )

        nearby_planning = []
        if first_permit and first_permit["lat"] and first_permit["lon"]:
            nearby_planning = await conn.fetch(
                "SELECT id, case_number, address, case_type, filing_date, "
                "project_description, pdis_url "
                "FROM planning_cases "
                "WHERE ST_DWithin(geom::geography, "
                "ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 402) "
                "ORDER BY filing_date DESC NULLS LAST LIMIT 20",
                first_permit["lon"],
                first_permit["lat"],
            )

    property_info = {}
    if first_permit:
        property_info = {
            "zone": first_permit["zone"],
            "council_district": first_permit["council_district"],
            "community_plan_area": first_permit["community_plan_area"],
            "neighborhood_council": first_permit["neighborhood_council"],
            "census_tract": first_permit["census_tract"],
            "apn": first_permit["apn"],
            "lat": first_permit["lat"],
            "lon": first_permit["lon"],
        }

    return {
        "address": address,
        "property_info": property_info,
        "permits": [dict(r) for r in permits],
        "permit_count": len(permits),
        "nearby_planning_cases": [dict(r) for r in nearby_planning],
    }

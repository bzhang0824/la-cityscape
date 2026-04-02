"""Property report endpoint — aggregated data for a single address."""

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


@router.get("/{address:path}")
async def property_report(address: str):
    """Aggregated property report for a given address.

    Returns all permits, nearby planning cases, and area context.
    """
    async with get_connection() as conn:
        # Exact match permits at this address
        permits = await conn.fetch(
            """SELECT permit_nbr, permit_type, permit_sub_type, use_desc,
                      submitted_date, issue_date, status_desc, valuation,
                      square_footage, work_desc, contractor_name, zone,
                      council_district, community_plan_area, lat, lon
               FROM permits
               WHERE primary_address ILIKE $1
               ORDER BY issue_date DESC NULLS LAST""",
            f"%{address}%",
        )

        # Get the lat/lon from the first permit to find nearby planning cases
        lat, lon = None, None
        if permits:
            first = permits[0]
            lat, lon = first["lat"], first["lon"]

        # Get zoning and district info from the most recent permit
        zoning = None
        council_district = None
        cpa = None
        if permits:
            latest = dict(permits[0])
            zoning = latest.get("zone")
            council_district = latest.get("council_district")
            cpa = latest.get("community_plan_area")

        # Nearby planning cases (within ~0.25 miles / 400m)
        nearby_planning = []
        if lat and lon:
            nearby_planning = await conn.fetch(
                """SELECT case_number, address, case_type, filing_date,
                          project_description, pdis_url, use_type, lat, lon
                   FROM planning_cases
                   WHERE ST_DWithin(
                       geom,
                       ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
                       400
                   )
                   ORDER BY filing_date DESC NULLS LAST
                   LIMIT 20""",
                lon,
                lat,
            )

    permit_list = [dict(r) for r in permits]
    for r in permit_list:
        for k, v in r.items():
            r[k] = _serialize(v)

    planning_list = [dict(r) for r in nearby_planning]
    for r in planning_list:
        for k, v in r.items():
            r[k] = _serialize(v)

    return {
        "address": address,
        "location": {"lat": lat, "lon": lon} if lat and lon else None,
        "zoning": zoning,
        "council_district": council_district,
        "community_plan_area": cpa,
        "permit_count": len(permit_list),
        "permits": permit_list,
        "nearby_planning_cases": planning_list,
    }

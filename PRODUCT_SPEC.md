# LA Cityscape — Product Specification

## Vision
LA Cityscape is a construction intelligence platform for Los Angeles — the Chicago Cityscape equivalent for LA. It aggregates building permits, zoning data, planning cases, property ownership, and development news into a single searchable interface with interactive maps, alerts, and export capabilities.

## Target Customers
1. Real estate developers (site selection, feasibility, zoning due diligence)
2. Architects & AEC firms (permit tracking, zoning standards)
3. Real estate brokers (property reports, market analysis)
4. Zoning & land use attorneys (zoning history, case tracking)
5. Construction material/service sales (lead generation from permits)
6. Community organizations & residents (neighborhood monitoring)

## Revenue Model
- **Free tier**: Basic search, limited property reports, permit browsing
- **Pro tier ($99/mo)**: Unlimited reports, full Property Finder, exports, alerts
- **One-time reports ($55)**: Individual property reports for non-subscribers
- **Data products**: GIS layers, bulk exports, API access

## Data Sources

| Data | Source | API |
|------|--------|-----|
| Building Permits (2020+) | LADBS | `data.lacity.org/resource/pi9x-tg5x.json` (Socrata) |
| Building Permits (2012-2019) | LADBS | `data.lacity.org/resource/vdg9-hy7c.json` (Socrata) |
| Planning Cases | LA City Planning | `planning.lacity.org/dcpapi/general/newcases` |
| Zoning | LA GeoHub | ArcGIS Feature Service |
| Parcel Data | LA County Assessor | GeoHub / Assessor Portal |
| Council Districts | LA GeoHub | ArcGIS Feature Service |
| Community Plan Areas | LA GeoHub | ArcGIS Feature Service |

## Tech Stack

### Backend
- Python 3.12 + FastAPI
- PostgreSQL with PostGIS
- GitHub Actions (nightly pipelines)

### Frontend
- Next.js 16 (App Router)
- Tailwind CSS
- Leaflet.js (react-leaflet)
- Recharts
- Lucide React icons

## Architecture

```
GitHub Actions (Nightly)
  ├── Permit Sync (Socrata API)
  └── Planning Cases (PDIS API)
         │
         ▼
  PostgreSQL + PostGIS
         │
         ▼
  FastAPI Backend
  /api/permits, /api/planning, /api/places, /api/search, /api/property
         │
         ▼
  Next.js Frontend
  Maps, Permits Browser, Property Reports, Place Reports, Pricing
```

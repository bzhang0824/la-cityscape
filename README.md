# LA Cityscape

Construction intelligence platform for Los Angeles — track building permits, planning cases, and development activity across LA's neighborhoods and council districts.

Modeled on [Chicago Cityscape](https://www.chicagocityscape.com/), built for the LA market.

## Architecture

```
la-cityscape/
├── backend/
│   ├── api/            # FastAPI REST API
│   │   ├── main.py     # App entrypoint with 5 routers
│   │   ├── config.py   # Environment config (Pydantic Settings)
│   │   ├── database.py # Async PostgreSQL connection pool
│   │   └── routes/
│   │       ├── permits.py    # Permit CRUD, filtering, GeoJSON
│   │       ├── planning.py   # Planning case search + GeoJSON
│   │       ├── places.py     # Neighborhoods & council districts
│   │       ├── property.py   # Property lookup by address
│   │       └── search.py     # Global search across entities
│   ├── pipelines/
│   │   ├── permits/
│   │   │   └── sync_permits.py    # Socrata API sync (LADBS permits)
│   │   └── planning/
│   │       └── sync_planning.py   # LA City Planning API sync
│   ├── schema.sql      # PostgreSQL + PostGIS schema
│   └── requirements.txt
├── frontend/           # Next.js 14 (App Router)
│   ├── src/
│   │   ├── app/        # 7 routes (/, /permits, /planning, /places, /pricing, etc.)
│   │   ├── components/ # Map, table, filter, chart components
│   │   └── lib/        # Mock data, types, utilities
│   └── ...
└── .github/workflows/  # GitHub Actions for nightly data sync
```

## Data Sources

| Source | Dataset | Sync Schedule |
|--------|---------|---------------|
| [LADBS Permits (Socrata)](https://data.lacity.org/resource/pi9x-tg5x.json) | Building, electrical, mechanical, plumbing permits | Daily 4am UTC |
| [LADBS Commercial Permits](https://data.lacity.org/resource/vdg9-hy7c.json) | Commercial/industrial permits | Daily 4am UTC |
| [LA City Planning API](https://planning.lacity.org/dcpapi/general/newcases) | Planning cases, environmental reviews, zone changes | Daily 5am UTC |

## Tech Stack

**Backend:** Python 3.11, FastAPI, asyncpg, PostgreSQL + PostGIS, httpx  
**Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Leaflet.js, Recharts  
**Infrastructure:** Neon PostgreSQL, GitHub Actions (cron pipelines), Vercel (frontend)

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ with PostGIS extension
- A [Neon](https://neon.tech) database (or any PostgreSQL instance)

### Database Setup

1. Create a Neon project and database
2. Enable PostGIS:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```
3. Run the schema:
   ```bash
   psql $DATABASE_URL -f backend/schema.sql
   ```

### Backend

```bash
cd backend
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://user:pass@host/dbname"

# Run the API
uvicorn api.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install

# For development (uses mock data by default)
npm run dev

# Production build
npm run build
npm start
```

The frontend runs at `http://localhost:3000` with mock data for all LA neighborhoods. Connect to the live API by setting `NEXT_PUBLIC_API_URL`.

### Data Pipelines

Run manually or via GitHub Actions:

```bash
# Sync permits from LADBS Socrata
python -m backend.pipelines.permits.sync_permits

# Sync planning cases from LA City Planning
python -m backend.pipelines.planning.sync_planning
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes (backend) |
| `NEXT_PUBLIC_API_URL` | Backend API URL | No (defaults to mock data) |

### GitHub Actions Secrets

For automated nightly sync, add these repository secrets:

| Secret | Description |
|--------|-------------|
| `NEON_DATABASE_URL` | Full Neon PostgreSQL connection string |

## Features

- **Permit Explorer** — Search, filter, and map 100K+ LA building permits by type, status, date, location
- **Planning Cases** — Track zone changes, environmental reviews, conditional use permits
- **Place Profiles** — Activity dashboards for all 35 community plan areas and 15 council districts
- **Property Lookup** — Full permit and planning history for any LA address
- **Interactive Maps** — Leaflet.js with dark CARTO tiles, clustered markers, GeoJSON overlays
- **Real-time Data** — Nightly sync from LADBS Socrata and LA City Planning APIs

## Roadmap

- [ ] Zoning overlay maps (ZIMAS integration)
- [ ] Construction timeline tracking (inspection data)
- [ ] Developer/contractor profiles and rankings
- [ ] Email alerts for new permits in saved areas
- [ ] Pro subscription tier with API access
- [ ] Census and demographic data overlays
- [ ] Historical permit trend analysis

## Related Projects

- [Aiva Backend](https://github.com/bzhang0824/aiva-backend-v1) — Construction data ETL pipelines for 13 LA County cities
- [Aiva](https://www.aivabuild.com) — AI-powered construction intelligence

## License

Private — All rights reserved.

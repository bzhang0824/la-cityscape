# LA Cityscape

Construction intelligence platform for Los Angeles. Track building permits, planning cases, and development activity across the city with interactive maps and data tools.

## Features

- **Permits Browser** — Search and filter 38K+ LADBS building permits with an interactive map
- **Planning Cases** — Browse LA City Planning cases (ENV, CPC, DIR, VTT, TT, ZA, EAR)
- **Property Reports** — Deep-dive on any LA address: permits, zoning, planning cases
- **Place Reports** — Area-level views for council districts, community plan areas, neighborhoods
- **Daily Sync** — Automated pipelines pull fresh data from LADBS and LA City Planning APIs

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, Tailwind CSS, Leaflet, Recharts |
| Backend | Python 3.12, FastAPI, asyncpg |
| Database | PostgreSQL + PostGIS |
| Pipelines | GitHub Actions (daily cron) |
| Data Sources | LADBS Socrata API, LA City Planning API |

## Project Structure

```
├── backend/
│   ├── schema.sql              # PostgreSQL + PostGIS schema
│   ├── api/
│   │   ├── main.py             # FastAPI app
│   │   ├── config.py           # Settings from env vars
│   │   ├── database.py         # Async PostgreSQL pool
│   │   └── routes/
│   │       ├── permits.py      # Permit CRUD + filters + GeoJSON
│   │       ├── planning.py     # Planning case endpoints
│   │       ├── places.py       # Place listing + detail
│   │       ├── search.py       # Cross-entity search
│   │       └── property.py     # Aggregated property reports
│   ├── pipelines/
│   │   ├── permits/
│   │   │   └── sync_permits.py # LADBS Socrata sync
│   │   └── planning/
│   │       └── sync_planning.py # LA City Planning sync
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # React components
│   │   └── lib/mock-data.ts    # Demo data (55 permits, 23 cases)
│   └── package.json
├── .github/workflows/
│   ├── sync-permits.yml        # Daily at 4am UTC
│   └── sync-planning.yml       # Daily at 5am UTC
└── PRODUCT_SPEC.md
```

## Setup

### Prerequisites

- Node.js 20+
- Python 3.12+
- PostgreSQL with PostGIS extension

### Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

The frontend includes comprehensive mock data and works as a fully functional demo without the backend.

### Backend

```bash
cd backend
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
psql $DATABASE_URL < schema.sql

# Run API server
uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8000
```

### Data Pipelines

```bash
# Sync building permits
python -m backend.pipelines.permits.sync_permits

# Sync planning cases
python -m backend.pipelines.planning.sync_planning
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/permits` | List permits with filters |
| GET | `/api/permits/stats` | Permit aggregate stats |
| GET | `/api/permits/recent` | Latest 50 permits |
| GET | `/api/permits/{permit_nbr}` | Single permit detail |
| GET | `/api/planning` | List planning cases |
| GET | `/api/planning/stats` | Planning case stats |
| GET | `/api/planning/{case_number}` | Single case detail |
| GET | `/api/places` | List places by type |
| GET | `/api/places/{slug}` | Place detail + stats |
| GET | `/api/search?q=` | Cross-entity search |
| GET | `/api/property/{address}` | Property report |
| GET | `/api/health` | Health check |

## Data Sources

- **LADBS Building Permits**: `data.lacity.org/resource/pi9x-tg5x.json` (2020+) and `vdg9-hy7c.json` (2012-2019)
- **LA City Planning Cases**: `planning.lacity.org/dcpapi/general/newcases`

## License

Proprietary. All rights reserved.

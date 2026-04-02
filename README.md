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
│   │   └── lib/
│   │       ├── supabase.ts  # Supabase client + usage examples
│   │       └── mock-data.ts # Development mock data
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

**Backend:** Python 3.11, FastAPI, asyncpg, Supabase (PostgreSQL + PostGIS), httpx
**Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Leaflet.js, Recharts, @supabase/supabase-js
**Infrastructure:** Supabase (database + auth + storage), GitHub Actions (cron pipelines), Vercel (frontend)

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Enable PostGIS: Dashboard > Database > Extensions > search "postgis" > Enable
3. Run the schema: Dashboard > SQL Editor > paste contents of `backend/schema.sql` > Run
4. Copy your credentials from Project Settings:
   - **Database URL**: Settings > Database > Connection string > URI (use Transaction pooler, port 6543)
   - **API URL**: Settings > API > Project URL
   - **Anon Key**: Settings > API > `anon` `public` key

### 2. Backend

```bash
cd backend
pip install -r requirements.txt

# Create .env from the example
cp .env.example .env
# Fill in your Supabase DATABASE_URL

# Run the API
uvicorn api.main:app --reload --port 8000
```

API docs at `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend
npm install

# Create .env.local from the example
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Development (uses mock data by default)
npm run dev

# Production build
npm run build && npm start
```

### 4. Data Pipelines

Run manually or via GitHub Actions:

```bash
# Set DATABASE_URL in your environment first
export DATABASE_URL="postgresql://postgres.[ref]:[pass]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# Sync permits from LADBS Socrata
python -m backend.pipelines.permits.sync_permits

# Sync planning cases from LA City Planning
python -m backend.pipelines.planning.sync_planning
```

### 5. GitHub Actions (Automated Nightly Sync)

Add these secrets in your repo Settings > Secrets and variables > Actions:

| Secret | Value | Where to find it |
|--------|-------|------------------|
| `SUPABASE_DB_URL` | PostgreSQL connection string | Supabase > Settings > Database > URI |
| `SOCRATA_APP_TOKEN` | Socrata API token (optional) | [data.lacity.org](https://data.lacity.org) developer settings |

## Features

- **Permit Explorer** — Search, filter, and map 100K+ LA building permits by type, status, date, location
- **Planning Cases** — Track zone changes, environmental reviews, conditional use permits
- **Place Profiles** — Activity dashboards for all 35 community plan areas and 15 council districts
- **Property Lookup** — Full permit and planning history for any LA address
- **Interactive Maps** — Leaflet.js with dark CARTO tiles, clustered markers, GeoJSON overlays
- **Real-time Data** — Nightly sync from LADBS Socrata and LA City Planning APIs
- **Supabase Auth** — Ready for user accounts and Pro subscription gating (coming soon)

## Roadmap

- [ ] User auth with Supabase (Google, email/password)
- [ ] Pro subscription tier with Stripe + Supabase RLS
- [ ] Zoning overlay maps (ZIMAS integration)
- [ ] Construction timeline tracking (inspection data)
- [ ] Developer/contractor profiles and rankings
- [ ] Email alerts for new permits in saved areas
- [ ] Census and demographic data overlays
- [ ] Historical permit trend analysis

## Related Projects

- [Aiva Backend](https://github.com/bzhang0824/aiva-backend-v1) — Construction data ETL pipelines for 13 LA County cities
- [Aiva](https://www.aivabuild.com) — AI-powered construction intelligence

## License

Private — All rights reserved.

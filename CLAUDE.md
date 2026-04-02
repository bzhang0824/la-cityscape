# LA Cityscape — Claude Code Context

## What This Is
Construction intelligence platform for Los Angeles, modeled on [Chicago Cityscape](https://www.chicagocityscape.com/). Tracks building permits, planning cases, and development activity across LA neighborhoods and council districts.

## Current State (April 2, 2026)

### What's Working
- **Schema deployed** to Supabase (4 tables: `permits`, `planning_cases`, `places`, `pipeline_runs`)
- **17,105 permits** synced from LADBS Socrata API (recent data only)
- **88 planning cases** synced from LA City Planning API
- **Frontend** builds and deploys as static Next.js export (80 pages, mock data)
- **GitHub Actions** configured for nightly sync (permits at 4am UTC, planning at 5am UTC)

### What Needs Doing

#### 1. Full Permit Backfill (Priority)
The current 17K permits are just recent ones. The Socrata API has **hundreds of thousands** of historical permits. Run:
```bash
DATABASE_URL="postgresql://postgres.zfzxaewuhajsazlitebj:3Stressfree!@aws-1-us-west-1.pooler.supabase.com:6543/postgres" \
SOCRATA_APP_TOKEN="uwj4vjF8r5nMul88Vj9I5iI9T" \
python -m backend.pipelines.permits.sync_permits
```
This pages through 50,000 records at a time. Expect it to take 10-30 minutes for the full backfill. The pipeline does upserts, so it's safe to re-run.

**Datasets:**
- `pi9x-tg5x` — 2020-present (primary)
- `vdg9-hy7c` — 2012-2019 (legacy)

#### 2. Connect Frontend to Live Data
The frontend currently uses mock data in `frontend/src/lib/mock-data.ts`. To switch to live Supabase:
- The Supabase client is already set up at `frontend/src/lib/supabase.ts`
- Create `frontend/.env.local` with:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://zfzxaewuhajsazlitebj.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmenhhZXd1aGFqc2F6bGl0ZWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTY5MzIsImV4cCI6MjA5MDczMjkzMn0.XdYXLpndchY70eukp5-BiaQl4WYmQ3Fj1rV7di1mFZU
  ```
- Replace mock data imports with Supabase queries in page components
- **Important**: Set up Row Level Security (RLS) policies on Supabase tables — currently tables have no RLS, so the anon key can read everything (fine for public data, but enable RLS before adding auth)

#### 3. Supabase Auth + Pro Subscriptions
- Supabase auth is ready to wire up (client initialized)
- Pricing page exists at `/pricing` with mock tiers
- Plan: use Supabase RLS to gate Pro features at the database level

#### 4. Deploy Frontend to Vercel
- Currently deployed as static export to S3 (temporary)
- For production: connect repo to Vercel, set root to `frontend/`, add env vars

## Key Technical Notes

### Supabase Connection Pooler
All asyncpg connections MUST use `statement_cache_size=0` because Supabase's transaction pooler (port 6543) doesn't support prepared statements. This is already set in:
- `backend/api/database.py`
- `backend/pipelines/permits/sync_permits.py`
- `backend/pipelines/planning/sync_planning.py`

### API URLs
- LADBS Socrata: `https://data.lacity.org/resource/pi9x-tg5x.json` (no key needed, token increases rate limit)
- LA City Planning: `https://planning.lacity.gov/dcpapi/general/newcases` (note: `.gov` not `.org`)

### GitHub Secrets Needed
| Secret | Value |
|--------|-------|
| `SUPABASE_DB_URL` | `postgresql://postgres.zfzxaewuhajsazlitebj:3Stressfree!@aws-1-us-west-1.pooler.supabase.com:6543/postgres` |
| `SOCRATA_APP_TOKEN` | `uwj4vjF8r5nMul88Vj9I5iI9T` |

### Frontend Stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Leaflet.js (maps), Recharts (charts), @supabase/supabase-js
- Static export enabled (`output: 'export'` in next.config.ts)
- Design: Navy #0F172A + teal #0EA5E9, Inter + DM Sans fonts

### Related Repos
- [aiva-backend-v1](https://github.com/bzhang0824/aiva-backend-v1) — Existing construction ETL pipelines for 13 LA County cities
- [aiva-new](https://github.com/ryyeung/aiva-new) — Existing Aiva frontend

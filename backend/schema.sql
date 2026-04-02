-- LA Cityscape Database Schema
-- PostgreSQL + PostGIS

CREATE EXTENSION IF NOT EXISTS postgis;

-- =====================================================-- PERMITS (from LADBS Socrata API)
-- =====================================================-- PLANNING CASES (from LA City Planning API + County portals)
-- =====================================================CREATE TABLE IF NOT EXISTS planning_cases (
    id                      SERIAL PRIMARY KEY,
    case_number             TEXT UNIQUE NOT NULL,
    address                 TEXT,
    filing_date             DATE,
    case_type               TEXT,
    council_district        TEXT,
    community_plan_area     TEXT,
    project_description     TEXT,
    pdis_url                TEXT,
    applicant               TEXT,
    applicant_company       TEXT,
    representative          TEXT,
    representative_company  TEXT,
    entitlements_requested  TEXT,
    environmental_flag      TEXT,
    on_hold                 BOOLEAN DEFAULT FALSE,
    completed               BOOLEAN DEFAULT FALSE,
    use_type                TEXT,
    source                  TEXT,
    city                    TEXT DEFAULT 'Los Angeles',
    lat                     DOUBLE PRECISION,
    lon                     DOUBLE PRECISION,
    geom                    GEOMETRY(Point, 4326),
    raw_data                JSONB,
    created_at              TIMESTAMP DEFAULT NOW(),
    updated_at              TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planning_case_number  ON planning_cases (case_number);
CREATE INDEX IF NOT EXISTS idx_planning_case_type    ON planning_cases (case_type);
CREATE INDEX IF NOT EXISTS idx_planning_filing_date  ON planning_cases (filing_date DESC);
CREATE INDEX IF NOT EXISTS idx_planning_cd           ON planning_cases (council_district);
CREATE INDEX IF NOT EXISTS idx_planning_cpa          ON planning_cases (community_plan_area);
CREATE INDEX IF NOT EXISTS idx_planning_geom         ON planning_cases USING GIST (geom);

-- =====================================================CREATE TABLE IF NOT EXISTS places (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    place_type  TEXT NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    boundary    GEOMETRY(MultiPolygon, 4326),
    properties  JSONB,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_places_type     ON places (place_type);
CREATE INDEX IF NOT EXISTS idx_places_slug     ON places (slug);
CREATE INDEX IF NOT EXISTS idx_places_boundary ON places USING GIST (boundary);

-- =====================================================-- PIPELINE RUNS (health tracking)
-- =====================================================
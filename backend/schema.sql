-- LA Cityscape Database Schema
-- PostgreSQL + PostGIS

CREATE EXTENSION IF NOT EXISTS postgis;

-- Permits table (from LADBS Socrata API)
CREATE TABLE IF NOT EXISTS permits (
    id SERIAL PRIMARY KEY,
    permit_nbr TEXT UNIQUE NOT NULL,
    primary_address TEXT,
    zip_code TEXT,
    council_district TEXT,
    pin_nbr TEXT,
    apn TEXT,
    zone TEXT,
    area_planning_commission TEXT,
    community_plan_area TEXT,
    neighborhood_council TEXT,
    census_tract TEXT,
    permit_group TEXT,
    permit_type TEXT,
    permit_sub_type TEXT,
    use_code TEXT,
    use_desc TEXT,
    submitted_date TIMESTAMP,
    issue_date TIMESTAMP,
    status_desc TEXT,
    status_date TIMESTAMP,
    valuation NUMERIC,
    square_footage NUMERIC,
    construction TEXT,
    work_desc TEXT,
    contractor_name TEXT,
    ev BOOLEAN DEFAULT FALSE,
    solar BOOLEAN DEFAULT FALSE,
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326),
    raw_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_permits_address ON permits (primary_address);
CREATE INDEX IF NOT EXISTS idx_permits_zone ON permits (zone);
CREATE INDEX IF NOT EXISTS idx_permits_type ON permits (permit_type);
CREATE INDEX IF NOT EXISTS idx_permits_issue_date ON permits (issue_date DESC);
CREATE INDEX IF NOT EXISTS idx_permits_cd ON permits (council_district);
CREATE INDEX IF NOT EXISTS idx_permits_cpa ON permits (community_plan_area);
CREATE INDEX IF NOT EXISTS idx_permits_geom ON permits USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_permits_valuation ON permits (valuation);

-- Planning cases (from LA City Planning API + Aiva pipelines)
CREATE TABLE IF NOT EXISTS planning_cases (
    id SERIAL PRIMARY KEY,
    case_number TEXT UNIQUE NOT NULL,
    address TEXT,
    filing_date DATE,
    case_type TEXT,
    council_district TEXT,
    community_plan_area TEXT,
    project_description TEXT,
    pdis_url TEXT,
    applicant TEXT,
    applicant_company TEXT,
    representative TEXT,
    representative_company TEXT,
    entitlements_requested TEXT,
    environmental_flag TEXT,
    on_hold BOOLEAN DEFAULT FALSE,
    completed BOOLEAN DEFAULT FALSE,
    use_type TEXT,
    source TEXT,
    city TEXT DEFAULT 'Los Angeles',
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326),
    raw_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_planning_case_number ON planning_cases (case_number);
CREATE INDEX IF NOT EXISTS idx_planning_case_type ON planning_cases (case_type);
CREATE INDEX IF NOT EXISTS idx_planning_filing_date ON planning_cases (filing_date DESC);
CREATE INDEX IF NOT EXISTS idx_planning_cd ON planning_cases (council_district);
CREATE INDEX IF NOT EXISTS idx_planning_geom ON planning_cases USING GIST (geom);

-- Places (council districts, CPAs, neighborhoods, etc.)
CREATE TABLE IF NOT EXISTS places (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    place_type TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    boundary GEOMETRY(MultiPolygon, 4326),
    properties JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_places_type ON places (place_type);
CREATE INDEX IF NOT EXISTS idx_places_slug ON places (slug);
CREATE INDEX IF NOT EXISTS idx_places_boundary ON places USING GIST (boundary);

-- Pipeline runs (health tracking)
CREATE TABLE IF NOT EXISTS pipeline_runs (
    id SERIAL PRIMARY KEY,
    pipeline TEXT NOT NULL,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    records_processed INTEGER DEFAULT 0,
    records_inserted INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    status TEXT DEFAULT 'running',
    error_message TEXT
);

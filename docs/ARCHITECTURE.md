# Architecture — Checkpoint Cloud

## Stack

```
Frontend        → Static HTML/CSS/JS (Leaflet.js map)
Cron Worker     → Cloudflare Worker: checkpoint-ingest (scheduled)
API Worker      → Cloudflare Worker: checkpoint-api
Database        → Cloudflare D1: checkpoint-db
Artifacts       → Cloudflare R2: checkpoint-artifacts
Jurisdiction    → D1 table: zip_jurisdiction (zip → agency mapping)
Config/Limits   → Cloudflare KV
```

## Data Flow

```
Cron trigger (every 6h)
        ↓
checkpoint-ingest Worker
        ↓
Fetch approved source URLs
        ↓
Parse press release HTML → extract checkpoint fields
        ↓
Assign Notice_ID (agency-date-city-corridor slug)
        ↓
Dedup check: does Notice_ID exist in D1?
        ↓ (if new)
Insert into D1: checkpoints table
        ↓
Generate artifacts → upload to R2
        ↓
Log ingestion run: ingestion_log table
```

## D1 Schema (planned)

```sql
CREATE TABLE checkpoints (
  notice_id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  day TEXT,
  start_time TEXT,
  end_time TEXT,
  city TEXT,
  general_location TEXT,
  intersection TEXT,
  corridor TEXT,
  latitude REAL,
  longitude REAL,
  agency TEXT NOT NULL,
  status TEXT DEFAULT 'Scheduled',
  source_type TEXT NOT NULL,
  source_name TEXT,
  source_url TEXT,
  published_at TEXT,
  captured_at TEXT,
  confidence_score REAL NOT NULL,
  delay_risk TEXT,
  driver_flags_count INTEGER DEFAULT 0,
  actual_delay_minutes INTEGER,
  notes TEXT
);

CREATE TABLE zip_jurisdiction (
  zip TEXT PRIMARY KEY,
  agency TEXT NOT NULL,
  agency_type TEXT,        -- city_pd | county_sheriff | chp | lapd
  city TEXT,
  county TEXT
);

CREATE TABLE ingestion_log (
  id TEXT PRIMARY KEY,
  run_at TEXT NOT NULL,
  source_name TEXT,
  records_found INTEGER DEFAULT 0,
  records_inserted INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  parse_errors INTEGER DEFAULT 0,
  status TEXT            -- success | partial | failed
);
```

## R2 Artifact Structure

```
checkpoint-artifacts/
  checkpoints-latest.csv
  checkpoints-latest.json
  checkpoints-latest.geojson
  archive/
    checkpoints-YYYY-MM-DD.csv
    checkpoints-YYYY-MM-DD.json
```

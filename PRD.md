# PRD — Checkpoint Cloud

## Problem

DUI checkpoints in Southern California are publicly announced but scattered across dozens of agency press release pages, local news sites, and community trackers. Commuters in OC and LA have no single reliable source to check before driving at night.

## Goal

Build a cron-powered pipeline that aggregates public checkpoint notices into a single canonical database, enriches them with jurisdiction context and delay risk, and exposes an easy map for commute planning.

## Primary Users

- **Commuters** in OC/LA who want to plan routes around checkpoint delays
- **Coworkers sharing** — "heads up, checkpoint on PCH tonight"
- **Researchers/journalists** who want historical checkpoint data by agency and corridor

## MVP Features (Phase 1)

- Static map with mock checkpoint data matching `checkpoint_template_v2.csv` schema
- Zip code input — shows checkpoints near me
- Checkpoint list with: agency, location, time, delay risk badge, confidence score
- Expandable map (Leaflet.js or Mapbox GL)
- CSV export of current checkpoints

## Phase 2 — Live Pipeline

- Cloudflare Cron Worker checking OCSD, LAPD, CHP press release pages
- D1 canonical records with deduplication by `Notice_ID`
- R2 artifact generation: `checkpoints-latest.csv`, `checkpoints-latest.json`, `checkpoints-latest.geojson`
- Public API: `GET /checkpoints?zip=92651`
- Jurisdiction resolver: zip → agency mapping

## Legal / Ethical

- Only public sources. No paid data. No scraping of non-public pages.
- No storage of any data about individual drivers.
- Checkpoint locations are already public record — we are organizing, not exposing.
- Clear source attribution on every record.

## Success Metrics

- Checkpoints ingested per week
- Data freshness (time from press release to D1 record)
- Map load time
- Unique users per week during Friday/Saturday evenings

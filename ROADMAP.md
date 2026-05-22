# Roadmap — Checkpoint Cloud

## Phase 1 — Static Prototype

- [ ] Map prototype with mock data from `checkpoint_template_v2.csv`
- [ ] Zip code filter UI
- [ ] Checkpoint list with delay risk badges
- [ ] CSV export button
- [ ] Mobile-first layout (people check this on their phone)

## Phase 2 — Cron Pipeline

- [ ] Cloudflare Worker: `checkpoint-ingest` (cron trigger)
- [ ] OCSD press release parser
- [ ] LAPD press release parser
- [ ] CHP incident page parser
- [ ] D1 schema: `checkpoints`, `agencies`, `ingestion_log`
- [ ] Deduplication by `Notice_ID`
- [ ] Confidence score assignment by source type

## Phase 3 — Artifact Generation

- [ ] R2 bucket: `checkpoint-artifacts`
- [ ] Generate `checkpoints-latest.csv` on each cron run
- [ ] Generate `checkpoints-latest.json` on each cron run
- [ ] Generate `checkpoints-latest.geojson` on each cron run
- [ ] Public CDN URLs for each artifact

## Phase 4 — Public API

- [ ] `GET /checkpoints` — all active/scheduled
- [ ] `GET /checkpoints?zip=92651` — filtered by zip
- [ ] `GET /checkpoints?agency=OCSD` — filtered by agency
- [ ] `GET /checkpoints/latest.csv` — redirect to R2 artifact
- [ ] `GET /checkpoints/latest.geojson` — redirect to R2 artifact
- [ ] Rate limiting via KV

## Phase 5 — Jurisdiction Resolver

- [ ] Zip-to-agency mapping table in D1
- [ ] OC zip codes → OCSD vs city PD
- [ ] LA zip codes → LAPD vs county sheriff vs city PD
- [ ] CHP jurisdiction (unincorporated areas, freeways)
- [ ] `GET /jurisdiction?zip=92651` endpoint

## Phase 6 — Alerts

- [ ] Email/SMS alert opt-in for zip codes
- [ ] "New checkpoint near you" notification
- [ ] Weekly digest option

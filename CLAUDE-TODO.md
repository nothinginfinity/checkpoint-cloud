# CLAUDE-TODO — checkpoint-cloud

> Read `AGENTS.md` first, then `specs/checkpoint-cloud-jurisdiction-cron.spec.html` before starting.

## Your Job
Build the Cloudflare backend: cron Worker, D1 database, R2 artifact generation, jurisdiction resolver, and public API. Alice has done the repo scaffold. You do the runtime.

---

## Phase 1 — Static Map Prototype (start here)

- [ ] **`public/index.html`** — Interactive Leaflet.js map
  - Read spec anchor: `#map-spec`
  - Load `data/checkpoint_template_v2.csv` seed data
  - Show checkpoint pins with delay risk color coding (High=red, Medium=yellow, Low=green)
  - Sidebar list: agency, location, time window, confidence score badge
  - Zip code filter input
  - Mobile-first (people check this on their phone Friday night)
  - **Done when:** Opens in browser, shows 4 seed checkpoints on OC map, zip filter works

---

## Phase 2 — D1 Database

- [ ] **`db/schema.sql`** — D1 schema
  - Tables: `checkpoints`, `zip_jurisdiction`, `ingestion_log`
  - Full schema already in `docs/ARCHITECTURE.md` — copy and finalize
  - **Done when:** `wrangler d1 execute checkpoint-db --file=db/schema.sql` runs clean

- [ ] **`wrangler.toml`** — Cloudflare config
  - Worker name: `checkpoint-api`
  - D1 binding: `checkpoint-db`
  - R2 binding: `checkpoint-artifacts`
  - Cron trigger: `0 */6 * * *` (every 6 hours)
  - **Done when:** `wrangler deploy` succeeds

---

## Phase 3 — Cron Ingest Worker

- [ ] **`workers/checkpoint-ingest/index.ts`** — Scheduled Worker
  - Read spec anchor: `#cron-spec`
  - Fetch OCSD newsroom page, parse checkpoint announcements
  - Extract fields matching `schemas/checkpoint.json`
  - Assign `Notice_ID` slug: `{county}-{date}-{city_abbr}-{corridor_abbr}`
  - Dedup check: skip if `Notice_ID` already in D1
  - Insert new records, log run to `ingestion_log`
  - **Done when:** Cron runs without errors, new OCSD checkpoints appear in D1

---

## Phase 4 — Artifact Generation

- [ ] **`workers/checkpoint-ingest/artifacts.ts`** — R2 export
  - Read spec anchor: `#storage-spec`
  - Query D1 for all active/scheduled checkpoints
  - Generate `checkpoints-latest.csv`, `.json`, `.geojson`
  - Upload to R2 bucket `checkpoint-artifacts`
  - **Done when:** R2 bucket has 3 artifact files after cron run

---

## Phase 5 — Public API

- [ ] **`workers/checkpoint-api/index.ts`** — API Worker
  - Read spec anchor: `#api-spec`
  - `GET /checkpoints` — all active/scheduled
  - `GET /checkpoints?zip=92651` — filtered by zip
  - `GET /checkpoints?agency=OCSD` — filtered by agency
  - `GET /checkpoints/latest.csv` — redirect to R2
  - Rate limiting via KV
  - **Done when:** All endpoints return correct JSON, zip filter works

---

## Phase 6 — Jurisdiction Resolver

- [ ] **`db/seed-jurisdiction.sql`** — OC zip-to-agency seed data
  - Read `docs/JURISDICTION_RULES.md`
  - Seed `zip_jurisdiction` table with OC zips
  - **Done when:** `GET /jurisdiction?zip=92629` returns `{agency: "OCSD", city: "Dana Point"}`

---

## Hard Rules
- Public sources only — no scraping private data
- Every record needs `confidence_score`, `source_type`, `source_name`
- Cron must be idempotent — `Notice_ID` is the dedup key
- No PII stored ever

## Post Status
When each phase is done, post to: `https://messages.agentfeedoptimization.com`
Header: `X-Send-Token: afo-msg-2026`

# AGENTS.md — Checkpoint Cloud

## Source of Truth

The canonical product and UI source of truth is:

`specs/checkpoint-cloud-jurisdiction-cron.spec.html`

Agents MUST read this file before any architectural or implementation decisions.

## What This App Does

Checkpoint Cloud is a zip-aware DUI checkpoint data pipeline for Southern California. It:
1. Resolves jurisdiction (which agency covers a given zip code)
2. Checks public notices from LAPD, OCSD, CHP, and local PDs on a cron schedule
3. Stores canonical checkpoint records in D1 with deduplication
4. Generates CSV/JSON/GeoJSON artifacts to R2 on each run
5. Displays an expandable map for commute delay planning

## Implementation Order

1. Read `#app-spec` — pipeline overview and data flow
2. Read `#model-spec` — checkpoint record schema (also see `schemas/checkpoint.json`)
3. Read `#jurisdiction-spec` — zip-to-agency mapping rules
4. Read `#cron-spec` — scheduled ingestion logic
5. Read `#api-spec` — public and internal endpoints
6. Read `#map-spec` — map component and GeoJSON format
7. Read `#storage-spec` — D1 schema and R2 artifact structure
8. Build static map prototype first
9. Wire cron Worker and D1 backend

## Hard Constraints

- **Only use public sources.** No scraping of private data, no purchasing of checkpoint data.
- **Confidence scores required.** Every record must have a `confidence_score` (0.0–1.0). Official press releases = 0.95. Third-party trackers = 0.62 or lower.
- **Source attribution required.** `source_type`, `source_name`, and `source_url` must be populated for every record.
- **No PII.** Driver data, license plates, arrest records — none of this is stored or processed.
- **Status must be accurate.** Use `Scheduled`, `Tentative`, `Active`, `Completed`, `Cancelled` — never guess.
- **Cron idempotent.** Running the cron twice must not create duplicate records. Use `Notice_ID` as the dedup key.

## Agent Roles

| Agent | Responsibility |
|-------|---------------|
| **Alice** | GitHub repo, docs, static map prototype, schema files |
| **Claude** | Cloudflare Worker (cron + API), D1 schema, R2 artifact generation, jurisdiction resolver |
| **Jared** | Source list approval, zip code configuration, go/no-go on launch |

## Coordination

Post status updates to: `https://messages.agentfeedoptimization.com`
Send token header: `X-Send-Token: afo-msg-2026`

# Checkpoint Cloud

> Zip-aware checkpoint data, refreshed on schedule.

Checkpoint Cloud is a real-time DUI/sobriety checkpoint pipeline for Southern California. Set zip codes, resolve police/sheriff/CHP jurisdiction automatically, check public notices on a cron schedule, store canonical records in D1, generate CSV/JSON/GeoJSON artifacts into R2, and display an expandable map for commute delay planning.

## What It Does

- **Jurisdiction resolution** — given a zip code, determines whether LAPD, OCSD, CHP, or a local PD is responsible
- **Cron-powered ingestion** — scheduled Worker checks public notices and press releases on a defined interval
- **Canonical D1 records** — deduplicates checkpoints, stores confidence scores, source attribution, delay risk
- **Artifact generation** — exports CSV, JSON, and GeoJSON to R2 on each cron run
- **Commute delay map** — expandable interactive map showing active/scheduled checkpoints with delay risk overlays
- **Coworker sharing** — lightweight shareable view optimized for "should I take PCH tonight?"

## Data Model

See `schemas/checkpoint.json` and `data/checkpoint_template_v2.csv` for the canonical checkpoint record format.

Key fields: `Notice_ID`, `Agency`, `Status`, `Confidence_Score`, `Delay_Risk`, `Source_Type`

## Agents

Read `AGENTS.md` before implementing. The canonical spec is `specs/checkpoint-cloud-jurisdiction-cron.spec.html`.

## Repo Layout

```
checkpoint-cloud/
  README.md
  AGENTS.md
  PRD.md
  ROADMAP.md
  SECURITY.md
  SOURCES.md
  specs/
    checkpoint-cloud-jurisdiction-cron.spec.html
  schemas/
    checkpoint.json
    jurisdiction.json
  data/
    checkpoint_template_v2.csv
  docs/
    ARCHITECTURE.md
    JURISDICTION_RULES.md
  public/
    index.html        ← map + checkpoint list prototype
```

# Security — Checkpoint Cloud

## Core Principles

1. **Public sources only.** All checkpoint data comes from official agency press releases or established public trackers. No private data purchasing.
2. **No PII.** Zero storage of driver data, license plates, names, or arrest records.
3. **Source attribution on every record.** `source_type`, `source_name`, `source_url` required fields.
4. **Confidence scoring.** Every record has a `confidence_score` — users can filter by confidence level.
5. **Rate limiting.** Public API endpoints rate-limited via Cloudflare KV to prevent abuse.
6. **No auth required for reads.** Checkpoint data is public record — no login needed to view.
7. **Cron credentials in Worker secrets.** Any credentials for source monitoring stored in Cloudflare Worker secrets, never in code or GitHub.

## Data Retention

- Active/Scheduled checkpoints: retained indefinitely for historical analysis
- Completed/Cancelled checkpoints: retained for 1 year, then archived to R2
- No personal data is ever retained

## Threat Model

| Threat | Mitigation |
|--------|------------|
| False data injection | Confidence score system; official sources weighted highest |
| Source site changes breaking parser | Ingestion log tracks parse failures; alerts on consecutive failures |
| API abuse | Rate limiting via KV; read-only public endpoints |
| Privacy concerns | No PII stored; checkpoint locations are already public record |

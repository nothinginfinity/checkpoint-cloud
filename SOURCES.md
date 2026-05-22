# Data Sources — Checkpoint Cloud

All sources must be public. New sources require Jared approval before adding to cron.

## Approved Sources

### Orange County

| Agency | Source Type | URL Pattern | Confidence |
|--------|-------------|-------------|------------|
| OCSD (Orange County Sheriff) | Official press release | `ocsd.org/newsroom` | 0.95 |
| Anaheim PD | Official press release | `anaheim.net/police` | 0.95 |
| Santa Ana PD | Official press release | `santaana.org/police` | 0.95 |

### Los Angeles County

| Agency | Source Type | URL Pattern | Confidence |
|--------|-------------|-------------|------------|
| LAPD | Official press release | `lapdonline.org` | 0.95 |
| LASD | Official press release | `lasd.org` | 0.95 |
| CHP (Southern Division) | Public incident page | `chp.ca.gov` | 0.90 |

### Third-Party Trackers (lower confidence)

| Source | Confidence | Notes |
|--------|------------|-------|
| Waze community reports | 0.40 | Community-sourced, verify before using |
| Local Facebook groups | 0.30 | Not used in automated pipeline |

## Source Type Definitions

| `source_type` value | Meaning | Default Confidence |
|---------------------|---------|-------------------|
| `official_press_release` | Direct from agency website | 0.95 |
| `official_incident_page` | Agency public incident board | 0.90 |
| `third_party_tracker` | Community or aggregator site | 0.40–0.65 |
| `manual_entry` | Jared entered it manually | 0.80 |

## Adding New Sources

1. Verify the source is public and official
2. Add to this file with agency, URL pattern, and confidence score
3. Get Jared approval
4. Claude adds parser to `checkpoint-ingest` Worker

# Jurisdiction Rules — Checkpoint Cloud

## How Jurisdiction Is Determined

Checkpoint Cloud resolves which law enforcement agency has jurisdiction over a given zip code using a static mapping table stored in D1 (`zip_jurisdiction`).

## General Rules

1. **Incorporated cities** — city police department has primary jurisdiction
2. **Unincorporated areas** — county sheriff has primary jurisdiction
3. **State highways and freeways** — CHP has primary jurisdiction
4. **Contract cities** — some cities contract with county sheriff (e.g., Laguna Niguel, Dana Point use OCSD)

## Orange County Jurisdiction Notes

| City | Agency | Notes |
|------|--------|-------|
| Dana Point | OCSD | Contract city |
| Laguna Niguel | OCSD | Contract city |
| San Clemente | OCSD | Contract city |
| Anaheim | APD | Own department |
| Santa Ana | SAPD | Own department |
| Irvine | IPD | Own department |
| Unincorporated OC | OCSD | Default for unincorporated areas |

## CHP Jurisdiction

CHP covers:
- All California state highways (PCH = Highway 1 → CHP or OCSD depending on segment)
- All interstate freeways (I-5, I-405, SR-73, SR-241)
- Unincorporated areas without local PD contract

## Confidence Impact

If jurisdiction is unclear for a given zip (e.g., border of city/county), the checkpoint record's `confidence_score` is reduced by 0.10 and a note is added.

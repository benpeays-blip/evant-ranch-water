# Evant Ranch Water — implementation notes

## First-version scope

This app is a front-end planning workspace built with Next.js, React, TypeScript, and Tailwind CSS. It uses seeded local data and intentionally has no authentication, database, file storage, or external integrations yet.

## Source-based planning inputs in the seed data

- Approximately 500 acres near Evant, Texas
- Approximately 3,000 square feet of house roof catchment, to be field-verified
- Approximately 300 feet from the roof to the proposed tank area, to be surveyed
- 30.7 inches of annual planning rainfall, to be replaced with the selected local station and drought basis
- Roughly 43,000–52,000 gallons per year from 3,000 square feet after 75–90% collection efficiency
- 20,000-, 30,000-, and 50,000-gallon tank scenarios for comparison; no tank has been selected
- Scope 2 (serious household/ranch backup) as the planning target and Scope 3 as the long-term framework
- Existing well condition, depth, yield, recovery, water quality, and records are unknown
- Potable versus non-potable use is undecided

Calculator demand, hydraulic, efficiency, reserve, and treatment values are editable planning inputs—not verified ranch facts. Nothing in the seeded app should be used for construction or purchasing without field verification and licensed review.

## Required confirmation before design or construction

- Household, guest, livestock, irrigation, fire, and seasonal water demand
- Roof areas, materials, slopes, gutters, downpipes, and collection suitability
- Local rainfall station and drought-period rainfall basis
- Property survey, tank-pad geotechnical conditions, and all controlling elevations
- Existing well log, casing and pump condition, sustainable yield, drawdown, and recovery
- Certified source-specific laboratory results
- Distribution run lengths, pipe materials, simultaneous flows, and delivery pressures
- Utility service, backup-power strategy, controls, and monitoring requirements
- Whether the parcel is in Coryell County, Hamilton County, or both, plus the correct GCD and current TCEQ, TDLR, utility, plumbing, electrical, and other authority requirements
- Licensed engineering, plumbing, electrical, well, civil, and contractor responsibilities
- Tank vendor geometry, usable volume, wind/seismic anchorage, warranty, lead time, and foundation requirements
- Budget, schedule, procurement strategy, insurance, and owner acceptance criteria

## Reconciled source material

The interface and seed data have been reconciled against `docs/project-brief.md`, `docs/codex-master-prompt.md`, and the root Word handoff. Where those sources do not provide a verified answer, the app shows `TBD`, a scenario, or a clearly labeled calculator input.

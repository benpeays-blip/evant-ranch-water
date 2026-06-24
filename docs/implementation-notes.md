# Grandparents Ranch Rainwater System - implementation notes

## App scope

This app is a planning workspace built with Next.js, React, TypeScript, and Tailwind CSS. It uses seeded local project data and intentionally has no authentication, database, upload storage, or quote persistence yet.

The app now reflects the June 23, 2026 VChat handoff as the current working basis.

## Seeded planning inputs

- Location context: Hamilton / Lampasas region, Central Texas.
- House roof catchment: at least 5,000 square feet.
- Roof material: metal.
- Downspouts: about 8, spread around all sides.
- Existing well: Trinity Aquifer, about 50 yards west of the house.
- Current treatment: sediment filter, softener, kitchen sink RO.
- House: slab foundation, interior/central equipment closet.
- Tank site: north of house, about 100 yards away, about 10 feet lower.
- Overflow route: about 50 yards west to the pond, steady downhill.
- Power: available at house, not yet at tank site.
- Preferred tank: above-ground metal potable tank, 20,000 or 30,000 gallons.
- Preferred tie-in: labeled exterior manual source-selector valve box before house entry.
- Preferred delivery strategy: separate contractor scopes, not turnkey.

## App behavior

- Do not treat old unknowns as open if the handoff answered them.
- Do keep field-verification questions visible where the brief still marks them unknown.
- Keep calculators editable and clearly labeled as planning tools.
- Preserve the distinction between verified facts, preferred concept, and items that need contractor confirmation.
- Keep the well as backup and rainwater as the preferred primary source when available.
- Use the site visit planner as the source of field evidence before issuing quote requests.
- Use contractor recommendations as a call-list workspace for source-backed leads and live review research before formal bids are requested.
- Use the bid comparison system only for actual submitted/entered quotes. The bid page should start empty, accept quote-file metadata, collect price/contact/schedule/scope notes, and then compare those submitted bids.
- Bidder review research is row-based: once a company and trade are entered, the row can query the contractor research API for live ratings and review counts when a provider key is configured.
- The contractor research API uses source-backed starter leads by default. If `GOOGLE_PLACES_API_KEY` is set, it calls Google Places Text Search for current ratings, review counts, phone numbers, websites, and map links.
- Do not use raw review-site scraping as the dependable production path. Review pages change often, may block automated access, and may have terms that restrict scraping. Prefer official APIs or a review-data provider.
- Do not treat the bid score as an automatic hiring recommendation. Review ratings, counts, licensing, insurance, references, and written scope must still be verified before hire.

## Contractor research and recommended roles

- Austin / Central Texas is the best search area for rainwater specialty advice, potable treatment, and likely tank suppliers.
- Lampasas / Hamilton / Evant / Gatesville is the best search area for excavation, local dirt work, trenching, utility protection, and rural logistics.
- Use a local excavator after the tank supplier provides written pad requirements.
- Use licensed plumbers and electricians for the potable tie-in and pump power scopes. If the local directory is thin, widen the live search to Gatesville, Waco, Temple, Killeen, and Austin.
- Use a gutter or roofing/gutter contractor only for collection-edge changes: downspout screens, slope, reroutes, and cleanouts.
- Use a welding/fencing contractor after the tank, pump, valves, and access layout are known.

## Critical open items before construction

- Exact well line entry point into the house.
- Existing well line size and material.
- Current pressure switch cut-in/cut-out settings.
- Whether the existing softener has a built-in bypass.
- Whether all 8 downspouts can gravity-flow to one manifold.
- Best central first-flush / roof-washer location.
- Final tank size: 20,000 vs 30,000 gallons.
- Tank supplier pad requirements.
- Final pump size based on verified run, pipe size, friction, and pressure setting.
- Final UV size based on verified household flow.
- Whether pH/calcite neutralization is needed after testing.
- Local code, permit, and backflow requirements for this specific rural property.

## Planning disclaimer

The workspace is for project planning and contractor coordination. It is not sealed engineering, legal advice, plumbing design, electrical design, water-rights guidance, or a construction drawing set. Final work should be reviewed by the appropriate local professionals before purchase or construction.

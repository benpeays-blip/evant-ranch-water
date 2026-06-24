# Grandparents Ranch Rainwater System

A responsive planning workspace for a whole-house rainwater collection project in the Hamilton / Lampasas region of Central Texas.

The current working plan is to collect water from the house's 5,000+ square foot metal roof, route all practical downspouts to a central first-flush / roof-washer setup, store the water in a 20,000- to 30,000-gallon above-ground metal potable tank north of the house, pump it back to the house, and tie it into the existing Trinity Aquifer well through a labeled exterior manual source-selector valve box.

The well remains the backup source. The rainwater path is planned for potable whole-house use with added carbon filtration and NSF/ANSI 55 Class A UV, while the existing kitchen sink RO remains as the final drinking-water polish.

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Live contractor research

The bid system includes source-backed starter leads for Austin, Lampasas, and nearby Central Texas roles. To turn on live review and rating lookup, add a Google Places API key before starting the app:

```bash
GOOGLE_PLACES_API_KEY=your_key_here pnpm dev
```

Without that key, the app still shows the researched starter list and lets you add those leads into the bid scorecard. With the key, the contractor research panel can pull current Google Places ratings, review counts, phone numbers, websites, and map links for each trade package.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

All app data is currently local seed data and resets on refresh. No database, authentication, upload storage, or contractor quote persistence is included yet.

## Next-step tools

The app now includes two project-delivery tools:

- **Site visit planner**: downspout tracker, field kit, measurements, tank-site checklist, well/tie-in checklist, and quote-ready evidence list.
- **Contractor recommendations**: source-backed people to call, role-by-role subcontractor map, and live-capable review lookup for building a call list.
- **Bid comparison system**: upload or enter actual contractor quotes, record bidder details and quote files, research each bidder, and compare submitted bids with a weighted score that balances price closeness, scope completeness, review quality, relevant experience, schedule, warranty, communication, and risk controls.

## Current planning status

The June 23, 2026 handoff is loaded into the app as the current working basis. The most important remaining field questions are the existing well line entry point, well line size/material, current pressure switch settings, whether all eight downspouts can gravity-flow to one manifold, final 20k vs 30k tank selection, tank manufacturer pad requirements, pump sizing, UV sizing, and whether testing shows a need for pH or calcite correction.

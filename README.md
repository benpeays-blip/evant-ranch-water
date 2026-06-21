# Evant Ranch Water Collection

A responsive, seeded-data project management workspace for planning a ranch-scale rainwater, well, storage, treatment, and distribution system.

The first version includes 15 dashboard modules, interactive local calculators and checklists, mobile navigation, and source-aligned planning data. It is based on the project brief, detailed master prompt, and Word handoff included in this repository.

## Public website

[Visit the Evant Ranch Water Collection dashboard](https://evant-ranch-water.vercel.app)

The production website is hosted on Vercel and connected to this GitHub repository. Approved changes merged into the production branch can be redeployed through the linked Vercel project.

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

All data is currently local and resets on refresh. No database or authentication is included in this first version.

## Important planning status

The app deliberately labels unverified ranch facts as `TBD`. Current source-based estimates include an approximately 3,000-square-foot house roof, approximately 30.7 inches of annual rainfall, a roughly 300-foot roof-to-tank route, and 20,000-, 30,000-, and 50,000-gallon storage scenarios. Final demand, potable use, well condition, county/GCD jurisdiction, elevations, tank selection, treatment, and construction requirements still need human and licensed-professional confirmation.

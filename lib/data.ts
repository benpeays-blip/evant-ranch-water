export type Status = "Complete" | "In progress" | "Ready" | "Blocked" | "Not started";

export type Task = {
  id: string;
  title: string;
  area: string;
  owner: string;
  due: string;
  status: Status;
  priority: "Critical" | "High" | "Medium" | "Low";
};

export const projectFacts = {
  preparedDate: "June 23, 2026",
  location: "Hamilton / Lampasas region, Central Texas",
  mission: "Build a grid-powered, whole-house potable rainwater system that reduces use of the existing Trinity Aquifer well while keeping the well as backup.",
  roofArea: "5,000+ sq ft",
  downspouts: "8",
  tankSite: "100 yd north of house, about 10 ft lower",
  tankTarget: "20,000-30,000 gal",
  tieIn: "Exterior manual source-selector valve box before house entry",
};

export const tasks: Task[] = [
  { id: "RW-00", title: "Import VChat project brief, decisions, and open questions", area: "Intake", owner: "Owner", due: "Complete", status: "Complete", priority: "High" },
  { id: "RW-01", title: "Photograph and label all eight downspouts D1-D8", area: "Capture", owner: "Owner", due: "Site visit", status: "Ready", priority: "Critical" },
  { id: "RW-02", title: "Verify every downspout can drain to a serviceable collection manifold", area: "Capture", owner: "Owner", due: "Site visit", status: "Ready", priority: "Critical" },
  { id: "RW-03", title: "Choose central first-flush / roof-washer location", area: "Capture", owner: "Owner + installer", due: "Site visit", status: "Ready", priority: "High" },
  { id: "RW-04", title: "Locate existing well line entry and best exterior valve-box location", area: "Tie-in", owner: "Owner + plumber", due: "Site visit", status: "Ready", priority: "Critical" },
  { id: "RW-05", title: "Read current well pressure cut-in and cut-out settings", area: "Well", owner: "Owner", due: "Site visit", status: "Ready", priority: "High" },
  { id: "RW-06", title: "Confirm existing well line size and material", area: "Well", owner: "Plumber", due: "Before trenching", status: "Not started", priority: "Critical" },
  { id: "RW-07", title: "Flag 20k and 30k tank footprints and truck access", area: "Storage", owner: "Owner", due: "Site visit", status: "Ready", priority: "High" },
  { id: "RW-08", title: "Request tank quotes and manufacturer pad requirements", area: "Storage", owner: "Owner", due: "Week 1", status: "Ready", priority: "High" },
  { id: "RW-09", title: "Prepare separate bid scopes for excavator, tank installer, plumber, electrician, and treatment company", area: "Procurement", owner: "Owner", due: "Week 1", status: "In progress", priority: "High" },
  { id: "RW-10", title: "Collect water samples and size carbon / Class A UV treatment", area: "Treatment", owner: "Treatment company", due: "Week 2", status: "Not started", priority: "Critical" },
  { id: "RW-11", title: "Select final tank size: 20k practical target or 30k long-term target", area: "Decision", owner: "Owner", due: "After quotes", status: "Blocked", priority: "High" },
];

export const risks = [
  { risk: "Rainwater and well systems cross-connect without dependable backflow protection", likelihood: "Medium", impact: "Critical", score: 12, response: "Use a labeled exterior source-selector valve box with full-port shutoffs and check/backflow protection on both sources.", owner: "Plumber" },
  { risk: "Tank pad settles, holds water, or erodes under overflow", likelihood: "Medium", impact: "High", score: 10, response: "Use manufacturer pad requirements, compacted subgrade, geotextile, crushed rock, drainage away from the tank, and protected overflow.", owner: "Excavator" },
  { risk: "One or more downspouts cannot gravity-flow to the planned manifold", likelihood: "Medium", impact: "High", score: 9, response: "Verify grade with laser or string level before committing to the collection layout.", owner: "Installer" },
  { risk: "Treatment is sized before source water testing and household flow are known", likelihood: "Medium", impact: "Critical", score: 12, response: "Install sample taps, test water, and size carbon, polishing sediment, and NSF/ANSI 55 Class A UV from measured flow and lab results.", owner: "Treatment" },
  { risk: "Existing interior treatment closet is too tight for simple tie-in work", likelihood: "Medium", impact: "Medium", score: 8, response: "Prefer exterior tie-in before the well line enters the slab; use interior closet mainly for final treatment as practical.", owner: "Plumber" },
  { risk: "Power outage disables the rainwater pressure system", likelihood: "Medium", impact: "High", score: 9, response: "Use grid power as primary, but leave room for generator or solar backup as a later upgrade.", owner: "Electrician" },
];

export const intakeSections = [
  {
    title: "House, roof & gutters",
    eyebrow: "Known capture facts",
    fields: [
      ["Roof catchment", "5,000+ sq ft"],
      ["Roof material", "Metal"],
      ["Downspouts", "8 around all sides"],
      ["Debris load", "No trees within ~100 yd"],
    ],
  },
  {
    title: "Household use",
    eyebrow: "Water demand context",
    fields: [
      ["Bathrooms", "5.5"],
      ["Showers / tubs", "5"],
      ["Guest pattern", "2-5 often; ~15 twice/month"],
      ["Project scope", "House use only"],
    ],
  },
  {
    title: "Existing well & treatment",
    eyebrow: "Backup source",
    fields: [
      ["Aquifer", "Trinity Aquifer"],
      ["Well location", "~50 yd west of house"],
      ["Current treatment", "Sediment, softener, kitchen RO"],
      ["Unknowns", "Entry, size, material, pressure"],
    ],
  },
  {
    title: "Tank, power & overflow",
    eyebrow: "Preferred concept",
    fields: [
      ["Tank site", "100 yd north; 10 ft lower"],
      ["Storage target", "20k practical / 30k long-term"],
      ["Pump location", "At or near tank"],
      ["Overflow", "Route downhill to pond"],
    ],
  },
];

export const regulatoryItems = [
  { item: "Confirm county, AHJ, and any groundwater-district applicability for the exact rural parcel", authority: "County / GCD", status: "Ready", evidence: "Parcel record" },
  { item: "Verify local plumbing and backflow requirements for a well/rainwater source selector", authority: "AHJ / plumber", status: "Ready", evidence: "Valve-box detail" },
  { item: "Document that the well and rainwater sources cannot push backward into each other", authority: "AHJ / TCEQ", status: "Not started", evidence: "As-built diagram" },
  { item: "Confirm electrical permit, burial depth, conduit, disconnect, and separation from water lines", authority: "AHJ / utility", status: "Not started", evidence: "Electrical scope" },
  { item: "Review overflow discharge to pond for erosion, backflow, and pad protection", authority: "County / civil", status: "Ready", evidence: "Overflow route sketch" },
  { item: "Retain potable tank liner, UV, carbon, and plumbing product submittals", authority: "Installer / supplier", status: "Not started", evidence: "Product data" },
  { item: "Set startup and annual water-testing records for potable use", authority: "Certified lab", status: "Not started", evidence: "Lab reports" },
];

export const documents = [
  { title: "Rainwater project brief", category: "Project controls", state: "Uploaded", meta: "June 23, 2026 Markdown handoff" },
  { title: "Rainwater project data", category: "Project controls", state: "Uploaded", meta: "Structured JSON source" },
  { title: "Grandparents ranch Word brief", category: "Project controls", state: "Uploaded", meta: "DOCX source copy" },
  { title: "Weekend site photos", category: "Existing conditions", state: "Placeholder", meta: "Downspouts, tank site, well house, closet" },
  { title: "Well line entry sketch", category: "Tie-in", state: "Placeholder", meta: "Exterior valve-box location" },
  { title: "Tank supplier quotes", category: "Storage", state: "Placeholder", meta: "20k and 30k options" },
  { title: "Tank pad requirements", category: "Storage", state: "Placeholder", meta: "Manufacturer submittal" },
  { title: "Water quality laboratory report", category: "Treatment", state: "Placeholder", meta: "Certified startup and annual testing" },
  { title: "Contractor bid forms", category: "Procurement", state: "Placeholder", meta: "Separate scopes by trade" },
];

export const maintenance = [
  { task: "Inspect and clean downspout screens", cadence: "Monthly in wet season", next: "After startup", system: "Capture" },
  { task: "Drain and clean roof-washer / first-flush unit", cadence: "After each major storm", next: "After storm", system: "Capture" },
  { task: "Inspect tank vent, inlet screen, overflow screen, manway, and level gauge", cadence: "Quarterly", next: "After startup", system: "Storage" },
  { task: "Record tank level, pump cycles, and pressure settings", cadence: "Monthly", next: "After startup", system: "Pump" },
  { task: "Exercise rain / well / to-house valves in the selector box", cadence: "Semiannual", next: "After startup", system: "Tie-in" },
  { task: "Replace sediment and carbon filter cartridges", cadence: "By pressure drop / manufacturer", next: "After startup", system: "Treatment" },
  { task: "Confirm UV lamp, sleeve, alarm, and flow interlock status", cadence: "Per manufacturer", next: "After startup", system: "Treatment" },
  { task: "Test potable water after startup and at least annually", cadence: "Annual", next: "After startup", system: "Treatment" },
];

export const bidScopes = [
  { scope: "Excavation / dirt work", package: "Tank pad, 100-yard trench, pressure return, electrical coordination, overflow to pond, expose well line", readiness: 82, lead: "Excavator" },
  { scope: "Tank supplier / installer", package: "20k and 30k metal potable tank quotes, liner, roof, fittings, vent, overflow, level gauge, pad spec", readiness: 76, lead: "Tank supplier" },
  { scope: "Licensed plumber", package: "Pump plumbing, pressure tank, potable return, manual source-selector valve box, backflow/check valves, treatment tie-in", readiness: 68, lead: "Plumber" },
  { scope: "Licensed electrician", package: "Dedicated grid circuit, buried conduit, weatherproof disconnect, pump controls, future backup readiness", readiness: 58, lead: "Electrician" },
  { scope: "Water treatment / testing", package: "Whole-house carbon, final sediment polishing if needed, NSF/ANSI 55 Class A UV, sample taps, water testing", readiness: 62, lead: "Treatment company" },
];

export const designDecisions = [
  "Design for whole-house potable rainwater with the existing well kept as backup.",
  "Use a manual exterior source-selector valve box instead of complicated automation.",
  "Put the booster pump and pressure tank at or near the rainwater tank.",
  "Use grid power as the primary pump power; solar can remain a future backup upgrade.",
  "Tie in outside before the existing well line enters the slab/house plumbing.",
  "Use an above-ground metal potable tank, likely 20,000 or 30,000 gallons.",
  "Use a compacted gravel/crushed rock pad if the tank manufacturer allows it.",
  "Collect from all eight downspouts if grade and service access work.",
  "Route screened overflow downhill to the pond with erosion and backflow protection.",
  "Hire separate contractors by scope instead of a turnkey rainwater company.",
];

export const openQuestions = [
  "Where exactly does the existing well line enter the house?",
  "What size and material is the existing well line?",
  "What are the current well pressure cut-in and cut-out settings?",
  "Does the existing softener have a built-in bypass?",
  "Can all eight downspouts gravity-flow to one manifold?",
  "Where should the central first-flush / roof-washer unit go?",
  "Is 20,000 gallons the final practical target, or is 30,000 gallons worth the budget and visual impact?",
  "What tank pad does the selected manufacturer require?",
  "What pump size and UV size are required after final flow and pipe lengths are known?",
  "Does testing show any need for pH or calcite neutralization?",
];

export const siteVisitSections = [
  {
    title: "Downspouts and collection",
    focus: "Prove the roof can feed one clean collection system.",
    items: [
      "Photograph every downspout and label D1-D8.",
      "Photograph each side of the house so gutter layout is visible.",
      "Mark likely perimeter manifold route around the house.",
      "Check whether each downspout can slope toward the planned manifold.",
      "Pick a central first-flush / roof-washer location.",
      "Note any place where a cleanout box would be visible but acceptable.",
    ],
  },
  {
    title: "Tank site and overflow",
    focus: "Confirm the 20k / 30k tank decision can be built cleanly.",
    items: [
      "Measure house-to-tank distance and confirm steady downhill grade.",
      "Flag possible 20k and 30k tank footprints.",
      "Check truck, gravel, and equipment access to the pad area.",
      "Photograph the tank site from the house to judge visibility.",
      "Trace the overflow route from tank to pond.",
      "Identify where fencing or bollards should protect tank equipment.",
    ],
  },
  {
    title: "Well, tie-in, and treatment",
    focus: "Find the cleanest place for rainwater and well water to meet.",
    items: [
      "Photograph well house exterior and interior equipment.",
      "Photograph pressure tank, gauge, pressure switch, valves, and visible pipe labels.",
      "Read pressure while pump is off, on, and after recovery if possible.",
      "Trace likely buried well line route toward the house.",
      "Find the exterior house-entry point for the existing water line.",
      "Photograph existing sediment filter, softener, RO, and available treatment-closet space.",
    ],
  },
  {
    title: "Quote-ready evidence",
    focus: "Gather enough proof that contractors can price the same job.",
    items: [
      "Take wide route photos from house to tank and tank to pond.",
      "Record available electrical source and likely conduit route.",
      "Sketch source-selector box location with north/west/house directions.",
      "Write the must-have exclusions for each trade.",
      "List access limits, gates, slopes, wet-weather concerns, and livestock/equipment exposure.",
      "Create one folder per trade before sending quote requests.",
    ],
  },
];

export const siteMeasurements = [
  { label: "House to tank site", value: "100", unit: "yd", note: "Verify with measuring wheel or map app" },
  { label: "Tank site elevation drop", value: "10", unit: "ft", note: "Verify with level or contractor" },
  { label: "Tank site to pond", value: "50", unit: "yd", note: "Trace overflow route" },
  { label: "Visible downspouts", value: "8", unit: "count", note: "Label D1-D8" },
  { label: "Well to house", value: "50", unit: "yd", note: "Existing well is west" },
  { label: "Pressure cut-in", value: "", unit: "psi", note: "Read at well pressure switch" },
  { label: "Pressure cut-out", value: "", unit: "psi", note: "Read at well pressure switch" },
  { label: "Well line size", value: "", unit: "in", note: "Confirm before tie-in" },
];

export const fieldKit = [
  "Phone/camera",
  "Measuring wheel or long tape",
  "Notebook",
  "Marking flags",
  "Spray paint",
  "Shovel",
  "Flashlight/headlamp",
  "Gloves",
  "Compass or map app",
  "Existing house/site sketch",
];

export const contractorPackages = [
  {
    id: "excavation",
    trade: "Excavation / dirt work",
    lead: "Excavator",
    quoteGoal: "Price tank pad, trenching, overflow route, well-line exposure, and backfill as a dirt-work-only scope.",
    mustInclude: [
      "Compacted tank pad for 20k and 30k alternates",
      "Trench from house to tank for gravity and pressure lines",
      "Electrical conduit trench coordination",
      "Overflow trench or swale to pond",
      "Expose existing well line near house for plumber",
      "Backfill after inspection / approval",
    ],
    questions: [
      "Can you build to the tank manufacturer's gravel-pad spec?",
      "What equipment access do you need in wet weather?",
      "Will you include geotextile, crushed limestone/gravel, compaction, and drainage away from tank?",
      "How will you protect the pad and overflow outlet from erosion?",
    ],
    redFlags: [
      "No written compaction or pad detail",
      "Assumes overflow can dump beside tank",
      "No plan for utility separation or coordination",
      "Cannot expose well line carefully for plumber",
    ],
    script: "I am managing a ranch rainwater project and need a quote for dirt work only. We need a compacted gravel pad for a 20,000-30,000 gallon above-ground water tank, trenching about 100 yards from the house to the tank site for water lines and electrical conduit, an overflow route about 50 yards to a pond, and help exposing an existing well line near the house for a plumber. Can you quote that scope?",
  },
  {
    id: "tank",
    trade: "Tank supplier / installer",
    lead: "Tank supplier",
    quoteGoal: "Compare 20,000 and 30,000 gallon above-ground metal potable tank packages with the same fittings.",
    mustInclude: [
      "20k and 30k price alternates",
      "Potable liner or coating",
      "Roof, vent, manway, level gauge, fittings, and outlet",
      "Screened overflow and screened vent",
      "Pad requirements and tolerance",
      "Delivery, install, warranty, and lead time",
    ],
    questions: [
      "Is compacted crushed rock acceptable for this tank size?",
      "What exact pad diameter, depth, material, and level tolerance do you require?",
      "What fittings are included for inlet, outlet, overflow, drain, and manway?",
      "What is the liner/roof warranty and who services it locally?",
    ],
    redFlags: [
      "No written pad spec",
      "No potable liner documentation",
      "Overflow smaller than inlet or not screened",
      "Quote omits delivery, install, or key fittings",
    ],
    script: "I need a quote for a 20,000-gallon and 30,000-gallon above-ground corrugated metal potable water tank. I need the tank package only, not a turnkey rainwater system. Please include tank, potable liner, roof, vent, overflow, outlet fittings, manway, level gauge, delivery, install, warranty, lead time, and exact pad requirements.",
  },
  {
    id: "plumbing",
    trade: "Licensed plumber",
    lead: "Plumber",
    quoteGoal: "Price potable pressure return, pump plumbing, exterior source-selector box, check/backflow protection, and treatment tie-in.",
    mustInclude: [
      "Pump and pressure tank plumbing at tank",
      "1.5-inch minimum / 2-inch preferred pressure return line coordination",
      "Large exterior valve box with RAIN, WELL, TO HOUSE labels",
      "Full-port ball valves and unions",
      "Check/backflow protection on each source",
      "Sample taps and treatment plumbing support",
    ],
    questions: [
      "Where would you place the source-selector valve box?",
      "What backflow/check-valve arrangement do you recommend for this rural well/rainwater tie-in?",
      "Can you coordinate pump pressure setting with the existing well pressure switch?",
      "What parts of this require inspection or licensed sign-off?",
    ],
    redFlags: [
      "Proposes tying sources together without clear backflow protection",
      "Wants to route new line through slab/interior closet without a strong reason",
      "No unions, labels, gauges, or service access",
      "Cannot explain startup flushing and sample taps",
    ],
    script: "I am managing a rainwater-to-house project and need a licensed plumber for potable piping and tie-in. The rainwater tank will be north of the house with a pump and pressure tank at the tank. The existing well and pressure tank are west of the house. I want an exterior manual source-selector valve box before the house entry, with rainwater and well water each having a full-port shutoff and check/backflow protection before joining the house supply. Can you quote the pump plumbing, pressure line tie-in, valve box, and treatment plumbing?",
  },
  {
    id: "electrical",
    trade: "Licensed electrician",
    lead: "Electrician",
    quoteGoal: "Price dedicated grid power to tank/pump area with disconnect, controls, and future backup readiness.",
    mustInclude: [
      "Dedicated pump circuit from house",
      "Underground conduit and trench coordination",
      "Weatherproof disconnect at pump area",
      "Pump controls and low-water cutoff support",
      "Code-compliant separation from water lines",
      "Future generator/solar readiness note",
    ],
    questions: [
      "What circuit size do you expect after pump selection?",
      "What burial depth and conduit do you recommend?",
      "Can the trench be shared if separation rules are met?",
      "How would you leave the system ready for generator or solar backup later?",
    ],
    redFlags: [
      "No disconnect near pump",
      "No separation plan for shared trench",
      "No coordination with pump supplier",
      "No future backup path if that matters later",
    ],
    script: "I need a dedicated underground electrical run from the house to a rainwater tank/pump area about 100 yards north of the house. The pump will be grid-powered, with a weatherproof disconnect and code-compliant conduit. The trench may be shared with water-line work if proper separation is maintained. Can you quote the electrical scope?",
  },
  {
    id: "treatment",
    trade: "Water treatment / testing",
    lead: "Treatment company",
    quoteGoal: "Price whole-house carbon, final sediment polishing if needed, Class A UV, sample taps, testing, and pH/calcite review.",
    mustInclude: [
      "Whole-house carbon filter",
      "NSF/ANSI 55 Class A UV unit sized for verified flow",
      "Final sediment polishing if needed",
      "Sample taps before and after treatment",
      "Water testing plan",
      "pH/calcite recommendation only if testing shows need",
    ],
    questions: [
      "What flow rate are you sizing the UV for?",
      "Is the UV unit NSF/ANSI 55 Class A?",
      "Where should sample taps go?",
      "What annual maintenance and lamp/sleeve replacement should we plan for?",
    ],
    redFlags: [
      "UV is not Class A for potable whole-house use",
      "No sample taps",
      "Treatment recommended without water testing",
      "No maintenance cost or lamp replacement schedule",
    ],
    script: "We are adding rainwater as a house water source while keeping a well as backup. The house already has sediment filtration, softener, and kitchen sink RO. I need a treatment setup for whole-house potable rainwater/well water, likely carbon filtration plus NSF/ANSI 55 Class A UV, with sample taps and possible pH testing. Can you size and install this?",
  },
];

export const bidWeights = [
  { key: "priceCloseness", label: "Price closeness", weight: 18, help: "How close the quote is to the cluster/median, not automatically cheapest." },
  { key: "scopeFit", label: "Scope completeness", weight: 20, help: "How completely the quote covers must-have work and avoids exclusions." },
  { key: "reviewQuality", label: "Review quality", weight: 18, help: "Star rating, review count, recency, and specificity of reviews." },
  { key: "ruralExperience", label: "Relevant experience", weight: 14, help: "Rural water, wells, tanks, trenching, potable systems, or local ranch work." },
  { key: "scheduleFit", label: "Schedule fit", weight: 10, help: "Can do the work soon without rushing critical details." },
  { key: "warranty", label: "Warranty / support", weight: 8, help: "Clear warranty, service response, and post-install support." },
  { key: "communication", label: "Communication", weight: 7, help: "Responsiveness, clarity, written detail, and professional follow-through." },
  { key: "riskControl", label: "Risk control", weight: 5, help: "Permits, insurance, licensing, backflow, utility separation, and safety details." },
];

export type BidRow = {
  id: number;
  trade: string;
  company: string;
  price: number;
  rating: number;
  reviewCount: number;
  scopeFit: number;
  ruralExperience: number;
  scheduleWeeks: number;
  warranty: number;
  communication: number;
  riskControl: number;
  notes: string;
  contactName?: string;
  contactPhone?: string;
  quoteFileName?: string;
  quoteFileSize?: number;
  quoteFileType?: string;
  quoteStatus?: "Draft" | "Uploaded" | "Compared" | "Needs follow-up" | "Sample";
  quoteDate?: string;
  reviewSourceUrl?: string;
};

export const initialBidRows: BidRow[] = [];

export const reviewResearchChecks = [
  "Review count is high enough to trust the rating.",
  "Recent reviews mention similar work, not just small repair calls.",
  "Bad reviews are about isolated problems, not repeated communication or quality failures.",
  "Company responds professionally to critical reviews.",
  "Photos or review text show rural, trenching, well, tank, or potable-water work.",
  "Licensing, insurance, and warranty claims can be verified outside review sites.",
];

export type ContractorLead = {
  trade: string;
  company: string;
  area: string;
  phone?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  website?: string;
  mapsUrl?: string;
  address?: string;
  fit: string;
  nextAction: string;
  priority: string;
  rating?: number;
  reviewCount?: number;
  liveSource?: string;
};

export const subcontractorRolePlan = [
  {
    role: "Rainwater specialty advisor",
    timing: "First call before bid packages go out",
    searchArea: "Austin / Central Texas",
    bestFit: "A rainwater harvesting designer who can review capture, tank sizing, potable treatment, and whether a local-trade build is realistic.",
    askFor: "Design-only consult, rough equipment list, treatment assumptions, and any installer referrals near Lampasas or Hamilton.",
    why: "This keeps the owner-managed subcontractor path from missing specialty details like roof washing, screened overflow, potable tank requirements, and treatment sizing.",
  },
  {
    role: "Tank supplier / installer",
    timing: "Before excavator final price",
    searchArea: "Austin, Dripping Springs, Hill Country suppliers",
    bestFit: "A supplier that can price 20k and 30k potable tank alternates and provide written pad requirements.",
    askFor: "Tank, liner/coating, roof, fittings, manway, screened vent, screened overflow, delivery to Evant, install, warranty, and pad tolerance.",
    why: "The tank manufacturer's pad requirement drives the excavation scope and avoids rebuilding the base later.",
  },
  {
    role: "Excavation / dirt work",
    timing: "After tank pad spec and before plumbing/electrical trench pricing",
    searchArea: "Lampasas, Hamilton, Evant, Gatesville",
    bestFit: "Local rural dirt contractor comfortable with tank pads, trenching, backfill, access limits, and erosion control.",
    askFor: "20k and 30k pad alternates, 100-yard house-to-tank trench, overflow route to pond, conduit coordination, and careful well-line exposure.",
    why: "Local contractors usually understand soil, access, rock, weather, and equipment logistics better than Austin-only crews.",
  },
  {
    role: "Licensed plumber",
    timing: "Before trench is closed",
    searchArea: "Hamilton, Lampasas, Gatesville, Austin if local options are thin",
    bestFit: "Licensed plumber with rural well, pressure tank, backflow/check valve, and exterior valve-box experience.",
    askFor: "Pump plumbing, pressure return, labeled rain/well/to-house source selector, unions, gauges, backflow/check protection, and treatment tie-in.",
    why: "The plumber owns the potable tie-in risk. This is the trade that prevents accidental cross-connection between well and rainwater.",
  },
  {
    role: "Licensed electrician",
    timing: "Once pump size is roughly selected and trench route is flagged",
    searchArea: "Hamilton, Lampasas, Gatesville, Austin if schedule requires",
    bestFit: "Electrician comfortable with underground conduit, rural disconnects, pump controls, and utility separation.",
    askFor: "Dedicated pump circuit, buried conduit, weatherproof disconnect, code separation from water lines, and future generator/solar readiness.",
    why: "The pump is grid-powered now, so the electrical run must be clean, inspectable, and easy to service.",
  },
  {
    role: "Water treatment / testing",
    timing: "After water samples and before final startup",
    searchArea: "Austin plus Central Texas service coverage",
    bestFit: "Water treatment company that will test first, then size whole-house carbon and NSF/ANSI 55 Class A UV.",
    askFor: "Certified sample plan, carbon sizing, final sediment polishing if needed, Class A UV, alarm/shutoff options, sample taps, and annual service cost.",
    why: "Potable rainwater should be sized from actual flow and water quality, not a generic filter package.",
  },
  {
    role: "Gutters / collection edge",
    timing: "Before final piping layout",
    searchArea: "Lampasas, Marble Falls, Burnet, Austin",
    bestFit: "Gutter crew that can modify downspouts, add screens, improve slope, and coordinate with first-flush locations.",
    askFor: "Downspout screen upgrades, downspout reroutes, cleanout access, and any gutter repairs needed for reliable collection.",
    why: "The roof is the water source. Small collection-edge problems can make the downstream system harder to maintain.",
  },
  {
    role: "Welding / fencing / utility protection",
    timing: "After tank and equipment layout are fixed",
    searchArea: "Lampasas / Hamilton local",
    bestFit: "Local welding or fence contractor for livestock, vehicle, and equipment protection around the tank area.",
    askFor: "Simple fenced utility enclosure, gates, bollards, or metal protection for exposed equipment.",
    why: "Protecting the tank, pump, valves, and treatment hardware can prevent expensive damage after installation.",
  },
];

export const contractorLeadSeeds: ContractorLead[] = [
  {
    trade: "Rainwater design / specialty integrator",
    company: "Innovative Water Solutions / Watercache",
    area: "Austin",
    phone: "512-490-0932",
    sourceUrl: "https://www.watercache.com/",
    sourceLabel: "Company website",
    fit: "Strong specialty lead for design, rainwater harvesting, drainage, gutter integration, well tank/pump systems, fire storage, maintenance, and inspection.",
    nextAction: "Ask whether they will design-only, consult, or coordinate with separate local trades instead of doing a turnkey install.",
    priority: "Primary Austin specialty call",
  },
  {
    trade: "Tank supplier / installer",
    company: "Aqualine Water Tanks",
    area: "Round Mountain / Central Texas Hill Country",
    phone: "877-223-7784",
    sourceUrl: "https://aqualinewatertanks.com/",
    sourceLabel: "Company website",
    fit: "Strong local 20k-capable lead. Aqualine says its residential steel tanks run from 1,500 gallons up to 65,000 gallons, are manufactured in Round Mountain, service all of Texas, and use a BPA-free NSF-certified potable liner.",
    nextAction: "Ask for a 20,000-gallon and 30,000-gallon potable rainwater tank quote, roof style, liner warranty, delivery/install to Evant, and exact pad requirements.",
    priority: "Primary 20k steel tank call",
  },
  {
    trade: "Tank supplier / installer",
    company: "Pioneer Water Tanks America",
    area: "U.S. dealer network / Texas dealer route",
    sourceUrl: "https://pioneerwatertanksamerica.com/water-tank-sizes/",
    sourceLabel: "Water tank sizes page",
    fit: "Strong large-tank manufacturer/dealer path. Pioneer lists standard and custom tank sizes, special-order sizes up to 700,000 gallons, drinking-water approval, AQUALINER Fresh liner, and a 20-year conditional tank/liner warranty.",
    nextAction: "Use the dealer finder/contact form and ask for the closest Texas dealer for a 20k potable residential rainwater tank delivered to Evant.",
    priority: "Manufacturer/dealer 20k path",
  },
  {
    trade: "Tank supplier / installer",
    company: "Cqure Water",
    area: "Central Texas / Hill Country",
    sourceUrl: "https://www.cqurewater.com/",
    sourceLabel: "Company website",
    fit: "Texas rainwater harvesting installer focused on potable water storage tanks. Useful if you want a tank supplier who can also think through system fit, installation, and water security for a rural home or ranch.",
    nextAction: "Ask whether they will quote tank-only versus tank-plus-install, and whether they can source/install a 20,000-gallon Pioneer or equivalent potable tank near Evant.",
    priority: "Turnkey tank/source call",
  },
  {
    trade: "Tank supplier / installer",
    company: "Tank Depot",
    area: "Online distributor / ships to project",
    sourceUrl: "https://www.tank-depot.com/catalogsearch/result/?q=20000+gallon+water+tank",
    sourceLabel: "20,000-gallon product search",
    fit: "Good pricing and availability benchmark. Tank Depot search results show multiple 20,000-gallon options, including Snyder and Norwesco vertical HDPE storage tanks, underground liquid storage, and a 20,000-gallon potable-water bladder tank.",
    nextAction: "Ask for freight to Evant, potable suitability, fitting package, unloading requirements, warranty, lead time, and whether a 20k poly tank is practical versus a lined steel tank.",
    priority: "20k price-check / backup supplier",
  },
  {
    trade: "Tank supplier / installer",
    company: "American Tank Company / WaterTanks.com",
    area: "U.S. supplier / factory-direct quote",
    phone: "877-655-1100",
    sourceUrl: "https://www.watertanks.com/category/162/",
    sourceLabel: "Corrugated steel tank category",
    fit: "Factory-direct corrugated steel tank lead. The company says its galvanized corrugated tanks are used for drinking water, fire protection, irrigation, municipalities, and wastewater, with NSF/ANSI 61 potable interior coating available.",
    nextAction: "Ask for a 20,000-gallon potable corrugated steel quote, NSF/ANSI 61 coating, roof/vent/manway/fitting package, delivery to Texas, and concrete pad/anchoring requirements.",
    priority: "20k custom steel quote",
  },
  {
    trade: "Tank supplier / installer",
    company: "Texas Metal Tanks",
    area: "Dripping Springs / Austin region",
    phone: "512-565-0875",
    sourceUrl: "https://www.texasmetaltanks.com/",
    sourceLabel: "Company website",
    fit: "Good Austin-area metal rainwater tank reference, but their published range appears smaller than this project's 20k target unless they can custom-source or refer out.",
    nextAction: "Ask directly whether they can support a 20,000-gallon potable tank; if not, ask who they recommend for large Hill Country rainwater tanks.",
    priority: "Austin referral / smaller-tank reference",
  },
  {
    trade: "Excavation / dirt work",
    company: "BL3 Construction Services, LLC",
    area: "Lampasas",
    phone: "361-443-0440",
    sourceUrl: "https://business.lampasaschamber.org/list/ql/construction-contractors-7",
    sourceLabel: "Lampasas Chamber construction directory",
    fit: "Listed with land improvements, mulching, grade work, land cleanup, auger work, trenching, road improvements, and site cleanup.",
    nextAction: "Ask for tank pad, trenching, overflow to pond, well-line exposure, and compacted crushed-rock pad experience.",
    priority: "Primary local dirt-work call",
  },
  {
    trade: "Excavation / land management",
    company: "4K Land Management LLC",
    area: "Lampasas",
    phone: "737-899-5896",
    sourceUrl: "https://business.lampasaschamber.org/list/ql/equipment-rentals-28",
    sourceLabel: "Lampasas Chamber equipment/rentals directory",
    fit: "Local land-management lead worth checking for grading, clearing, pad prep, and rural access work.",
    nextAction: "Ask specifically about water-line trenching, tank pads, compaction, and overflow erosion control.",
    priority: "Local dirt-work backup",
  },
  {
    trade: "Excavation / general construction",
    company: "Mike Scott Construction",
    area: "Lampasas",
    phone: "512-540-2296",
    sourceUrl: "https://business.lampasaschamber.org/list/ql/construction-contractors-7",
    sourceLabel: "Lampasas Chamber construction directory",
    fit: "Local construction lead; scope fit depends on whether they do pad/trench work directly.",
    nextAction: "Ask if they self-perform dirt work or can recommend a local excavator.",
    priority: "Local construction call",
  },
  {
    trade: "Excavation / general construction",
    company: "RKJ Construction, Inc.",
    area: "Lampasas",
    phone: "512-556-3684",
    sourceUrl: "https://business.lampasaschamber.org/list/ql/construction-contractors-7",
    sourceLabel: "Lampasas Chamber construction directory",
    fit: "Local construction lead; verify whether they are a fit for trenching/tank pad rather than vertical construction only.",
    nextAction: "Ask for dirt-work scope comfort, equipment availability, and local subcontractor recommendations.",
    priority: "Local construction call",
  },
  {
    trade: "Welding / fencing / utility protection",
    company: "Smith Welding and Construction LLC",
    area: "Lampasas",
    phone: "512-525-3956",
    sourceUrl: "https://business.lampasaschamber.org/list/ql/construction-contractors-7",
    sourceLabel: "Lampasas Chamber construction directory",
    fit: "Useful for fenced utility enclosure, bollards, gates, equipment protection, or metal utility covers around the tank area.",
    nextAction: "Ask for simple fenced enclosure and vehicle/livestock protection pricing after tank location is flagged.",
    priority: "Support trade",
  },
  {
    trade: "Gutters / collection edge",
    company: "Lighthouse Roofing & Gutters",
    area: "Marble Falls",
    phone: "830-613-9829",
    sourceUrl: "https://business.lampasaschamber.org/list/ql/construction-contractors-7",
    sourceLabel: "Lampasas Chamber construction directory",
    fit: "Possible lead for gutter screens, downspout modifications, or collection-edge repairs before piping starts.",
    nextAction: "Ask whether they work near Evant and can coordinate downspout screen/filter changes for rainwater collection.",
    priority: "Gutter/screen lead",
  },
  {
    trade: "Equipment / rental support",
    company: "LJD Sales and Rentals, LLC",
    area: "Lampasas",
    phone: "512-564-0363",
    sourceUrl: "https://business.lampasaschamber.org/list/ql/equipment-rentals-28",
    sourceLabel: "Lampasas Chamber equipment/rentals directory",
    fit: "Possible local support for equipment rentals, logistics, and contractor referrals.",
    nextAction: "Ask which local dirt contractors regularly rent trenching or pad-prep equipment.",
    priority: "Referral / logistics lead",
  },
];

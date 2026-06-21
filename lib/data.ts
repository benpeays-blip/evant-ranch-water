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

export const tasks: Task[] = [
  { id: "RW-00", title: "Assemble project brief and master handoff", area: "Intake", owner: "Owner", due: "Complete", status: "Complete", priority: "High" },
  { id: "RW-01", title: "Confirm county, parcel, and applicable groundwater district", area: "Regulatory", owner: "Owner", due: "Week 1", status: "Ready", priority: "Critical" },
  { id: "RW-02", title: "Measure actual roof catchment and inspect gutters", area: "Capture", owner: "Owner", due: "Week 2", status: "Ready", priority: "Critical" },
  { id: "RW-03", title: "Complete household, ranch, and reserve demand inventory", area: "Intake", owner: "Owner", due: "Week 2", status: "Ready", priority: "Critical" },
  { id: "RW-04", title: "Request well log, pump records, and registration data", area: "Well", owner: "Owner", due: "Week 1", status: "Ready", priority: "High" },
  { id: "RW-05", title: "Measure tank-site and pipe-route elevations", area: "Storage", owner: "Surveyor", due: "Week 2", status: "Not started", priority: "High" },
  { id: "RW-06", title: "Map the approximately 300-foot roof-to-tank route", area: "Distribution", owner: "Owner", due: "Week 2", status: "Not started", priority: "High" },
  { id: "RW-07", title: "Decide potable, non-potable, or separated end uses", area: "Treatment", owner: "Owner", due: "Week 3", status: "Blocked", priority: "Critical" },
  { id: "RW-08", title: "Model 20k, 30k, and 50k storage scenarios", area: "Storage", owner: "Designer", due: "Week 3", status: "Not started", priority: "High" },
  { id: "RW-09", title: "Prepare three scope alternatives and comparable bid scopes", area: "Procurement", owner: "Designer", due: "Week 4", status: "Not started", priority: "High" },
];

export const risks = [
  { risk: "Existing well yield is below peak ranch demand", likelihood: "Medium", impact: "Critical", score: 12, response: "Run stepped drawdown test; retain rainwater-first storage option.", owner: "Engineer" },
  { risk: "Tank site has insufficient bearing capacity", likelihood: "Low", impact: "High", score: 6, response: "Geotechnical review before pad design and tank award.", owner: "Civil" },
  { risk: "First-flush volume is undersized for roof debris", likelihood: "Medium", impact: "Medium", score: 8, response: "Field-observe roof loading and use adjustable diversion.", owner: "Installer" },
  { risk: "Freeze damage at exposed valves", likelihood: "Medium", impact: "High", score: 9, response: "Bury runs, insulate valve boxes, and add drain-down points.", owner: "Plumber" },
  { risk: "Power outage interrupts pressure system", likelihood: "High", impact: "High", score: 12, response: "Provide generator inlet and verify usable gravity reserve.", owner: "Electrical" },
];

export const intakeSections = [
  {
    title: "People & use",
    eyebrow: "Demand basis",
    fields: [
      ["Full-time residents", "TBD"],
      ["Peak guest count", "TBD"],
      ["Livestock demand", "TBD"],
      ["Irrigation / fire demand", "TBD"],
    ],
  },
  {
    title: "Existing systems",
    eyebrow: "Baseline assets",
    fields: [
      ["Existing source", "Private well — details TBD"],
      ["Well records", "Not yet obtained"],
      ["Well depth / yield", "TBD"],
      ["Current treatment", "TBD"],
    ],
  },
  {
    title: "Collection surfaces",
    eyebrow: "Capture potential",
    fields: [
      ["House roof estimate", "~3,000 sq ft — verify"],
      ["Other roof areas", "TBD"],
      ["Roof-to-tank route", "~300 ft — verify"],
      ["Roof material", "TBD"],
    ],
  },
  {
    title: "Operating priorities",
    eyebrow: "Decision criteria",
    fields: [
      ["Planning target", "Scope 2 — serious backup"],
      ["Final end uses", "TBD"],
      ["Potable decision", "TBD"],
      ["Long-term framework", "Scope 3 — ranch master plan"],
    ],
  },
];

export const regulatoryItems = [
  { item: "Confirm whether the parcel is in Coryell, Hamilton, or both", authority: "County TBD", status: "Ready", evidence: "Parcel record required" },
  { item: "Identify the correct groundwater conservation district", authority: "GCD TBD", status: "Blocked", evidence: "Depends on parcel" },
  { item: "Determine TCEQ public-water-system applicability", authority: "TCEQ", status: "Ready", evidence: "Use + connection count" },
  { item: "Verify groundwater well records and registration history", authority: "TWDB / TDLR", status: "Ready", evidence: "Well record request" },
  { item: "Document cross-connection and backflow controls", authority: "AHJ / TCEQ", status: "Not started", evidence: "Licensed design detail" },
  { item: "Confirm electrical permit and disconnect requirements", authority: "AHJ / utility", status: "Not started", evidence: "One-line diagram" },
  { item: "Review overflow discharge, erosion, and surface-water rules", authority: "County / TCEQ", status: "Ready", evidence: "Civil site plan" },
];

export const documents = [
  { title: "Project brief", category: "Project controls", state: "Uploaded", meta: "Markdown source" },
  { title: "Codex master prompt", category: "Project controls", state: "Uploaded", meta: "Detailed planning specification" },
  { title: "Master handoff for Luke", category: "Project controls", state: "Uploaded", meta: "Word document · 55 pages" },
  { title: "Existing well log", category: "Existing conditions", state: "Placeholder", meta: "PDF / state record" },
  { title: "Ranch aerial and parcel map", category: "Survey", state: "Placeholder", meta: "GIS / PDF" },
  { title: "Roof measurements", category: "Capture", state: "Placeholder", meta: "Field sheet / drawing" },
  { title: "Water quality laboratory report", category: "Treatment", state: "Placeholder", meta: "Certified lab PDF" },
  { title: "Tank manufacturer submittal", category: "Storage", state: "Placeholder", meta: "Product data" },
  { title: "Issued-for-bid drawings", category: "Procurement", state: "Placeholder", meta: "Drawing set" },
];

export const maintenance = [
  { task: "Inspect and clean leaf screens", cadence: "Monthly in wet season", next: "After startup", system: "Capture" },
  { task: "Drain first-flush diverters", cadence: "After each major storm", next: "After storm", system: "Capture" },
  { task: "Record tank level and pump cycles", cadence: "Monthly", next: "After startup", system: "Storage" },
  { task: "Replace sediment cartridges", cadence: "By pressure drop / manufacturer", next: "After startup", system: "Treatment" },
  { task: "Test disinfection controls and alarms", cadence: "Per final treatment design", next: "After startup", system: "Treatment" },
  { task: "Exercise isolation valves", cadence: "Semiannual", next: "After startup", system: "Distribution" },
  { task: "Inspect tank roof, vents, and overflow screen", cadence: "Annual", next: "After startup", system: "Storage" },
];

export const bidScopes = [
  { scope: "Site & civil", package: "Tank pads, trenching, drainage, overflow energy dissipation", readiness: 65, lead: "Civil contractor" },
  { scope: "Rainwater capture", package: "Gutters, downpipes, screens, first flush, conveyance", readiness: 80, lead: "Specialty installer" },
  { scope: "Plumbing & treatment", package: "Pumps, manifolds, treatment train, backflow, commissioning", readiness: 55, lead: "Licensed plumber" },
  { scope: "Electrical & controls", package: "Power, disconnects, generator inlet, level controls, alarms", readiness: 45, lead: "Electrician" },
];

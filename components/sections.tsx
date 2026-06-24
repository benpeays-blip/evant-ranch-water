"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CloudRain,
  Database as TankIcon,
  Download,
  Droplet,
  Droplets,
  DollarSign,
  FileCheck2,
  FileClock,
  FilePlus2,
  FileSpreadsheet,
  FileText,
  Filter,
  Gauge,
  HardHat,
  Info,
  ListChecks,
  MapPin,
  Network,
  PackageCheck,
  PanelTop,
  PencilLine,
  PhoneCall,
  Plus,
  Power,
  Printer,
  RotateCcw,
  Ruler,
  Scale,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SprayCan,
  Star,
  Sun,
  TestTube2,
  TrendingUp,
  TriangleAlert,
  Trophy,
  Upload,
  UserCheck,
  Waves,
  Wrench,
  Zap,
} from "lucide-react";
import type { PageKey } from "./ranch-water-app";
import {
  bidScopes,
  bidWeights,
  contractorLeadSeeds,
  contractorPackages,
  designDecisions,
  documents,
  fieldKit,
  initialBidRows,
  intakeSections,
  maintenance,
  openQuestions,
  projectFacts,
  regulatoryItems,
  reviewResearchChecks,
  risks,
  siteMeasurements,
  siteVisitSections,
  subcontractorRolePlan,
  tasks as seedTasks,
  type BidRow,
  type ContractorLead,
  type Status,
  type Task,
} from "@/lib/data";
import { Badge, Button, Card, Field, Meter, MiniLabel, PageAction, SectionHeader, StatCard, StatusBadge } from "./ui";

const statusOrder: Status[] = ["Not started", "Ready", "In progress", "Blocked", "Complete"];

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#e2e6e1] bg-white px-3 py-3">
      <span className={`size-2 shrink-0 rounded-full ${task.priority === "Critical" ? "bg-[#b85f45]" : task.priority === "High" ? "bg-[#c58d39]" : "bg-[#6f9c8d]"}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-[#29473f]">{task.title}</p>
        <p className="mt-1 text-[10px] text-[#849089]">{task.id} · {task.area} · {task.due}</p>
      </div>
      <StatusBadge status={task.status} />
    </div>
  );
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

function median(values: number[]) {
  const sorted = values.filter((value) => value > 0).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function money(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function fileSizeLabel(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function priceClosenessScore(price: number, peerPrices: number[]) {
  const peerMedian = median(peerPrices);
  if (!peerMedian || !price) return 0;
  const spread = Math.abs(price - peerMedian) / peerMedian;
  const base = 100 - spread * 180;
  const tooLowPenalty = price < peerMedian * 0.78 ? 12 : 0;
  return clampScore(base - tooLowPenalty);
}

function reviewQualityScore(rating: number, reviewCount: number) {
  const ratingScore = clampScore((rating / 5) * 100);
  const confidence = Math.min(1, Math.log10(reviewCount + 1) / 2);
  return clampScore(ratingScore * (0.72 + confidence * 0.28));
}

function scheduleScore(weeks: number) {
  if (weeks <= 2) return 92;
  if (weeks <= 4) return 84;
  if (weeks <= 6) return 72;
  if (weeks <= 8) return 60;
  return 45;
}

function quoteScore(row: BidRow, peerRows: BidRow[]) {
  const peerPrices = peerRows.map((item) => item.price);
  const values = {
    priceCloseness: priceClosenessScore(row.price, peerPrices),
    scopeFit: row.scopeFit,
    reviewQuality: reviewQualityScore(row.rating, row.reviewCount),
    ruralExperience: row.ruralExperience,
    scheduleFit: scheduleScore(row.scheduleWeeks),
    warranty: row.warranty,
    communication: row.communication,
    riskControl: row.riskControl,
  };

  const weighted = bidWeights.reduce((sum, weight) => sum + values[weight.key as keyof typeof values] * weight.weight, 0);
  const divisor = bidWeights.reduce((sum, weight) => sum + weight.weight, 0);
  return Math.round(weighted / divisor);
}

function leadMatchesPackage(lead: ContractorLead, packageTrade: string) {
  const leadRoot = lead.trade.split("/")[0].trim().toLowerCase();
  const packageRoot = packageTrade.split("/")[0].trim().toLowerCase();
  const leadText = `${lead.trade} ${lead.fit} ${lead.priority}`.toLowerCase();
  return lead.trade === packageTrade || leadText.includes(packageRoot) || packageTrade.toLowerCase().includes(leadRoot);
}

function leadReviewLabel(lead: ContractorLead) {
  if (typeof lead.rating === "number" && typeof lead.reviewCount === "number") {
    return `${lead.rating.toFixed(1)} stars · ${lead.reviewCount} reviews`;
  }
  return "Review lookup pending";
}

function leadPriorityTone(priority: string): "green" | "blue" | "amber" | "red" | "neutral" {
  const normalized = priority.toLowerCase();
  if (normalized.includes("primary") || normalized.includes("high-review")) return "green";
  if (normalized.includes("good") || normalized.includes("tank") || normalized.includes("specialty")) return "blue";
  if (normalized.includes("backup") || normalized.includes("needs")) return "amber";
  return "neutral";
}

export function Dashboard({ navigate }: { navigate: (page: PageKey) => void }) {
  const progress = 44;
  const actionItems = [
    { title: "Map downspouts D1-D8", note: "Confirms the collection manifold", owner: "LP", due: "Site visit", tone: "bg-[#b86743]" },
    { title: "Find the exterior tie-in point", note: "Sets the source-selector location", owner: "LP", due: "Site visit", tone: "bg-[#3d7a78]" },
    { title: "Request 20k and 30k tank quotes", note: "Includes pad requirements", owner: "LP", due: "Week 1", tone: "bg-[#8c7541]" },
  ];

  return (
    <>
      <SectionHeader
        eyebrow="Project command center"
        title="Whole-house rainwater with well backup."
        description={projectFacts.mission}
        action={<Button onClick={() => navigate("siteVisit")}><ClipboardList size={15} /> Start site visit</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Droplets} label="Storage target" value="20k / 30k" note="Practical vs long-term option" accent="blue" />
        <StatCard icon={CloudRain} label="Roof catchment" value={projectFacts.roofArea} note="Metal roof with gutters" accent="green" />
        <StatCard icon={CheckCircle2} label="Downspouts" value={projectFacts.downspouts} note="Collect all if practical" accent="gold" />
        <StatCard icon={ShieldCheck} label="Tie-in concept" value="Manual" note="Rain / well source selector" accent="clay" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_.85fr]">
        <Card className="relative min-h-[335px] overflow-hidden bg-[#173f37] text-white">
          <div className="paper-grid absolute inset-0 opacity-25" />
          <div className="absolute -top-28 -right-28 size-72 rounded-full border border-white/7" />
          <div className="absolute -top-16 -right-16 size-44 rounded-full border border-white/8" />
          <div className="relative flex h-full flex-col p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge tone="blue">Preferred concept</Badge>
                <h2 className="serif mt-4 max-w-xl text-[28px] leading-[1.08] font-semibold tracking-[-0.02em] sm:text-[34px]">Metal roof to potable tank, then back to the house through a controlled source selector.</h2>
              </div>
              <div className="hidden rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-right sm:block">
                <p className="text-[9px] uppercase tracking-[0.15em] text-[#9ebbb4]">Last reviewed</p>
                <p className="mt-1 text-xs font-bold">{projectFacts.preparedDate}</p>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="flex min-w-[620px] items-center gap-2 overflow-hidden sm:min-w-0">
                {[
                  [CloudRain, "Metal roof", "5k+ sq ft"],
                  [Filter, "Screens", "8 downspouts"],
                  [TankIcon, "Storage", "20k / 30k tank"],
                  [Network, "Selector", "Rain or well"],
                  [SprayCan, "Treatment", "Carbon + Class A UV"],
                ].map(([Icon, label, note], index) => (
                  <div key={String(label)} className="contents">
                    <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[.055] p-3 backdrop-blur-sm">
                      <Icon size={17} className="text-[#a8d4cc]" />
                      <p className="mt-2 text-[10px] font-bold">{label as string}</p>
                      <p className="mt-0.5 truncate text-[9px] text-[#8facaa]">{note as string}</p>
                    </div>
                    {index < 4 && <ArrowRight size={13} className="shrink-0 text-[#6f9990]" />}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9eb5af]">Plan maturity</span>
                  <span className="text-xs font-bold">{progress}%</span>
                </div>
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10 sm:w-48"><div className="h-full rounded-full bg-[#86bfb4]" style={{ width: `${progress}%` }} /></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <MiniLabel>Critical path</MiniLabel>
              <h2 className="mt-1 text-base font-bold text-[#24443c]">Next actions</h2>
            </div>
            <button onClick={() => navigate("tasks")} className="focus-ring rounded-lg p-2 text-[#52746c] hover:bg-[#eef3ef]" aria-label="Open task board"><ArrowUpRight size={17} /></button>
          </div>
          <div className="mt-5 space-y-4">
            {actionItems.map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className={`mt-1 size-2.5 shrink-0 rounded-full ${item.tone}`} />
                <div className="min-w-0 flex-1 border-b border-[#e7ebe6] pb-4 last:border-0 last:pb-0">
                  <p className="text-xs font-bold leading-5 text-[#2d4942]">{item.title}</p>
                  <p className="mt-0.5 text-[10px] text-[#838c87]">{item.note}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="grid size-6 place-items-center rounded-full bg-[#e9eeea] text-[8px] font-bold text-[#4b665f]">{item.owner}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#9a7966]">Target {item.due}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div><MiniLabel>Workstream health</MiniLabel><h2 className="mt-1 text-base font-bold">Design readiness</h2></div>
            <Badge tone="amber">Site visit next</Badge>
          </div>
          <div className="mt-5 space-y-4">
            {[
              ["Capture & conveyance", 68, "Known roof; verify grades"],
              ["Storage & civil", 62, "Tank site chosen; pad specs pending"],
              ["Pumping & tie-in", 54, "Concept set; line entry unknown"],
              ["Treatment & controls", 48, "Potable path set; lab sizing pending"],
            ].map(([label, value, note]) => (
              <div key={String(label)}>
                <div className="mb-2 flex justify-between gap-4"><span className="text-xs font-bold text-[#36534b]">{label}</span><span className="text-[10px] text-[#879089]">{note}</span></div>
                <Meter value={Number(value)} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div><MiniLabel>Recent work</MiniLabel><h2 className="mt-1 text-base font-bold">Project activity</h2></div>
            <button onClick={() => navigate("documents")} className="text-[10px] font-bold text-[#3d766d] hover:underline">View library</button>
          </div>
          <div className="mt-5 space-y-2.5">
            {seedTasks.filter((task) => ["Complete", "In progress"].includes(task.status)).slice(0, 4).map((task) => <TaskRow key={task.id} task={task} />)}
          </div>
        </Card>
      </div>
    </>
  );
}

export function IntakeQuestions({ notify }: { notify: (message: string) => void }) {
  const [values, setValues] = useState(() => intakeSections.map((section) => section.fields.map((field) => field[1])));
  const [confirmed, setConfirmed] = useState([false, false, false, false]);
  const confirmedCount = confirmed.filter(Boolean).length;
  const confirmedPercent = Math.round((confirmedCount / confirmed.length) * 100);

  const updateValue = (sectionIndex: number, fieldIndex: number, value: string) => {
    setValues((current) => current.map((section, sIndex) => sIndex === sectionIndex ? section.map((field, fIndex) => fIndex === fieldIndex ? value : field) : section));
  };

  return (
    <>
      <SectionHeader
        eyebrow="01 · Define the problem"
        title="Known project facts"
        description="The VChat handoff is now loaded as the working basis. Mark each group confirmed after the site visit or contractor review."
        action={<Button onClick={() => notify("Known facts saved locally")}>Save facts <Check size={14} /></Button>}
      />

      <Card className="mb-4 overflow-hidden">
        <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2"><Badge tone="blue">Loaded handoff</Badge><span className="text-[10px] text-[#8a938d]">{confirmedCount} of 4 sections confirmed</span></div>
            <h2 className="mt-3 text-lg font-bold text-[#24433b]">Do not re-ask what is already answered.</h2>
            <p className="mt-1 text-xs leading-5 text-[#748078]">The remaining field work is about verification: grades, line entry, tank footprint, pressure settings, and treatment sizing.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative grid size-16 place-items-center rounded-full" style={{ background: `conic-gradient(#4f8b7a 0 ${confirmedPercent}%, #e5e9e4 ${confirmedPercent}% 100%)` }}>
              <div className="grid size-[52px] place-items-center rounded-full bg-white text-sm font-bold text-[#34564e]">{confirmedPercent}%</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {intakeSections.map((section, sectionIndex) => (
          <Card key={section.title} className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div><MiniLabel>{section.eyebrow}</MiniLabel><h2 className="mt-1.5 text-base font-bold text-[#29473f]">{section.title}</h2></div>
              <button
                onClick={() => setConfirmed((current) => current.map((item, index) => index === sectionIndex ? !item : item))}
                className={`focus-ring flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${confirmed[sectionIndex] ? "bg-[#e0eee5] text-[#2c6a4f]" : "bg-[#eff1ee] text-[#7c8780]"}`}
              >
                <CheckCircle2 size={12} /> {confirmed[sectionIndex] ? "Confirmed" : "Needs review"}
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {section.fields.map((field, fieldIndex) => (
                <Field key={field[0]} label={field[0]} value={values[sectionIndex][fieldIndex]} onChange={(value) => updateValue(sectionIndex, fieldIndex, value)} />
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-4 border-[#d8e3de] bg-[#f0f6f2] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3"><Info size={18} className="mt-0.5 shrink-0 text-[#397467]" /><div><p className="text-xs font-bold text-[#275248]">Recommended next verification</p><p className="mt-1 text-xs leading-5 text-[#60736b]">Find the existing well line entry and the cleanest outdoor location for the rain / well / to-house valve box.</p></div></div>
          <Button variant="secondary" onClick={() => notify("Tie-in verification note added to the local plan")}>Add tie-in note</Button>
        </div>
      </Card>
    </>
  );
}

export function SiteVisitPlanner({ notify }: { notify: (message: string) => void }) {
  const [checked, setChecked] = useState(() => siteVisitSections.map((section) => section.items.map(() => false)));
  const [kitChecked, setKitChecked] = useState(() => fieldKit.map(() => false));
  const [measureValues, setMeasureValues] = useState(() => siteMeasurements.map((item) => item.value));
  const [downspouts, setDownspouts] = useState(() => Array.from({ length: 8 }, (_, index) => ({
    id: `D${index + 1}`,
    photo: false,
    grade: false,
    route: false,
    note: "",
  })));

  const totalItems = checked.reduce((sum, section) => sum + section.length, 0);
  const doneItems = checked.reduce((sum, section) => sum + section.filter(Boolean).length, 0);
  const downspoutDone = downspouts.filter((item) => item.photo && item.grade && item.route).length;
  const kitDone = kitChecked.filter(Boolean).length;
  const progress = Math.round(((doneItems + downspoutDone + kitDone) / (totalItems + downspouts.length + fieldKit.length)) * 100);

  const toggleChecklist = (sectionIndex: number, itemIndex: number) => {
    setChecked((current) => current.map((section, sIndex) => sIndex === sectionIndex ? section.map((item, iIndex) => iIndex === itemIndex ? !item : item) : section));
  };

  const toggleDownspout = (index: number, key: "photo" | "grade" | "route") => {
    setDownspouts((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: !item[key] } : item));
  };

  return (
    <>
      <SectionHeader
        eyebrow="Next step"
        title="Weekend site visit planner"
        description="A field-ready checklist for gathering the photos, measurements, and decisions that unlock contractor pricing."
        action={<Button onClick={() => notify("Site visit packet marked ready") }><Camera size={14} /> Ready packet</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardList} label="Checklist progress" value={`${progress}%`} note={`${doneItems} of ${totalItems} site items done`} accent="green" />
        <StatCard icon={Camera} label="Downspouts mapped" value={`${downspoutDone}/8`} note="Photo, grade, and route checked" accent="blue" />
        <StatCard icon={Ruler} label="Measurements" value={String(siteMeasurements.length)} note="Editable field values" accent="gold" />
        <StatCard icon={FileSpreadsheet} label="Quote folders" value="5" note="One per trade package" accent="clay" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-[#e1e6e0] p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div><MiniLabel>Downspout map</MiniLabel><h2 className="mt-1 text-base font-bold">D1-D8 field tracker</h2></div>
              <Badge tone={downspoutDone === 8 ? "green" : "amber"}>{downspoutDone} complete</Badge>
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
            {downspouts.map((item, index) => (
              <div key={item.id} className="rounded-2xl border border-[#dfe5df] bg-[#fafbf9] p-4">
                <div className="flex items-center justify-between">
                  <div className="grid size-9 place-items-center rounded-xl bg-[#e2eeea] text-xs font-extrabold text-[#376f63]">{item.id}</div>
                  <Badge tone={item.photo && item.grade && item.route ? "green" : "neutral"}>{item.photo && item.grade && item.route ? "Ready" : "Open"}</Badge>
                </div>
                <div className="mt-4 grid gap-2">
                  {[
                    ["photo", "Photo", Camera],
                    ["grade", "Slope", Ruler],
                    ["route", "Route", MapPin],
                  ].map(([key, label, Icon]) => (
                    <button
                      key={String(key)}
                      onClick={() => toggleDownspout(index, key as "photo" | "grade" | "route")}
                      className={`focus-ring flex h-9 items-center justify-between rounded-xl border px-3 text-[10px] font-bold ${item[key as "photo" | "grade" | "route"] ? "border-[#b7d0c4] bg-[#e4f1e8] text-[#2d6d4e]" : "border-[#dfe4de] bg-white text-[#6d7972]"}`}
                    >
                      <span className="flex items-center gap-2"><Icon size={13} />{label as string}</span>
                      {item[key as "photo" | "grade" | "route"] && <Check size={13} />}
                    </button>
                  ))}
                </div>
                <input
                  value={item.note}
                  onChange={(event) => setDownspouts((current) => current.map((downspout, itemIndex) => itemIndex === index ? { ...downspout, note: event.target.value } : downspout))}
                  placeholder="Notes"
                  className="focus-ring mt-3 h-9 w-full rounded-xl border border-[#dce2dc] bg-white px-3 text-[10px] outline-none"
                />
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5 sm:p-6">
            <MiniLabel>Bring list</MiniLabel>
            <div className="mt-4 grid gap-2">
              {fieldKit.map((item, index) => (
                <button
                  key={item}
                  onClick={() => setKitChecked((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))}
                  className={`focus-ring flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-[10px] font-semibold ${kitChecked[index] ? "border-[#bfd8ca] bg-[#e5f1e8] text-[#2f6b50]" : "border-[#e0e5df] bg-[#fafbf9] text-[#53675f]"}`}
                >
                  <span className={`grid size-5 place-items-center rounded-md border ${kitChecked[index] ? "border-[#4f8b69] bg-[#4f8b69] text-white" : "border-[#cbd4cc] bg-white text-transparent"}`}><Check size={12} /></span>
                  {item}
                </button>
              ))}
            </div>
          </Card>
          <Card className="border-[#ecdccf] bg-[#fbf6f1] p-5 sm:p-6">
            <div className="flex gap-3"><TriangleAlert size={18} className="mt-0.5 shrink-0 text-[#aa6542]" /><div><MiniLabel>Do not leave without</MiniLabel><p className="mt-2 text-xs leading-5 text-[#6b5546]">Well line entry, pressure settings, 20k/30k footprint photos, and the exterior source-selector location. Those four unlock the most contractor value.</p></div></div>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><MiniLabel>Measurements</MiniLabel><h2 className="mt-1 text-base font-bold">Field values</h2></div><Ruler size={18} className="text-[#527b72]" /></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {siteMeasurements.map((item, index) => (
              <div key={item.label}>
                <Field label={item.label} value={measureValues[index]} suffix={item.unit} onChange={(value) => setMeasureValues((current) => current.map((field, fieldIndex) => fieldIndex === index ? value : field))} />
                <p className="mt-1.5 text-[9px] leading-4 text-[#7a857e]">{item.note}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4">
          {siteVisitSections.map((section, sectionIndex) => {
            const sectionDone = checked[sectionIndex].filter(Boolean).length;
            return (
              <Card key={section.title} className="overflow-hidden">
                <div className="border-b border-[#e3e7e2] p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div><MiniLabel>{section.focus}</MiniLabel><h2 className="mt-1 text-base font-bold text-[#29473f]">{section.title}</h2></div>
                    <Badge tone={sectionDone === section.items.length ? "green" : "amber"}>{sectionDone}/{section.items.length}</Badge>
                  </div>
                </div>
                <div className="grid gap-2 p-5 sm:grid-cols-2">
                  {section.items.map((item, itemIndex) => (
                    <button
                      key={item}
                      onClick={() => toggleChecklist(sectionIndex, itemIndex)}
                      className={`focus-ring flex items-start gap-3 rounded-xl border p-3 text-left text-[10px] leading-4 font-semibold ${checked[sectionIndex][itemIndex] ? "border-[#bdd7c8] bg-[#e4f0e8] text-[#2e6c4f]" : "border-[#e0e5df] bg-[#fafbf9] text-[#5d6f67]"}`}
                    >
                      <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border ${checked[sectionIndex][itemIndex] ? "border-[#4f8b69] bg-[#4f8b69] text-white" : "border-[#ccd5ce] bg-white text-transparent"}`}><Check size={12} /></span>
                      {item}
                    </button>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function MasterTaskBoard({ notify }: { notify: (message: string) => void }) {
  const [taskList, setTaskList] = useState(seedTasks);
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("All workstreams");
  const areas = ["All workstreams", ...Array.from(new Set(seedTasks.map((task) => task.area)))];
  const filtered = taskList.filter((task) => (area === "All workstreams" || task.area === area) && `${task.id} ${task.title} ${task.owner}`.toLowerCase().includes(query.toLowerCase()));

  const moveTask = (task: Task) => {
    const next = statusOrder[(statusOrder.indexOf(task.status) + 1) % statusOrder.length];
    setTaskList((current) => current.map((item) => item.id === task.id ? { ...item, status: next } : item));
  };

  return (
    <>
      <SectionHeader
        eyebrow="Project delivery"
        title="Master task board"
        description="All workstreams, dependencies, owners, and next actions in one delivery queue. Click a card arrow to advance its status."
        action={<Button onClick={() => notify("New-task workflow is ready for database integration")}><Plus size={14} /> Add task</Button>}
      />

      <Card className="mb-4 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#829089]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, owners, or IDs" className="focus-ring h-10 w-full rounded-xl border border-[#dde3dc] bg-[#fafbf9] pr-3 pl-9 text-xs outline-none" />
          </label>
          <label className="relative sm:w-52">
            <Filter size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#829089]" />
            <select value={area} onChange={(event) => setArea(event.target.value)} className="focus-ring h-10 w-full appearance-none rounded-xl border border-[#dde3dc] bg-[#fafbf9] px-9 text-xs font-semibold outline-none">
              {areas.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="flex gap-2"><Badge tone="green">{taskList.filter((task) => task.status === "Complete").length} done</Badge><Badge tone="red">{taskList.filter((task) => task.status === "Blocked").length} blocked</Badge></div>
        </div>
      </Card>

      <div className="scrollbar-none -mx-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10">
        <div className="grid min-w-[1180px] grid-cols-5 gap-3">
          {statusOrder.map((status) => {
            const columnTasks = filtered.filter((task) => task.status === status);
            return (
              <section key={status} className="rounded-[20px] bg-[#eef1ed] p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2"><span className={`size-2 rounded-full ${status === "Complete" ? "bg-[#4f8c69]" : status === "Blocked" ? "bg-[#b65f48]" : status === "In progress" ? "bg-[#4e8790]" : "bg-[#9ca79f]"}`} /><h2 className="text-[11px] font-bold uppercase tracking-[0.11em] text-[#52645d]">{status}</h2></div>
                  <span className="rounded-md bg-white px-2 py-0.5 text-[9px] font-bold text-[#77827c]">{columnTasks.length}</span>
                </div>
                <div className="space-y-2.5">
                  {columnTasks.map((task) => (
                    <article key={task.id} className="rounded-2xl border border-[#dfe4de] bg-white p-3.5 shadow-[0_3px_12px_rgba(28,58,51,.04)]">
                      <div className="flex items-center justify-between"><span className="text-[9px] font-bold uppercase tracking-wider text-[#769087]">{task.id} · {task.area}</span><Badge tone={task.priority === "Critical" ? "red" : task.priority === "High" ? "amber" : "neutral"}>{task.priority}</Badge></div>
                      <h3 className="mt-3 text-xs leading-5 font-bold text-[#29473f]">{task.title}</h3>
                      <div className="mt-4 flex items-center justify-between border-t border-[#edf0ec] pt-3">
                        <div className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full bg-[#e5ece8] text-[8px] font-bold text-[#49675f]">{task.owner.slice(0, 2).toUpperCase()}</span><span className="text-[9px] text-[#86908a]">{task.due}</span></div>
                        <button onClick={() => moveTask(task)} aria-label={`Advance ${task.title}`} className="focus-ring rounded-lg bg-[#eef3ef] p-1.5 text-[#3e6e63] hover:bg-[#dce9e3]"><ChevronRight size={13} /></button>
                      </div>
                    </article>
                  ))}
                  {columnTasks.length === 0 && <div className="rounded-2xl border border-dashed border-[#ccd4cd] py-8 text-center text-[10px] text-[#89948e]">No matching tasks</div>}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

const monthlyRain = [1.8, 2.2, 2.7, 2.5, 4.2, 3.4, 1.8, 2.0, 3.1, 3.5, 1.9, 1.6];
const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export function RainwaterCalculators() {
  const [roofArea, setRoofArea] = useState(5000);
  const [rainfall, setRainfall] = useState(30.7);
  const [efficiency, setEfficiency] = useState(85);
  const [dailyDemand, setDailyDemand] = useState(250);
  const [firstFlush, setFirstFlush] = useState(0.02);
  const annualCapture = roofArea * rainfall * 0.623 * (efficiency / 100);
  const oneInchCapture = roofArea * 0.623 * (efficiency / 100);
  const daysCovered = annualCapture / dailyDemand;
  const diverterVolume = roofArea * firstFlush * 0.623;
  const maxMonth = Math.max(...monthlyRain);

  return (
    <>
      <SectionHeader eyebrow="Design tools" title="Rainwater calculators" description="Editable sizing tools seeded with the current handoff: 5,000+ sq ft metal roof, Central Texas rainfall, and whole-house planning demand." action={<PageAction label="Method notes" />} />

      <div className="grid gap-4 lg:grid-cols-[.78fr_1.22fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><MiniLabel>Inputs</MiniLabel><h2 className="mt-1 text-base font-bold">Capture assumptions</h2></div><SlidersHorizontal size={18} className="text-[#527b72]" /></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Field label="Total roof area" value={roofArea} type="number" suffix="sq ft" min={0} onChange={(value) => setRoofArea(Number(value))} />
            <Field label="Annual rainfall" value={rainfall} type="number" suffix="in / yr" min={0} step={0.1} onChange={(value) => setRainfall(Number(value))} />
            <Field label="Collection efficiency" value={efficiency} type="number" suffix="percent" min={0} max={100} onChange={(value) => setEfficiency(Number(value))} />
            <Field label="Average daily demand" value={dailyDemand} type="number" suffix="gal / day" min={1} onChange={(value) => setDailyDemand(Number(value))} />
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2"><Field label="First-flush depth" value={firstFlush} type="number" suffix="inches" min={0} step={0.01} onChange={(value) => setFirstFlush(Number(value))} /></div>
          </div>
          <div className="mt-5 rounded-2xl bg-[#f0f5f2] p-4">
            <div className="flex gap-2"><Info size={15} className="mt-0.5 shrink-0 text-[#4e7e72]" /><p className="text-[10px] leading-5 text-[#66756e]">Yield uses 0.623 gallons per square foot per inch of rain. Collection efficiency accounts for splash, wind, conveyance, screening, and first-flush losses.</p></div>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="relative overflow-hidden bg-[#173f37] p-5 text-white sm:col-span-2 sm:p-6">
            <div className="absolute top-0 right-0 h-full w-1/3 bg-[radial-gradient(circle_at_center,rgba(132,190,179,.2),transparent_65%)]" />
            <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div><Badge tone="blue">Estimated annual yield</Badge><p className="mt-4 text-[38px] leading-none font-semibold tracking-[-0.05em] sm:text-[50px]">{Math.round(annualCapture).toLocaleString()} <span className="text-base tracking-normal text-[#a9c1bb]">gal</span></p><p className="mt-3 text-xs text-[#a8beb8]">Equivalent to {Math.round(daysCovered)} days at the editable planning-demand input.</p></div>
              <div className="grid size-28 place-items-center rounded-full border-[10px] border-[#2c574f] bg-[#1c463e] text-center"><div><Droplets className="mx-auto text-[#8bc3ba]" size={22} /><p className="mt-1 text-lg font-bold">{Math.round(daysCovered / 3.65)}%</p><p className="text-[8px] uppercase tracking-wider text-[#97b5ae]">Annual demand</p></div></div>
            </div>
          </Card>
          <Card className="p-5"><MiniLabel>One-inch event</MiniLabel><p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#24463e]">{Math.round(oneInchCapture).toLocaleString()} gal</p><p className="mt-2 text-[10px] leading-4 text-[#7b8680]">Net recoverable volume from all active roofs.</p></Card>
          <Card className="p-5"><MiniLabel>First-flush diversion</MiniLabel><p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#24463e]">{Math.round(diverterVolume)} gal</p><p className="mt-2 text-[10px] leading-4 text-[#7b8680]">Total at {firstFlush.toFixed(2)} inch across the collection area.</p></Card>
        </div>
      </div>

      <Card className="mt-4 p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><MiniLabel>Seasonality</MiniLabel><h2 className="mt-1 text-base font-bold">Monthly capture potential</h2></div><p className="text-[10px] text-[#7c8881]">Illustrative distribution normalized to 30.7 in/yr; replace with the final local station and drought basis</p></div>
        <div className="mt-7 flex h-48 items-end gap-2 sm:gap-4">
          {monthlyRain.map((rain, index) => {
            const volume = roofArea * rain * 0.623 * efficiency / 100;
            return (
              <div key={`${months[index]}-${index}`} className="group flex h-full flex-1 flex-col justify-end">
                <div className="relative flex h-[155px] items-end rounded-t-lg bg-[#eef3f0]">
                  <div className="w-full rounded-t-lg bg-[#6e9e9a] transition-all group-hover:bg-[#3f7f78]" style={{ height: `${(rain / maxMonth) * 100}%` }}>
                    <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[#173f37] px-2 py-1 text-[8px] text-white group-hover:block">{Math.round(volume / 1000)}k gal</span>
                  </div>
                </div>
                <span className="mt-2 text-center text-[9px] font-bold text-[#7d8982]">{months[index]}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

export function TankPlanning() {
  const [dailyDemand, setDailyDemand] = useState(250);
  const [autonomy, setAutonomy] = useState(45);
  const [reserve, setReserve] = useState(25);
  const usableRequired = dailyDemand * autonomy;
  const nominalRequired = usableRequired / (1 - reserve / 100);
  const options = [
    { label: "Practical target", total: 20000, config: "One metal potable tank", fit: "Likely", note: "Lower visual and budget impact while still giving meaningful whole-house backup." },
    { label: "Long-term target", total: 30000, config: "One large tank or supplier-approved layout", fit: "Preferred if feasible", note: "Best long-term option if quotes, pad, and visibility are acceptable." },
    { label: "Expansion path", total: 40000, config: "Add a second tank later", fit: "Future", note: "Only after demand, catchment, and budget justify more stored volume." },
  ];

  return (
    <>
      <SectionHeader eyebrow="Storage strategy" title="Tank planning" description="Compare the practical 20,000 gallon target against the stronger 30,000 gallon target, then confirm the manufacturer's pad and access requirements." action={<PageAction label="Compare vendors" />} />
      <div className="grid gap-4 lg:grid-cols-[.85fr_1.15fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><MiniLabel>Planning basis</MiniLabel><h2 className="mt-1 text-base font-bold">Storage requirement</h2></div><TankIcon size={19} className="text-[#4d7c73]" /></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <Field label="Daily demand" value={dailyDemand} type="number" suffix="gal / day" min={1} onChange={(value) => setDailyDemand(Number(value))} />
            <Field label="Autonomy target" value={autonomy} type="number" suffix="days" min={1} onChange={(value) => setAutonomy(Number(value))} />
            <Field label="Emergency reserve" value={reserve} type="number" suffix="percent" min={0} max={80} onChange={(value) => setReserve(Number(value))} />
          </div>
          <div className="mt-6 rounded-2xl bg-[#173f37] p-5 text-white">
            <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#9bb9b2]">Calculated nominal storage</p>
            <p className="mt-3 text-[36px] font-semibold tracking-[-0.05em]">{Math.ceil(nominalRequired / 500) * 500 > 0 ? (Math.ceil(nominalRequired / 500) * 500).toLocaleString() : 0} <span className="text-sm tracking-normal text-[#aac0ba]">gal</span></p>
            <p className="mt-2 text-[10px] leading-5 text-[#a8bdb7]">Includes {reserve}% protected reserve; final usable volume depends on outlet elevation and tank geometry.</p>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-[#e2e7e1] p-5 sm:p-6"><div className="flex items-center justify-between"><div><MiniLabel>Required comparison</MiniLabel><h2 className="mt-1 text-base font-bold">20k vs 30k storage decision</h2></div><Badge tone="amber">Quote both</Badge></div></div>
          <div className="grid gap-6 p-5 sm:grid-cols-[1fr_1.05fr] sm:p-6">
            <div className="relative flex min-h-56 items-end justify-center overflow-hidden rounded-2xl bg-[#eef3ef] p-5">
              <div className="absolute inset-0 paper-grid opacity-70" />
              <div className="relative flex items-end gap-3">
                {[[67, "20k"], [100, "30k"]].map(([height, label]) => (
                  <div key={label} className="relative h-36 w-16 overflow-hidden rounded-t-[28px] border-2 border-[#64837c] bg-[#d7e4e0] shadow-[inset_0_-10px_20px_rgba(59,113,112,.15)]">
                    <div className="absolute inset-x-0 bottom-0 bg-[#79a6a4]/70" style={{ height: `${height}%` }} />
                    <div className="absolute top-5 right-3 left-3 h-px bg-[#79978f]" />
                    <span className="absolute inset-x-0 bottom-4 text-center text-[8px] font-bold text-[#214a42]">{label}</span>
                  </div>
                ))}
              </div>
              <div className="absolute right-4 bottom-4 left-4 flex justify-between text-[8px] font-bold uppercase tracking-wider text-[#799088]"><span>Compare usable volume</span><span>Concept only</span></div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-3">
                {[["Roof yield", "~72-86k gal/yr"], ["Pipe route", "~100 yd downhill"], ["Use", "Whole-house"], ["Tank pad", "Manufacturer spec"]].map(([label, value]) => <div key={label} className="rounded-xl border border-[#e1e5e0] p-3"><MiniLabel>{label}</MiniLabel><p className="mt-2 text-sm font-bold text-[#315048]">{value}</p></div>)}
              </div>
              <div className="mt-4 space-y-2.5">
                {["Quote 20k and 30k tanks with identical fittings", "Confirm compacted gravel pad is acceptable", "Route screened overflow downhill to the pond", "Leave service access and room for another tank if useful"].map((item) => <div key={item} className="flex gap-2 text-[10px] leading-4 text-[#68766f]"><CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#4f8b6d]" />{item}</div>)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {options.map((option, index) => (
          <Card key={option.label} className={`p-5 ${index === 1 ? "border-[#8eb1a6] ring-1 ring-[#8eb1a6]/40" : ""}`}>
            <div className="flex items-center justify-between"><Badge tone={index === 1 ? "blue" : "neutral"}>{option.fit}</Badge><span className="text-[9px] font-bold text-[#8b958f]">OPT 0{index + 1}</span></div>
            <h3 className="mt-4 text-sm font-bold text-[#2a4841]">{option.label}</h3>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#203e37]">{option.total.toLocaleString()} <span className="text-xs tracking-normal text-[#829088]">gal</span></p>
            <p className="mt-1 text-[10px] font-bold text-[#5c7d73]">{option.config}</p>
            <p className="mt-3 text-[10px] leading-4 text-[#7c8781]">{option.note}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

export function PumpingDistribution() {
  const [flow, setFlow] = useState(12);
  const [staticHead, setStaticHead] = useState(10);
  const [pressure, setPressure] = useState(60);
  const [friction, setFriction] = useState(15);
  const [efficiency, setEfficiency] = useState(60);
  const pressureHead = pressure * 2.31;
  const totalHead = staticHead + pressureHead + friction;
  const waterHp = flow * totalHead / 3960;
  const brakeHp = waterHp / (efficiency / 100);
  const recommendedHp = Math.max(1.5, Math.ceil(brakeHp * 1.2 * 2) / 2);
  const zones = [
    { zone: "House supply", demand: "Whole-house", pressure: "40/60 target", run: "~100 yd", priority: "Primary", icon: PanelTop },
    { zone: "Well backup", demand: "Existing line", pressure: "Unknown", run: "~50 yd west", priority: "Backup", icon: Gauge },
    { zone: "Tank utility", demand: "Flush / service", pressure: "At pump", run: "At tank", priority: "Service", icon: Droplet },
    { zone: "Pond overflow", demand: "Gravity", pressure: "None", run: "~50 yd west", priority: "Overflow", icon: Waves },
  ];

  return (
    <>
      <SectionHeader eyebrow="Hydraulics" title="Pumping & distribution" description="Pump from the north tank site back to the house through a potable pressure line, then meet the well at a labeled exterior source-selector box." action={<PageAction label="Export design basis" />} />

      <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><MiniLabel>Pump sizing</MiniLabel><h2 className="mt-1 text-base font-bold">Hydraulic duty point</h2></div><Gauge size={19} className="text-[#4d7d74]" /></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Design flow" value={flow} type="number" suffix="gpm" min={1} onChange={(value) => setFlow(Number(value))} />
            <Field label="Static elevation head" value={staticHead} type="number" suffix="ft" min={0} onChange={(value) => setStaticHead(Number(value))} />
            <Field label="Required pressure" value={pressure} type="number" suffix="psi" min={0} onChange={(value) => setPressure(Number(value))} />
            <Field label="Estimated friction loss" value={friction} type="number" suffix="ft" min={0} onChange={(value) => setFriction(Number(value))} />
            <div className="sm:col-span-2"><Field label="Wire-to-water efficiency" value={efficiency} type="number" suffix="percent" min={1} max={100} onChange={(value) => setEfficiency(Number(value))} /></div>
          </div>
          <div className="mt-5 flex gap-2 rounded-xl bg-[#f2f5f2] p-3"><Info size={14} className="mt-0.5 shrink-0 text-[#4d776e]" /><p className="text-[9px] leading-4 text-[#6b7972]">Editable concept inputs only. Final pump must account for the verified pipe size, route, fittings, pressure setting, and manufacturer pump curve.</p></div>
        </Card>

        <Card className="overflow-hidden">
          <div className="grid min-h-full sm:grid-cols-[1.05fr_.95fr]">
            <div className="bg-[#173f37] p-5 text-white sm:p-6">
              <MiniLabel>Calculated duty</MiniLabel>
              <p className="mt-4 text-[42px] font-semibold tracking-[-0.06em]">{Math.round(totalHead)} <span className="text-sm tracking-normal text-[#abc0ba]">ft TDH</span></p>
              <p className="mt-1 text-xs text-[#9fb7b1]">at {flow} gallons per minute</p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-[9px] uppercase tracking-wider text-[#92aaa4]">Brake HP</p><p className="mt-2 text-lg font-bold">{brakeHp.toFixed(2)}</p></div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-[9px] uppercase tracking-wider text-[#92aaa4]">Select motor</p><p className="mt-2 text-lg font-bold">{recommendedHp.toFixed(1)} hp</p></div>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <MiniLabel>Head components</MiniLabel>
              <div className="mt-5 space-y-4">
                {[
                  ["Elevation", staticHead, "bg-[#a66a47]"],
                  ["Delivery pressure", pressureHead, "bg-[#4e8581]"],
                  ["Friction allowance", friction, "bg-[#8f9d75]"],
                ].map(([label, value, color]) => (
                  <div key={String(label)}><div className="mb-2 flex justify-between text-[10px]"><span className="font-bold text-[#53665f]">{label}</span><span className="text-[#7d8983]">{Math.round(Number(value))} ft</span></div><Meter value={Number(value) / totalHead * 100} color={String(color)} /></div>
                ))}
              </div>
              <div className="mt-6 flex gap-2 rounded-xl bg-[#f2f5f2] p-3"><Info size={14} className="mt-0.5 shrink-0 text-[#4d776e]" /><p className="text-[9px] leading-4 text-[#6b7972]">Concept sizing only. Final pump must be selected on a manufacturer curve at the verified duty point.</p></div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-4 p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><MiniLabel>Service map</MiniLabel><h2 className="mt-1 text-base font-bold">Source and return paths</h2></div><Badge tone="amber">Field verify line entry</Badge></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {zones.map((zone) => {
            const Icon = zone.icon;
            return (
              <div key={zone.zone} className="rounded-2xl border border-[#e0e5df] bg-[#fafbf9] p-4">
                <div className="flex items-center justify-between"><div className="grid size-9 place-items-center rounded-xl bg-[#e2eeea] text-[#376f63]"><Icon size={16} /></div><Badge tone={zone.priority === "Primary" ? "green" : zone.priority === "Backup" ? "blue" : "neutral"}>{zone.priority}</Badge></div>
                <h3 className="mt-4 text-sm font-bold text-[#2c4942]">{zone.zone}</h3>
                <div className="mt-3 grid grid-cols-3 gap-1 text-center"><div><p className="text-[8px] uppercase text-[#87918c]">Flow</p><p className="mt-1 text-[10px] font-bold">{zone.demand}</p></div><div><p className="text-[8px] uppercase text-[#87918c]">Pressure</p><p className="mt-1 text-[10px] font-bold">{zone.pressure}</p></div><div><p className="text-[8px] uppercase text-[#87918c]">Run</p><p className="mt-1 text-[10px] font-bold">{zone.run}</p></div></div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

export function WellInvestigation({ notify }: { notify: (message: string) => void }) {
  const facts = [
    { label: "Aquifer", value: "Trinity", note: "Existing house well source", icon: Waves },
    { label: "Well location", value: "~50 yd west", note: "Pressure tank is in well house", icon: ArrowDown },
    { label: "Current treatment", value: "Sediment + softener", note: "Kitchen sink RO remains", icon: TestTube2 },
    { label: "Pressure setting", value: "Unknown", note: "Read gauge and switch on site", icon: Gauge },
  ];
  const steps = [
    { title: "Find house entry", detail: "Locate the exact point where the existing well line enters the slab or house plumbing.", status: "Ready" },
    { title: "Choose valve-box location", detail: "Pick an exterior spot where rainwater from the north and well water from the west can meet cleanly.", status: "Ready" },
    { title: "Confirm line size/material", detail: "Expose or identify the existing buried well line before the plumber builds the tie-in.", status: "Not started" },
    { title: "Record pressure settings", detail: "Read the pressure gauge and determine the cut-in/cut-out setting at the well pressure tank.", status: "Ready" },
    { title: "Test well and rainwater quality", detail: "Collect certified samples to confirm treatment needs and annual testing baseline.", status: "Not started" },
  ];

  return (
    <>
      <SectionHeader eyebrow="Existing source" title="Well investigation" description="The well stays as backup. The immediate design need is to document the line, pressure, and clean exterior tie-in point before trenching or plumbing." action={<Button onClick={() => notify("Well/tie-in checklist prepared")}><FilePlus2 size={14} /> Prepare checklist</Button>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {facts.map((fact) => { const Icon = fact.icon; return <Card key={fact.label} className="p-5"><div className="flex items-start justify-between"><MiniLabel>{fact.label}</MiniLabel><Icon size={17} className="text-[#537c73]" /></div><p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#27483f]">{fact.value}</p><p className="mt-1 text-[10px] text-[#7f8a84]">{fact.note}</p></Card>; })}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><MiniLabel>Field program</MiniLabel><h2 className="mt-1 text-base font-bold">Investigation sequence</h2></div><Badge tone="amber">0 of 5 complete</Badge></div>
          <div className="mt-6">
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
                {index < steps.length - 1 && <span className="absolute top-7 bottom-0 left-[13px] w-px bg-[#d9e0da]" />}
                <div className={`relative z-10 grid size-7 shrink-0 place-items-center rounded-full border-2 ${step.status === "Complete" ? "border-[#4c8a68] bg-[#e3f0e7] text-[#337154]" : step.status === "Ready" ? "border-[#54878a] bg-[#e5f0f1] text-[#3f7478]" : "border-[#d2d9d2] bg-white text-[#9aa39d]"}`}>{step.status === "Complete" ? <Check size={12} /> : <span className="text-[8px] font-bold">{index + 1}</span>}</div>
                <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold text-[#2d4a42]">{step.title}</p><StatusBadge status={step.status} /></div><p className="mt-1 text-[10px] leading-4 text-[#76827b]">{step.detail}</p></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="bg-[#173f37] p-5 text-white sm:p-6"><MiniLabel>Decision gate</MiniLabel><h2 className="serif mt-3 text-2xl leading-tight font-semibold">Where can rainwater and well water safely meet?</h2><p className="mt-3 text-[11px] leading-5 text-[#a8bdb8]">The preferred answer is outside, before the existing well line enters the house, in a labeled and serviceable valve box.</p></div>
          <div className="p-5 sm:p-6">
            <MiniLabel>Acceptance criteria</MiniLabel>
            <div className="mt-4 space-y-3">
              {[["No backfeed", "Rainwater and well lines cannot pressurize each other"], ["Service access", "Large rectangular valve box with labels and unions"], ["Known pressure", "Rainwater pump setting coordinates with well setting"], ["Treatment path", "Both sources pass through carbon and Class A UV for household use"]].map(([label, value]) => <div key={label} className="rounded-xl border border-[#e1e5e0] p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-[#7a8982]">{label}</p><p className="mt-1.5 text-[11px] font-semibold leading-4 text-[#355249]">{value}</p></div>)}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export function TreatmentPlanning() {
  const stages = [
    { number: "01", title: "Source protection", detail: "Downspout screens, roof washer, screened tank vent and overflow", icon: ShieldCheck, state: "Defined" },
    { number: "02", title: "Existing filtration", detail: "Retain or upgrade sediment filter; keep softener in line initially", icon: RotateCcw, state: "Defined" },
    { number: "03", title: "Carbon filtration", detail: "Whole-house carbon sized for verified household flow", icon: SlidersHorizontal, state: "Required" },
    { number: "04", title: "Polishing / pH", detail: "Final sediment or calcite only if testing shows need", icon: Sparkles, state: "Pending lab" },
    { number: "05", title: "Disinfection", detail: "NSF/ANSI 55 Class A UV with alarm or shutoff if budget allows", icon: Sun, state: "Required" },
  ];
  return (
    <>
      <SectionHeader eyebrow="Water quality" title="Water treatment planning" description="Plan for potable whole-house rainwater while keeping the well as backup and the kitchen sink RO as the final drinking-water polish." action={<PageAction label="Add lab report" />} />
      <Card className="overflow-hidden">
        <div className="border-b border-[#e0e5df] p-5 sm:p-6"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><MiniLabel>Treatment-ready concept</MiniLabel><h2 className="mt-1 text-base font-bold">Residence treatment train</h2></div><Badge tone="amber">Lab sizing required</Badge></div></div>
        <div className="scrollbar-none overflow-x-auto p-5 sm:p-6">
          <div className="flex min-w-[920px] items-stretch gap-2">
            {stages.map((stage, index) => { const Icon = stage.icon; return <div key={stage.number} className="contents"><div className="min-w-0 flex-1 rounded-2xl border border-[#dfe5df] bg-[#fafbf9] p-4"><div className="flex items-center justify-between"><span className="text-[9px] font-bold text-[#799088]">{stage.number}</span><Icon size={17} className="text-[#4d7c73]" /></div><h3 className="mt-5 text-xs font-bold text-[#2b4941]">{stage.title}</h3><p className="mt-2 text-[9px] leading-4 text-[#75817b]">{stage.detail}</p><div className="mt-4"><Badge tone={stage.state === "Defined" ? "green" : stage.state === "Pending lab" ? "amber" : "blue"}>{stage.state}</Badge></div></div>{index < stages.length - 1 && <div className="grid place-items-center"><ArrowRight size={14} className="text-[#8aa099]" /></div>}</div>; })}
          </div>
        </div>
      </Card>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card className="p-5"><div className="flex items-center justify-between"><MiniLabel>Rainwater train</MiniLabel><Badge tone="green">Potable goal</Badge></div><h3 className="mt-4 text-sm font-bold">Core testing panel</h3><p className="mt-2 text-[10px] leading-5 text-[#748079]">Total coliform / E. coli, turbidity, pH, TDS, hardness, iron, manganese, nitrate, lead, arsenic.</p></Card>
        <Card className="p-5"><div className="flex items-center justify-between"><MiniLabel>Well train</MiniLabel><Badge tone="blue">Backup source</Badge></div><h3 className="mt-4 text-sm font-bold">Shared household path</h3><p className="mt-2 text-[10px] leading-5 text-[#748079]">The well can stay in the existing treatment path, then pass through added carbon and Class A UV when selected for house supply.</p></Card>
        <Card className="p-5"><div className="flex items-center justify-between"><MiniLabel>Safeguards</MiniLabel><Badge tone="green">Required</Badge></div><h3 className="mt-4 text-sm font-bold">Fail-safe controls</h3><p className="mt-2 text-[10px] leading-5 text-[#748079]">UV alarm, sample taps before and after treatment, pressure gauges, low-water cutoff, and clear source-selector labels.</p></Card>
      </div>
    </>
  );
}

export function RegulatoryChecklist() {
  const [checked, setChecked] = useState(() => regulatoryItems.map((item) => item.status === "Complete"));
  const complete = checked.filter(Boolean).length;
  return (
    <>
      <SectionHeader eyebrow="Compliance" title="Regulatory checklist" description="Track the applicability decisions, permits, design controls, and retained evidence needed to make the project inspectable and defensible." action={<PageAction label="Authority contacts" />} />
      <div className="grid gap-4 lg:grid-cols-[1fr_270px]">
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[36px_1.6fr_.7fr_.55fr_.8fr] gap-3 border-b border-[#dfe5df] bg-[#f4f6f3] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#74817a] md:grid"><span /><span>Requirement</span><span>Authority</span><span>Status</span><span>Evidence</span></div>
          <div>
            {regulatoryItems.map((item, index) => (
              <div key={item.item} className="grid gap-3 border-b border-[#e8ece7] p-4 last:border-0 md:grid-cols-[36px_1.6fr_.7fr_.55fr_.8fr] md:items-center md:px-5">
                <button aria-label={`Mark ${item.item} complete`} onClick={() => setChecked((current) => current.map((value, i) => i === index ? !value : value))} className={`focus-ring grid size-6 place-items-center rounded-lg border ${checked[index] ? "border-[#4f8b69] bg-[#e3f0e7] text-[#397455]" : "border-[#cfd7d0] bg-white text-transparent"}`}><Check size={13} /></button>
                <p className={`text-[11px] font-semibold leading-5 ${checked[index] ? "text-[#728079] line-through" : "text-[#304d45]"}`}>{item.item}</p>
                <div><span className="mr-2 text-[8px] font-bold uppercase text-[#9aa39e] md:hidden">Authority</span><span className="text-[10px] text-[#6d7c75]">{item.authority}</span></div>
                <StatusBadge status={checked[index] ? "Complete" : item.status} />
                <div className="flex items-center gap-1.5 text-[10px] text-[#78847d]"><FileCheck2 size={13} className="text-[#67857c]" /> {item.evidence}</div>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="p-5"><MiniLabel>Completion</MiniLabel><div className="mt-4 flex items-center gap-4"><div className="relative grid size-20 place-items-center rounded-full" style={{ background: `conic-gradient(#4f8b69 0 ${(complete / regulatoryItems.length) * 100}%, #e6ebe6 ${(complete / regulatoryItems.length) * 100}% 100%)` }}><div className="grid size-[64px] place-items-center rounded-full bg-white text-lg font-bold">{complete}/{regulatoryItems.length}</div></div><div><p className="text-xs font-bold text-[#335149]">Items closed</p><p className="mt-1 text-[9px] leading-4 text-[#7b8780]">Retain the cited evidence with final record documents.</p></div></div></Card>
          <Card className="border-[#ecdccf] bg-[#fbf6f1] p-5"><div className="flex gap-2"><AlertCircle size={16} className="mt-0.5 shrink-0 text-[#aa6542]" /><div><p className="text-xs font-bold text-[#744932]">Not legal advice</p><p className="mt-1 text-[9px] leading-4 text-[#866958]">The owner and licensed design team must confirm current jurisdiction, code edition, and permit applicability.</p></div></div></Card>
        </div>
      </div>
    </>
  );
}

export function BidPackage({ notify }: { notify: (message: string) => void }) {
  return (
    <>
      <SectionHeader eyebrow="Procurement" title="Contractor bid package" description="Organize scope, basis of design, alternates, submittals, and commercial comparisons so contractors price the same project." action={<Button onClick={() => notify("Bid-package draft generated from current local data")}><Download size={14} /> Generate draft</Button>} />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-[#e1e6e0] p-5 sm:p-6"><div className="flex items-center justify-between"><div><MiniLabel>Scope packages</MiniLabel><h2 className="mt-1 text-base font-bold">Bid readiness</h2></div><Badge tone="amber">Issue after verification</Badge></div></div>
          <div className="divide-y divide-[#e7ebe6]">
            {bidScopes.map((scope, index) => (
              <div key={scope.scope} className="grid gap-4 p-5 sm:grid-cols-[42px_1fr_150px] sm:items-center sm:px-6">
                <div className="grid size-10 place-items-center rounded-xl bg-[#e7efeb] text-[10px] font-bold text-[#497166]">0{index + 1}</div>
                <div><h3 className="text-xs font-bold text-[#2d4b43]">{scope.scope}</h3><p className="mt-1 text-[10px] leading-4 text-[#7b8780]">{scope.package}</p><p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-[#5f8178]">Lead: {scope.lead}</p></div>
                <div><div className="mb-2 flex justify-between text-[9px]"><span className="font-bold text-[#6a7770]">Readiness</span><span>{scope.readiness}%</span></div><Meter value={scope.readiness} /></div>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="p-5 sm:p-6"><MiniLabel>Package contents</MiniLabel><div className="mt-4 space-y-3">{["Site facts and route photos", "Trade-specific scope only", "20k and 30k alternates", "Required exclusions and substitutions", "Startup, testing, and closeout", "Labels, valve map, and owner training"].map((item, index) => <div key={item} className="flex items-center gap-3"><span className={`grid size-6 place-items-center rounded-full text-[8px] font-bold ${index < 3 ? "bg-[#e0eee5] text-[#347052]" : "bg-[#eef0ed] text-[#89928d]"}`}>{index < 3 ? <Check size={11} /> : index + 1}</span><span className="text-[10px] font-semibold text-[#52675f]">{item}</span></div>)}</div></Card>
          <Card className="bg-[#173f37] p-5 text-white sm:p-6"><PackageCheck size={20} className="text-[#8fc2b9]" /><h3 className="serif mt-4 text-xl font-semibold">Make price comparisons fair.</h3><p className="mt-2 text-[10px] leading-5 text-[#a8bdb7]">Require every bidder to identify exclusions, lead times, warranty, start date, and proposed substitutions on the same bid form.</p></Card>
        </div>
      </div>
    </>
  );
}

export function ContractorRecommendations({ notify }: { notify: (message: string) => void }) {
  const trades = ["All roles", ...contractorPackages.map((item) => item.trade), "Rainwater design / specialty integrator", "Gutters / collection edge", "Welding / fencing / utility protection"];
  const [selectedTrade, setSelectedTrade] = useState("All roles");
  const [leadMode, setLeadMode] = useState<"seeded" | "loading" | "live" | "error">("seeded");
  const [leadMessage, setLeadMessage] = useState("Source-backed starter recommendations are loaded. Add a review provider key to refresh ratings and review counts live.");
  const [leadProvider, setLeadProvider] = useState("Source-backed list");
  const [leadResults, setLeadResults] = useState<ContractorLead[]>(() => contractorLeadSeeds);
  const visibleLeads = selectedTrade === "All roles" ? leadResults : leadResults.filter((lead) => leadMatchesPackage(lead, selectedTrade) || lead.trade === selectedTrade);
  const displayLeads = visibleLeads.length ? visibleLeads : leadResults;
  const liveLeadCount = leadResults.filter((lead) => lead.liveSource).length;

  const runLiveResearch = async () => {
    if (leadMode === "loading") return;

    const trade = selectedTrade === "All roles" ? "All" : selectedTrade;
    setLeadMode("loading");
    setLeadMessage(`Refreshing ${trade === "All" ? "all contractor recommendations" : trade} around Evant, Lampasas, Hamilton, and Austin as appropriate.`);

    try {
      const response = await fetch(`/api/contractor-research?trade=${encodeURIComponent(trade)}&location=${encodeURIComponent("Evant, TX")}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Contractor recommendation lookup failed");
      const payload = await response.json() as {
        mode?: "seeded" | "live" | "error";
        provider?: string;
        message?: string;
        leads?: ContractorLead[];
      };

      setLeadResults(payload.leads?.length ? payload.leads : contractorLeadSeeds);
      setLeadMode(payload.mode === "live" ? "live" : payload.mode === "error" ? "error" : "seeded");
      setLeadProvider(payload.provider === "google-places" ? "Google Places" : "Source-backed list");
      setLeadMessage(payload.message ?? "Contractor recommendations updated.");
      notify(payload.mode === "live" ? "Live recommendation research loaded" : "Starter recommendations loaded");
    } catch (error) {
      setLeadMode("error");
      setLeadProvider("Source-backed list");
      setLeadResults(contractorLeadSeeds);
      setLeadMessage(error instanceof Error ? error.message : "Live lookup failed. Showing source-backed starter recommendations.");
      notify("Recommendations stayed on the starter list because live lookup could not complete");
    }
  };

  return (
    <>
      <SectionHeader
        eyebrow="Procurement"
        title="Contractor recommendations"
        description="Keep possible people to call separate from the quote scorecard. Use this page to build your call list by role, service area, and fit before asking for formal bids."
        action={<Button onClick={runLiveResearch}><Search size={14} /> {leadMode === "loading" ? "Refreshing" : "Refresh recommendations"}</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UserCheck} label="Recommended leads" value={String(leadResults.length)} note={leadMode === "live" ? `${liveLeadCount} live review leads` : "Starter list loaded"} accent="blue" />
        <StatCard icon={MapPin} label="Local work zone" value="Lampasas" note="Hamilton / Evant / Gatesville too" accent="green" />
        <StatCard icon={TankIcon} label="Tank search zone" value="Austin" note="Dripping Springs / Hill Country" accent="gold" />
        <StatCard icon={Star} label="Review source" value={leadMode === "live" ? "Live" : "Seeded"} note={leadProvider} accent="clay" />
      </div>

      <Card className="mt-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <Filter size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#829089]" />
            <select value={selectedTrade} onChange={(event) => setSelectedTrade(event.target.value)} className="focus-ring h-10 w-full appearance-none rounded-xl border border-[#dde3dc] bg-[#fafbf9] px-9 text-xs font-semibold outline-none">
              {trades.map((trade) => <option key={trade}>{trade}</option>)}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <Badge tone={leadMode === "live" ? "green" : leadMode === "error" ? "red" : leadMode === "loading" ? "amber" : "neutral"}>{leadProvider}</Badge>
            <Badge tone="green">People to call, not scored bids</Badge>
            <Badge tone="blue">Austin specialty + local trades</Badge>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-4 text-[#6c7a73]">{leadMessage}</p>
      </Card>

      <div className="mt-4 grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-[#e1e6e0] p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div><MiniLabel>Subcontractor map</MiniLabel><h2 className="mt-1 text-base font-bold">Who to hire for this build</h2></div>
              <Badge tone="blue">Call-list strategy</Badge>
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:p-6">
            {subcontractorRolePlan.map((role) => (
              <div key={role.role} className="rounded-2xl border border-[#e0e5df] bg-[#fafbf9] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-[#2d4b43]">{role.role}</h3>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#6f8179]">{role.searchArea}</p>
                  </div>
                  <Badge tone="neutral">{role.timing}</Badge>
                </div>
                <p className="mt-3 text-[10px] leading-4 text-[#60716a]">{role.bestFit}</p>
                <div className="mt-3 grid gap-2 lg:grid-cols-2">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#7d8982]">Ask for</p>
                    <p className="mt-1.5 text-[10px] leading-4 text-[#465f57]">{role.askFor}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#7d8982]">Why it matters</p>
                    <p className="mt-1.5 text-[10px] leading-4 text-[#465f57]">{role.why}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-[#e1e6e0] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <MiniLabel>Recommended people</MiniLabel>
                <h2 className="mt-1 text-base font-bold">{selectedTrade === "All roles" ? "All contractor leads" : selectedTrade}</h2>
              </div>
              <Button variant="secondary" onClick={runLiveResearch}><Search size={14} /> {leadMode === "loading" ? "Refreshing" : "Refresh"}</Button>
            </div>
          </div>
          <div className="grid gap-3 p-5 md:grid-cols-2 sm:p-6">
            {displayLeads.map((lead) => (
              <div key={`${lead.company}-${lead.trade}-${lead.area}`} className="rounded-2xl border border-[#dfe5df] bg-[#fafbf9] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#6f8179]">{lead.trade}</p>
                    <h3 className="mt-1.5 text-sm font-bold leading-5 text-[#29473f]">{lead.company}</h3>
                  </div>
                  <Badge tone={leadPriorityTone(lead.priority)}>{lead.priority}</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-[10px] text-[#65746d]">
                  <div className="flex items-center gap-2"><MapPin size={13} className="shrink-0 text-[#537c73]" />{lead.address ?? lead.area}</div>
                  <div className="flex items-center gap-2"><Star size={13} className="shrink-0 text-[#8b6b38]" />{leadReviewLabel(lead)}</div>
                  {lead.phone && <div className="flex items-center gap-2"><PhoneCall size={13} className="shrink-0 text-[#537c73]" />{lead.phone}</div>}
                </div>
                <p className="mt-3 text-[10px] leading-4 text-[#60716a]">{lead.fit}</p>
                <div className="mt-3 rounded-xl border border-[#e3e7e1] bg-white p-3">
                  <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#7d8982]">Next call</p>
                  <p className="mt-1.5 text-[10px] leading-4 text-[#465f57]">{lead.nextAction}</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <Button variant="secondary" onClick={() => notify(`${lead.company} added to your call list for now`)} className="h-9 px-3"><Check size={13} /> Shortlist</Button>
                  {lead.sourceUrl && (
                    <a href={lead.sourceUrl} target="_blank" rel="noreferrer" className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-[10px] font-bold text-[#416d65] hover:bg-[#edf2ee]">
                      {lead.sourceLabel ?? "Source"} <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

export function BidSystem({ notify }: { notify: (message: string) => void }) {
  const trades = ["All packages", ...contractorPackages.map((item) => item.trade)];
  const [selectedTrade, setSelectedTrade] = useState(contractorPackages[0].trade);
  const [rows, setRows] = useState<BidRow[]>(() => initialBidRows);
  const [researchingId, setResearchingId] = useState<number | null>(null);
  const [draft, setDraft] = useState({
    trade: contractorPackages[0].trade,
    company: "",
    price: "",
    contactName: "",
    contactPhone: "",
    scheduleWeeks: "4",
    quoteFileName: "",
    quoteFileSize: 0,
    quoteFileType: "",
    notes: "",
  });
  const visibleRows = rows.filter((row) => selectedTrade === "All packages" || row.trade === selectedTrade);
  const scoredRows = visibleRows
    .map((row) => ({ row, score: quoteScore(row, rows.filter((item) => item.trade === row.trade)) }))
    .sort((a, b) => b.score - a.score);
  const best = scoredRows[0];
  const selectedPackage = contractorPackages.find((item) => item.trade === selectedTrade) ?? contractorPackages[0];
  const selectedPeerPrices = rows.filter((row) => row.trade === selectedPackage.trade).map((row) => row.price);
  const selectedMedian = median(selectedPeerPrices);
  const comparedCount = rows.filter((row) => row.quoteStatus === "Compared").length;
  const uploadedCount = rows.filter((row) => row.quoteFileName).length;
  const needsResearchCount = rows.filter((row) => row.reviewCount === 0).length;

  const updateBid = (id: number, key: string, value: string | number) => {
    setRows((current) => current.map((row) => row.id === id ? { ...row, [key]: value } : row));
  };

  const updateDraft = (key: string, value: string | number) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleQuoteFile = (file?: File) => {
    if (!file) return;
    setDraft((current) => ({
      ...current,
      quoteFileName: file.name,
      quoteFileSize: file.size,
      quoteFileType: file.type || file.name.split(".").pop()?.toUpperCase() || "File",
    }));
  };

  const addBid = () => {
    const company = draft.company.trim();
    const price = Number(draft.price);
    if (!company || !price) {
      notify("Add the contractor name and quote price first");
      return;
    }

    const nextId = rows.length ? Math.max(...rows.map((row) => row.id)) + 1 : 1;
    setRows((current) => [
      ...current,
      {
        id: nextId,
        trade: draft.trade,
        company,
        price,
        rating: 0,
        reviewCount: 0,
        scopeFit: draft.notes ? 66 : 55,
        ruralExperience: /rural|ranch|well|tank|trench|pad|evant|lampasas|hamilton/i.test(draft.notes) ? 78 : 60,
        scheduleWeeks: Number(draft.scheduleWeeks) || 4,
        warranty: 60,
        communication: 70,
        riskControl: /license|licensed|insured|permit|backflow|code|bond/i.test(draft.notes) ? 76 : 62,
        notes: draft.notes || "Quote uploaded/entered. Run review research and normalize exclusions before selecting.",
        contactName: draft.contactName,
        contactPhone: draft.contactPhone,
        quoteFileName: draft.quoteFileName,
        quoteFileSize: draft.quoteFileSize || undefined,
        quoteFileType: draft.quoteFileType,
        quoteStatus: draft.quoteFileName ? "Uploaded" : "Draft",
        quoteDate: new Date().toISOString().slice(0, 10),
      },
    ]);
    setSelectedTrade(draft.trade);
    setDraft({
      trade: draft.trade,
      company: "",
      price: "",
      contactName: "",
      contactPhone: "",
      scheduleWeeks: "4",
      quoteFileName: "",
      quoteFileSize: 0,
      quoteFileType: "",
      notes: "",
    });
    notify(`${company} added to bid comparison`);
  };

  const researchBidder = async (row: BidRow) => {
    if (!row.company || researchingId) return;

    setResearchingId(row.id);
    try {
      const response = await fetch(`/api/contractor-research?trade=${encodeURIComponent(row.trade)}&company=${encodeURIComponent(row.company)}&location=${encodeURIComponent("Evant, TX")}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Bidder research lookup failed");
      const payload = await response.json() as {
        mode?: "seeded" | "live" | "error";
        message?: string;
        leads?: ContractorLead[];
      };
      const lead = payload.leads?.[0];

      if (!lead || payload.mode !== "live") {
        notify(payload.message ?? "Add GOOGLE_PLACES_API_KEY to pull live review ratings for bidders");
        return;
      }

      const ruralFit = /lampasas|hamilton|evant|rural|ranch|trench|well|tank|potable/i.test(`${lead.area} ${lead.fit}`);
      setRows((current) => current.map((item) => item.id === row.id ? {
        ...item,
        rating: lead.rating ?? item.rating,
        reviewCount: lead.reviewCount ?? item.reviewCount,
        ruralExperience: ruralFit ? Math.max(item.ruralExperience, 80) : item.ruralExperience,
        reviewSourceUrl: lead.mapsUrl ?? lead.website ?? lead.sourceUrl,
        quoteStatus: "Compared",
        notes: `${item.notes} Review research: ${leadReviewLabel(lead)}.`,
      } : item));
      notify(`${row.company} review research added`);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Bidder research failed");
    } finally {
      setResearchingId(null);
    }
  };

  return (
    <>
      <SectionHeader
        eyebrow="Procurement"
        title="Upload quotes and compare bids."
        description="Use this page after contractors send real quotes. Add the bidder, attach the quote file, enter the price and key terms, then enrich the row with review research before choosing best value."
        action={<Button onClick={addBid}><Upload size={14} /> Add quote</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileSpreadsheet} label="Submitted quotes" value={String(rows.length)} note={`${uploadedCount} with files attached`} accent="blue" />
        <StatCard icon={Trophy} label="Best current score" value={best ? `${best.score}` : "0"} note={best ? best.row.company : "No bids yet"} accent="green" />
        <StatCard icon={DollarSign} label="Package median" value={selectedMedian ? money(selectedMedian) : "$0"} note={selectedPackage.trade} accent="gold" />
        <StatCard icon={Search} label="Review checks" value={String(comparedCount)} note={`${needsResearchCount} still need research`} accent="clay" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-[#e1e6e0] p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div><MiniLabel>Quote intake</MiniLabel><h2 className="mt-1 text-base font-bold">Add a contractor bid</h2></div>
              <Badge tone={draft.quoteFileName ? "green" : "neutral"}>{draft.quoteFileName ? "File attached" : "Awaiting quote"}</Badge>
            </div>
          </div>
          <div className="grid gap-4 p-5 lg:grid-cols-2 sm:p-6">
            <div className="grid gap-4">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#738079]">Contractor / company</span>
                <input value={draft.company} onChange={(event) => updateDraft("company", event.target.value)} placeholder="Company name from quote" className="focus-ring h-11 w-full rounded-xl border border-[#dce2dc] bg-[#fafbf9] px-3.5 text-sm font-semibold outline-none focus:bg-white" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#738079]">Trade package</span>
                <select value={draft.trade} onChange={(event) => updateDraft("trade", event.target.value)} className="focus-ring h-11 w-full rounded-xl border border-[#dce2dc] bg-[#fafbf9] px-3 text-sm font-semibold outline-none">
                  {contractorPackages.map((item) => <option key={item.trade}>{item.trade}</option>)}
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Quoted price" value={draft.price} type="number" onChange={(value) => updateDraft("price", value)} min={0} suffix="$" />
                <Field label="Schedule" value={draft.scheduleWeeks} type="number" onChange={(value) => updateDraft("scheduleWeeks", value)} min={1} suffix="weeks" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Contact name" value={draft.contactName} onChange={(value) => updateDraft("contactName", value)} />
                <Field label="Phone / email" value={draft.contactPhone} onChange={(value) => updateDraft("contactPhone", value)} />
              </div>
            </div>
            <div className="grid gap-4">
              <label className="focus-within:ring-[#9db8b1] flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#b9c8c1] bg-[#f4f7f3] p-5 text-center ring-0 transition-colors hover:bg-[#eef4ef]">
                <Upload size={22} className="text-[#4d7c73]" />
                <span className="mt-3 text-xs font-bold text-[#29473f]">{draft.quoteFileName || "Upload quote or bid file"}</span>
                <span className="mt-1 text-[10px] text-[#7a8780]">{draft.quoteFileName ? `${fileSizeLabel(draft.quoteFileSize)} · ${draft.quoteFileType || "file"}` : "PDF, Word, image, spreadsheet, CSV, or text"}</span>
                <input type="file" className="sr-only" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.tsv,.png,.jpg,.jpeg,.webp,.txt" onChange={(event) => handleQuoteFile(event.target.files?.[0])} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#738079]">Quote notes / scope clues</span>
                <textarea value={draft.notes} onChange={(event) => updateDraft("notes", event.target.value)} placeholder="Paste inclusions, exclusions, warranty, license notes, or anything important from the quote." className="focus-ring min-h-[120px] w-full resize-y rounded-xl border border-[#dce2dc] bg-[#fafbf9] p-3 text-xs leading-5 outline-none focus:bg-white" />
              </label>
              <Button onClick={addBid} className="w-full"><Plus size={14} /> Add quote to comparison</Button>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><MiniLabel>Compare view</MiniLabel><h2 className="mt-1 text-base font-bold">Actual submitted bids</h2></div><Scale size={18} className="text-[#527b72]" /></div>
          <label className="relative mt-5 block">
            <Filter size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#829089]" />
            <select value={selectedTrade} onChange={(event) => setSelectedTrade(event.target.value)} className="focus-ring h-10 w-full appearance-none rounded-xl border border-[#dde3dc] bg-[#fafbf9] px-9 text-xs font-semibold outline-none">
              {trades.map((trade) => <option key={trade}>{trade}</option>)}
            </select>
          </label>
          <div className="mt-4 grid gap-2">
            <div className="flex gap-2 rounded-xl border border-[#e0e5df] bg-[#fafbf9] p-3 text-[10px] leading-4 text-[#60716a]"><FileText size={13} className="mt-0.5 shrink-0 text-[#4d7c73]" />Upload or enter each contractor quote first. The app compares only actual submitted bids here.</div>
            <div className="flex gap-2 rounded-xl border border-[#e0e5df] bg-[#fafbf9] p-3 text-[10px] leading-4 text-[#60716a]"><Search size={13} className="mt-0.5 shrink-0 text-[#4d7c73]" />Use bidder research on each row to pull live review data when `GOOGLE_PLACES_API_KEY` is configured.</div>
            <div className="flex gap-2 rounded-xl border border-[#e0e5df] bg-[#fafbf9] p-3 text-[10px] leading-4 text-[#60716a]"><Scale size={13} className="mt-0.5 shrink-0 text-[#4d7c73]" />Normalize exclusions before trusting the score. The lowest price only wins if scope and risk controls stay strong.</div>
          </div>
        </Card>
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="border-b border-[#e1e6e0] p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div><MiniLabel>Uploaded bid comparison</MiniLabel><h2 className="mt-1 text-base font-bold">Quote scorecard</h2></div>
            <Button variant="secondary" onClick={() => notify("Quote comparison saved locally for this session")}><Check size={14} /> Save local view</Button>
          </div>
        </div>
        <div className="scrollbar-none overflow-x-auto">
          <div className="min-w-[1460px]">
            <div className="grid grid-cols-[190px_180px_150px_130px_140px_165px_140px_120px_120px_120px_90px] gap-3 border-b border-[#e5e9e4] bg-[#f4f6f3] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#74817a]">
              <span>Company</span><span>Package</span><span>Quote file</span><span>Price</span><span>Scope fit</span><span>Reviews</span><span>Experience</span><span>Schedule</span><span>Warranty</span><span>Risk control</span><span>Score</span>
            </div>
            <div className="divide-y divide-[#e8ece7]">
              {scoredRows.length === 0 && (
                <div className="px-5 py-10 text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#e7efeb] text-[#4d7c73]"><Upload size={19} /></div>
                  <h3 className="mt-4 text-sm font-bold text-[#29473f]">No submitted quotes yet</h3>
                  <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-[#748079]">Upload or enter the first contractor quote above. Once a few bids are in, this table will rank them by price closeness, scope completeness, reviews, relevant experience, schedule, warranty, communication, and risk controls.</p>
                </div>
              )}
              {scoredRows.map(({ row, score }) => {
                const peerRows = rows.filter((item) => item.trade === row.trade);
                const priceScore = Math.round(priceClosenessScore(row.price, peerRows.map((item) => item.price)));
                const reviewScore = Math.round(reviewQualityScore(row.rating, row.reviewCount));
                return (
                  <div key={row.id} className="grid grid-cols-[190px_180px_150px_130px_140px_165px_140px_120px_120px_120px_90px] gap-3 px-5 py-4 text-[10px]">
                    <div>
                      <input value={row.company} onChange={(event) => updateBid(row.id, "company", event.target.value)} className="focus-ring h-9 w-full rounded-xl border border-[#dce2dc] bg-white px-3 font-bold text-[#29473f] outline-none" />
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge tone={row.quoteStatus === "Compared" ? "green" : row.quoteStatus === "Uploaded" ? "blue" : "neutral"}>{row.quoteStatus ?? "Draft"}</Badge>
                        {row.reviewSourceUrl && <a href={row.reviewSourceUrl} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-[#3d766d] hover:underline">Review source</a>}
                      </div>
                    </div>
                    <select value={row.trade} onChange={(event) => updateBid(row.id, "trade", event.target.value)} className="focus-ring h-9 rounded-xl border border-[#dce2dc] bg-white px-2 font-semibold outline-none">
                      {contractorPackages.map((item) => <option key={item.trade}>{item.trade}</option>)}
                    </select>
                    <div>
                      <div className="min-h-9 rounded-xl border border-[#dce2dc] bg-[#fafbf9] px-3 py-2">
                        <p className="truncate font-bold text-[#29473f]">{row.quoteFileName || "No file attached"}</p>
                        <p className="mt-1 text-[8px] text-[#7e8983]">{row.quoteFileName ? `${fileSizeLabel(row.quoteFileSize)} · ${row.quoteDate ?? "added"}` : "Entered manually"}</p>
                      </div>
                    </div>
                    <div>
                      <input type="number" value={row.price} min={0} onChange={(event) => updateBid(row.id, "price", Number(event.target.value))} className="focus-ring h-9 w-full rounded-xl border border-[#dce2dc] bg-white px-2 font-bold outline-none" />
                      <p className="mt-1 text-[8px] text-[#7e8983]">Cluster {priceScore}/100</p>
                    </div>
                    <div>
                      <input type="range" value={row.scopeFit} min={0} max={100} onChange={(event) => updateBid(row.id, "scopeFit", Number(event.target.value))} className="w-full accent-[#4e8b7a]" />
                      <p className="mt-1 font-bold text-[#355249]">{row.scopeFit}/100</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" value={row.rating} min={0} max={5} step={0.1} onChange={(event) => updateBid(row.id, "rating", Number(event.target.value))} className="focus-ring h-9 rounded-xl border border-[#dce2dc] bg-white px-2 font-bold outline-none" />
                      <input type="number" value={row.reviewCount} min={0} onChange={(event) => updateBid(row.id, "reviewCount", Number(event.target.value))} className="focus-ring h-9 rounded-xl border border-[#dce2dc] bg-white px-2 font-bold outline-none" />
                      <p className="col-span-2 text-[8px] text-[#7e8983]">Review score {reviewScore}/100</p>
                      <button onClick={() => researchBidder(row)} className="focus-ring col-span-2 inline-flex h-7 items-center justify-center gap-1 rounded-lg border border-[#d8dfd8] bg-white text-[9px] font-bold text-[#416d65] hover:bg-[#f8faf8]">
                        <Search size={11} /> {researchingId === row.id ? "Researching" : "Research bidder"}
                      </button>
                    </div>
                    <div>
                      <input type="range" value={row.ruralExperience} min={0} max={100} onChange={(event) => updateBid(row.id, "ruralExperience", Number(event.target.value))} className="w-full accent-[#4e8b7a]" />
                      <p className="mt-1 font-bold text-[#355249]">{row.ruralExperience}/100</p>
                    </div>
                    <div>
                      <input type="number" value={row.scheduleWeeks} min={1} onChange={(event) => updateBid(row.id, "scheduleWeeks", Number(event.target.value))} className="focus-ring h-9 w-full rounded-xl border border-[#dce2dc] bg-white px-2 font-bold outline-none" />
                      <p className="mt-1 text-[8px] text-[#7e8983]">weeks</p>
                    </div>
                    <div>
                      <input type="range" value={row.warranty} min={0} max={100} onChange={(event) => updateBid(row.id, "warranty", Number(event.target.value))} className="w-full accent-[#4e8b7a]" />
                      <p className="mt-1 font-bold text-[#355249]">{row.warranty}/100</p>
                    </div>
                    <div>
                      <input type="range" value={row.riskControl} min={0} max={100} onChange={(event) => updateBid(row.id, "riskControl", Number(event.target.value))} className="w-full accent-[#4e8b7a]" />
                      <p className="mt-1 font-bold text-[#355249]">{row.riskControl}/100</p>
                    </div>
                    <div>
                      <div className={`grid size-12 place-items-center rounded-2xl text-sm font-extrabold ${score >= 82 ? "bg-[#e0eee5] text-[#2e6d50]" : score >= 70 ? "bg-[#f4ead2] text-[#876222]" : "bg-[#f4ded7] text-[#9a4a35]"}`}>{score}</div>
                    </div>
                    <div className="col-span-11">
                      <input value={row.notes} onChange={(event) => updateBid(row.id, "notes", event.target.value)} className="focus-ring h-8 w-full rounded-lg border border-[#e0e5df] bg-[#fafbf9] px-2 text-[9px] outline-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 xl:grid-cols-[.85fr_1.15fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><MiniLabel>Scoring model</MiniLabel><h2 className="mt-1 text-base font-bold">Weighted factors</h2></div><Scale size={18} className="text-[#527b72]" /></div>
          <div className="mt-5 space-y-3">
            {bidWeights.map((weight) => (
              <div key={weight.key}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold text-[#3b554e]">{weight.label}</span>
                  <span className="text-[9px] font-bold text-[#8b6b4b]">{weight.weight}%</span>
                </div>
                <Meter value={weight.weight * 5} color={weight.key === "priceCloseness" ? "bg-[#a66a47]" : "bg-[#4e8b7a]"} />
                <p className="mt-1 text-[9px] leading-4 text-[#7a857e]">{weight.help}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-[#e1e6e0] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div><MiniLabel>Package builder</MiniLabel><h2 className="mt-1 text-base font-bold">{selectedPackage.trade}</h2></div>
              <Badge tone="blue">{selectedPackage.lead}</Badge>
            </div>
          </div>
          <div className="grid gap-4 p-5 lg:grid-cols-2 sm:p-6">
            <div>
              <div className="rounded-2xl border border-[#e0e5df] bg-[#fafbf9] p-4">
                <div className="flex items-center gap-2"><Send size={15} className="text-[#4d7c73]" /><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6f8179]">Call / email script</p></div>
                <p className="mt-3 text-[11px] leading-5 text-[#405850]">{selectedPackage.script}</p>
              </div>
              <div className="mt-4 rounded-2xl border border-[#e0e5df] p-4">
                <MiniLabel>Must include</MiniLabel>
                <div className="mt-3 grid gap-2">
                  {selectedPackage.mustInclude.map((item) => <div key={item} className="flex gap-2 text-[10px] leading-4 text-[#60716a]"><CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#4f8b6d]" />{item}</div>)}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#e0e5df] p-4">
                <MiniLabel>Questions to ask</MiniLabel>
                <div className="mt-3 grid gap-2">
                  {selectedPackage.questions.map((item) => <div key={item} className="flex gap-2 text-[10px] leading-4 text-[#60716a]"><PhoneCall size={13} className="mt-0.5 shrink-0 text-[#4d7c73]" />{item}</div>)}
                </div>
              </div>
              <div className="rounded-2xl border border-[#ead6cb] bg-[#fbf6f1] p-4">
                <MiniLabel>Red flags</MiniLabel>
                <div className="mt-3 grid gap-2">
                  {selectedPackage.redFlags.map((item) => <div key={item} className="flex gap-2 text-[10px] leading-4 text-[#765540]"><TriangleAlert size={13} className="mt-0.5 shrink-0 text-[#aa6542]" />{item}</div>)}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><MiniLabel>Review research</MiniLabel><h2 className="mt-1 text-base font-bold">Quality checks</h2></div><Star size={18} className="text-[#8b6b38]" /></div>
          <div className="mt-4 grid gap-2">
            {reviewResearchChecks.map((item) => <div key={item} className="flex gap-2 rounded-xl border border-[#e0e5df] bg-[#fafbf9] p-3 text-[10px] leading-4 text-[#60716a]"><UserCheck size={13} className="mt-0.5 shrink-0 text-[#4d7c73]" />{item}</div>)}
          </div>
        </Card>
        <Card className="bg-[#173f37] p-5 text-white sm:p-6">
          <ListChecks size={20} className="text-[#8fc2b9]" />
          <h3 className="serif mt-4 text-xl font-semibold">Decision rule</h3>
          <p className="mt-2 text-[11px] leading-5 text-[#a8bdb7]">Prefer the highest complete-score contractor after exclusions are normalized. A low price should only win if the written scope, review quality, licensing, warranty, and risk controls stay strong.</p>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[["80+", "Strong"], ["70-79", "Check"], ["<70", "Risk"]].map(([score, label]) => <div key={score} className="rounded-xl border border-white/10 bg-white/6 p-3"><p className="text-base font-bold">{score}</p><p className="mt-1 text-[8px] uppercase tracking-wider text-[#9bb9b2]">{label}</p></div>)}
          </div>
        </Card>
      </div>
    </>
  );
}

export function DocumentLibrary({ notify }: { notify: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = documents.filter((document) => `${document.title} ${document.category}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <SectionHeader eyebrow="Project records" title="Document library" description="A structured home for existing conditions, design inputs, decisions, bids, submittals, permits, and final record documents." action={<Button onClick={() => notify("Upload placeholder opened; storage integration is the next step")}><Upload size={14} /> Upload document</Button>} />
      <Card className="mb-4 p-3 sm:p-4"><label className="relative block"><Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#829089]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search document names or categories" className="focus-ring h-10 w-full rounded-xl border border-[#dde3dc] bg-[#fafbf9] pr-3 pl-9 text-xs outline-none" /></label></Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((document, index) => (
          <Card key={document.title} className="group p-5 transition-transform hover:-translate-y-0.5">
            <div className="flex items-start justify-between"><div className={`grid size-11 place-items-center rounded-2xl ${index % 3 === 0 ? "bg-[#e1edee] text-[#39737a]" : index % 3 === 1 ? "bg-[#efe9dc] text-[#8b6c38]" : "bg-[#e5eee8] text-[#3e745b]"}`}>{document.state === "Placeholder" ? <FileClock size={19} /> : <FileText size={19} />}</div><StatusBadge status={document.state} /></div>
            <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#73877f]">{document.category}</p>
            <h3 className="mt-1.5 text-sm font-bold text-[#2a4941]">{document.title}</h3>
            <div className="mt-5 flex items-center justify-between border-t border-[#e7ebe7] pt-3"><span className="text-[9px] text-[#849089]">{document.meta}</span><button className="focus-ring rounded-lg p-1.5 text-[#55746c] hover:bg-[#edf2ee]" aria-label={`Open ${document.title}`}><ArrowUpRight size={14} /></button></div>
          </Card>
        ))}
        <button onClick={() => notify("Create-folder workflow is ready for storage integration")} className="focus-ring min-h-[185px] rounded-[22px] border border-dashed border-[#cbd5cd] bg-[#f5f7f4] p-5 text-center hover:border-[#83a69c] hover:bg-[#f0f5f2]"><span className="mx-auto grid size-10 place-items-center rounded-full bg-white text-[#52796f] shadow-sm"><Plus size={17} /></span><p className="mt-3 text-xs font-bold text-[#52675f]">Create project folder</p><p className="mt-1 text-[9px] text-[#8b958f]">Organize a new record category</p></button>
      </div>
    </>
  );
}

export function RanchScalePlan() {
  const sources = [
    { label: "Metal roof", sub: "5,000+ sq ft catchment", icon: CloudRain, color: "bg-[#dcecee] text-[#36737a]" },
    { label: "Existing well", sub: "Trinity Aquifer backup", icon: Gauge, color: "bg-[#eee8dc] text-[#886a38]" },
    { label: "Pond overflow", sub: "Tank overflow route only", icon: Waves, color: "bg-[#efe4dc] text-[#9b5f3c]" },
  ];
  return (
    <>
      <SectionHeader eyebrow="Integrated concept" title="Source plan" description="The working source-to-house architecture: collect clean roof water, store it north of the house, pump it back, and select rainwater or well water outside." action={<PageAction label="Print concept plan" />} />
      <Card className="relative overflow-hidden p-5 sm:p-6 lg:p-8">
        <div className="paper-grid absolute inset-0 opacity-65" />
        <div className="relative">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><MiniLabel>System architecture</MiniLabel><h2 className="serif mt-1 text-2xl font-semibold text-[#23463d]">Roof to storage to selector to treatment to house</h2></div><Badge tone="blue">Concept · Jun 23</Badge></div>
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_40px_1fr_40px_1fr] lg:items-center">
            <div className="space-y-3">
              {sources.map((source) => { const Icon = source.icon; return <div key={source.label} className="flex items-center gap-3 rounded-2xl border border-[#dce3dc] bg-white p-3.5 shadow-sm"><div className={`grid size-10 place-items-center rounded-xl ${source.color}`}><Icon size={18} /></div><div><p className="text-xs font-bold text-[#2d4a42]">{source.label}</p><p className="mt-0.5 text-[9px] text-[#7c8781]">{source.sub}</p></div></div>; })}
            </div>
            <div className="hidden justify-center lg:flex"><ArrowRight className="text-[#79968f]" /></div>
            <div className="rounded-[24px] border-2 border-[#6e958a] bg-[#173f37] p-5 text-white shadow-[0_16px_35px_rgba(23,63,55,.14)]">
              <div className="flex items-start justify-between"><TankIcon size={23} className="text-[#91c1b8]" /><Badge tone="blue">Rainwater hub</Badge></div><h3 className="serif mt-7 text-2xl font-semibold">20k / 30k metal tank</h3><p className="mt-2 text-[10px] leading-5 text-[#a5bbb5]">Above-ground potable tank north of the house with screened overflow, floating intake, pump, pressure tank, and low-water cutoff.</p><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/7 p-3"><p className="text-[8px] uppercase text-[#8ca8a1]">Estimated yield</p><p className="mt-1 text-xs font-bold">~72-86k / yr</p></div><div className="rounded-xl bg-white/7 p-3"><p className="text-[8px] uppercase text-[#8ca8a1]">Selection</p><p className="mt-1 text-xs font-bold">20k vs 30k</p></div></div>
            </div>
            <div className="hidden justify-center lg:flex"><ArrowRight className="text-[#79968f]" /></div>
            <div className="space-y-3">
              {[{ label: "Source selector", sub: "RAIN / WELL / TO HOUSE", icon: Network }, { label: "House treatment", sub: "Carbon + Class A UV", icon: SprayCan }, { label: "Kitchen RO", sub: "Final drinking-water polish", icon: Droplets }, { label: "Future backup", sub: "Generator or solar readiness", icon: Zap }].map((use) => { const Icon = use.icon; return <div key={use.label} className="flex items-center gap-3 rounded-2xl border border-[#dce3dc] bg-white p-3.5 shadow-sm"><div className="grid size-10 place-items-center rounded-xl bg-[#e4eee8] text-[#3e725b]"><Icon size={18} /></div><div><p className="text-xs font-bold text-[#2d4a42]">{use.label}</p><p className="mt-0.5 text-[9px] text-[#7c8781]">{use.sub}</p></div></div>; })}
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[{ title: "Normal operation", icon: Power, note: "Use rainwater as primary when available; switch to well when tank is low, offline, or under maintenance." }, { title: "Drought operation", icon: Sun, note: "Preserve the well by using stored rainwater carefully, then switch to well backup as tank level falls." }, { title: "Outage operation", icon: Zap, note: "Grid power is primary; leave space for generator or solar backup instead of forcing it into phase one." }].map((mode) => { const Icon = mode.icon; return <Card key={mode.title} className="p-5"><div className="grid size-9 place-items-center rounded-xl bg-[#e6eeea] text-[#477267]"><Icon size={16} /></div><h3 className="mt-4 text-sm font-bold text-[#2c4942]">{mode.title}</h3><p className="mt-2 text-[10px] leading-5 text-[#758079]">{mode.note}</p></Card>; })}
      </div>
    </>
  );
}

export function RiskRegister({ notify }: { notify: (message: string) => void }) {
  const [filter, setFilter] = useState("All risks");
  const visible = risks.filter((risk) => filter === "All risks" || risk.impact === filter);
  return (
    <>
      <SectionHeader eyebrow="Project controls" title="Risk register" description="Make uncertainty explicit, assign responses, and focus design effort where likelihood and consequence can move the project most." action={<Button onClick={() => notify("New-risk workflow is ready for database integration")}><Plus size={14} /> Add risk</Button>} />
      <div className="grid gap-4 lg:grid-cols-[1fr_270px]">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-[#e1e5e0] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div><MiniLabel>Active risks</MiniLabel><h2 className="mt-1 text-base font-bold">Design & delivery exposure</h2></div><select value={filter} onChange={(event) => setFilter(event.target.value)} className="focus-ring h-9 rounded-xl border border-[#dae1da] bg-[#fafbf9] px-3 text-[10px] font-bold outline-none"><option>All risks</option><option>Critical</option><option>High</option><option>Medium</option></select></div>
          <div className="divide-y divide-[#e8ece7]">
            {visible.map((risk) => (
              <div key={risk.risk} className="grid gap-3 p-4 sm:grid-cols-[40px_1fr_auto] sm:items-start sm:p-5">
                <div className={`grid size-9 place-items-center rounded-xl text-xs font-extrabold ${risk.score >= 12 ? "bg-[#f3ded7] text-[#a24e39]" : risk.score >= 8 ? "bg-[#f5e9d2] text-[#8f651f]" : "bg-[#e5eee8] text-[#3e7458]"}`}>{risk.score}</div>
                <div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold text-[#2c4942]">{risk.risk}</p><Badge tone={risk.impact === "Critical" ? "red" : risk.impact === "High" ? "amber" : "neutral"}>{risk.likelihood} / {risk.impact}</Badge></div><p className="mt-2 text-[10px] leading-4 text-[#748079]"><span className="font-bold text-[#566b63]">Response:</span> {risk.response}</p></div>
                <div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-full bg-[#e8eeea] text-[8px] font-bold text-[#557068]">{risk.owner.slice(0, 2).toUpperCase()}</span><span className="text-[9px] font-bold text-[#819088]">{risk.owner}</span></div>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="p-5"><MiniLabel>Risk profile</MiniLabel><div className="mt-4 grid grid-cols-3 gap-2 text-center">{[["High", 3, "bg-[#f2dfd8] text-[#9b4e39]"], ["Medium", 2, "bg-[#f2e8d5] text-[#8a651f]"], ["Low", 0, "bg-[#e3eee7] text-[#3a7054]"]].map(([label, value, color]) => <div key={String(label)} className={`rounded-xl p-3 ${color}`}><p className="text-xl font-bold">{value}</p><p className="mt-1 text-[8px] font-bold uppercase tracking-wider">{label}</p></div>)}</div></Card>
          <Card className="p-5"><MiniLabel>Control rhythm</MiniLabel><h3 className="mt-3 text-sm font-bold">Review every two weeks</h3><p className="mt-2 text-[10px] leading-5 text-[#748079]">Update scores after field data, design decisions, bid returns, and site discoveries.</p><Button variant="secondary" className="mt-4 w-full" onClick={() => notify("Risk review reminder set for the local plan")}>Schedule review</Button></Card>
        </div>
      </div>
    </>
  );
}

export function MaintenancePlan() {
  const [done, setDone] = useState<boolean[]>(maintenance.map(() => false));
  const eventTriggered = maintenance.filter((item) => item.next === "After storm").length;
  return (
    <>
      <SectionHeader eyebrow="Operations" title="Maintenance plan" description="Turn a resilient design into a reliable system with clear inspection, cleaning, testing, replacement, and recordkeeping routines." action={<PageAction label="Print seasonal checklist" />} />
      <div className="grid gap-3 sm:grid-cols-3"><StatCard icon={Wrench} label="Recurring tasks" value={String(maintenance.length)} note="Pre-commissioning template" accent="green" /><StatCard icon={FileClock} label="Event-triggered" value={String(eventTriggered)} note="Activates after construction" accent="gold" /><StatCard icon={CheckCircle2} label="Completed now" value={String(done.filter(Boolean).length)} note="Local session checklist" accent="blue" /></div>
      <Card className="mt-4 overflow-hidden">
        <div className="hidden grid-cols-[40px_1.4fr_.8fr_.55fr_.55fr] gap-3 border-b border-[#dfe5df] bg-[#f4f6f3] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#74817a] md:grid"><span /><span>Maintenance task</span><span>Cadence</span><span>System</span><span>Next due</span></div>
        {maintenance.map((item, index) => (
          <div key={item.task} className="grid gap-3 border-b border-[#e8ece7] p-4 last:border-0 md:grid-cols-[40px_1.4fr_.8fr_.55fr_.55fr] md:items-center md:px-5">
            <button onClick={() => setDone((current) => current.map((value, i) => i === index ? !value : value))} aria-label={`Mark ${item.task} complete`} className={`focus-ring grid size-7 place-items-center rounded-lg border ${done[index] ? "border-[#4e8b68] bg-[#e2efe6] text-[#367152]" : "border-[#cfd7d0] bg-white text-transparent"}`}><Check size={13} /></button>
            <p className={`text-[11px] font-semibold ${done[index] ? "text-[#839089] line-through" : "text-[#304d45]"}`}>{item.task}</p>
            <p className="text-[10px] text-[#6e7b75]">{item.cadence}</p><Badge tone={item.system === "Treatment" ? "blue" : item.system === "Storage" ? "green" : "neutral"}>{item.system}</Badge><p className="text-[10px] font-bold text-[#7c6a56]">{item.next}</p>
          </div>
        ))}
      </Card>
      <Card className="mt-4 border-[#d8e4de] bg-[#f0f6f2] p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><HardHat size={18} className="mt-0.5 shrink-0 text-[#417667]" /><div><p className="text-xs font-bold text-[#2c5348]">Commissioning handoff requirement</p><p className="mt-1 text-[10px] leading-5 text-[#65766e]">Require asset labels, valve map, warranty log, spare-parts list, setpoints, and owner training before final payment.</p></div></div><Badge tone="green">Include in bid package</Badge></div></Card>
    </>
  );
}

export function ExecutiveSummary({ notify }: { notify: (message: string) => void }) {
  const decisions = [
    { decision: "Use whole-house potable rainwater with well backup", state: "Decided", impact: "Sets treatment, tank, and source-selector scope" },
    { decision: "Select final storage size: 20k practical or 30k long-term", state: "Pending quotes", impact: "Drives pad, visual impact, and budget" },
    { decision: "Place manual source-selector valve box outside before house entry", state: "Preferred", impact: "Avoids slab/interior closet complexity" },
    { decision: "Size carbon and Class A UV after water testing and flow confirmation", state: "Pending lab", impact: "Protects potable use and annual testing plan" },
  ];
  return (
    <>
      <SectionHeader eyebrow="Owner brief" title="Executive summary" description="The current decision-ready view of project purpose, preferred concept, cost and schedule posture, open decisions, and immediate next actions." action={<Button onClick={() => notify("Executive-summary print view prepared")}><Printer size={14} /> Print summary</Button>} />
      <Card className="overflow-hidden">
        <div className="relative bg-[#173f37] p-6 text-white sm:p-8 lg:p-10"><div className="paper-grid absolute inset-0 opacity-20" /><div className="relative grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-end"><div><Badge tone="blue">Planning target · Jun 23</Badge><h2 className="serif mt-5 max-w-3xl text-[32px] leading-[1.08] font-semibold tracking-[-0.025em] sm:text-[42px]">Build a manually controlled whole-house rainwater system that helps preserve the Trinity Aquifer well.</h2><p className="mt-5 max-w-2xl text-[12px] leading-6 text-[#b1c4bf]">Collect from all eight downspouts, store in a 20,000-30,000 gallon above-ground metal potable tank, pump back to the house, and choose rainwater or well water through an exterior source-selector box.</p></div><div className="grid grid-cols-2 gap-3">{[["Capture", "5k+ roof"], ["Storage", "20 / 30k"], ["Tie-in", "Manual"], ["Phase", "Site visit"]].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-[8px] font-bold uppercase tracking-wider text-[#92aba5]">{label}</p><p className="mt-2 text-base font-bold">{value}</p></div>)}</div></div></div>
        <div className="grid lg:grid-cols-[1.25fr_.75fr]">
          <div className="border-b border-[#e1e6e0] p-5 sm:p-7 lg:border-r lg:border-b-0"><MiniLabel>Recommendation</MiniLabel><h3 className="serif mt-3 text-2xl leading-tight font-semibold text-[#23463d]">Move from handoff to site verification and contractor pricing.</h3><p className="mt-3 text-xs leading-6 text-[#6c7a73]">Photograph the eight downspouts, verify grades to the tank site, locate the well line entry, flag both tank footprints, read the well pressure setting, and send trade-specific scopes to separate contractors.</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{[{ icon: MapPin, title: "Verify", note: "Downspouts, grades, tie-in" }, { icon: PencilLine, title: "Scope", note: "Five trade packages" }, { icon: BarChart3, title: "Price", note: "20k and 30k options" }].map((item) => { const Icon = item.icon; return <div key={item.title} className="rounded-2xl border border-[#e0e5df] p-4"><Icon size={17} className="text-[#4a796e]" /><p className="mt-3 text-xs font-bold">{item.title}</p><p className="mt-1 text-[9px] leading-4 text-[#7d8882]">{item.note}</p></div>; })}</div></div>
          <div className="p-5 sm:p-7"><MiniLabel>Schedule posture</MiniLabel><div className="mt-5 space-y-5">{[["Site visit", "Now", 55], ["Quote requests", "Week 1", 35], ["Design detail", "Weeks 2-3", 15], ["Construction", "After award", 0]].map(([label, date, value], index) => <div key={String(label)}><div className="mb-2 flex items-center justify-between"><div className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-[#e8eee9] text-[8px] font-bold text-[#507167]">{index + 1}</span><span className="text-[10px] font-bold text-[#4a6058]">{label}</span></div><span className="text-[9px] text-[#89938d]">{date}</span></div><Meter value={Number(value)} color={Number(value) > 0 ? "bg-[#568b7c]" : "bg-[#bcc6bf]"} /></div>)}</div></div>
        </div>
      </Card>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_310px]">
        <Card className="overflow-hidden"><div className="border-b border-[#e2e6e1] p-5"><MiniLabel>Decision log</MiniLabel><h2 className="mt-1 text-base font-bold">Owner decisions required</h2></div><div className="divide-y divide-[#e7ebe6]">{decisions.map((decision) => <div key={decision.decision} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-5"><div><p className="text-[11px] font-bold text-[#304e45]">{decision.decision}</p><p className="mt-1 text-[9px] text-[#7f8a84]">{decision.impact}</p></div><Badge tone={decision.state === "Decided" || decision.state === "Preferred" ? "green" : decision.state === "Pending lab" || decision.state === "Pending quotes" ? "amber" : "blue"}>{decision.state}</Badge></div>)}</div></Card>
        <Card className="p-5"><MiniLabel>Budget frame</MiniLabel><p className="mt-3 text-[10px] leading-5 text-[#748079]">A defensible project cost cannot be set until tank civil work, run lengths, electrical service, and treatment drivers are confirmed.</p><div className="mt-5 rounded-2xl bg-[#f3eee4] p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-[#896f47]">Current classification</p><p className="mt-2 text-lg font-bold text-[#59472e]">Class 4 estimate</p><p className="mt-1 text-[9px] leading-4 text-[#87775f]">Concept-level range; expected accuracy remains broad.</p></div><div className="mt-4 flex items-center gap-2 text-[9px] text-[#6b7a73]"><TrendingUp size={13} className="text-[#4f806f]" /> Next cost gate: 30% design + site data</div></Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-5"><MiniLabel>Decided design basis</MiniLabel><div className="mt-4 grid gap-2">{designDecisions.slice(0, 5).map((item) => <div key={item} className="flex gap-2 text-[10px] leading-4 text-[#68766f]"><CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#4f8b6d]" />{item}</div>)}</div></Card>
        <Card className="p-5"><MiniLabel>Open questions</MiniLabel><div className="mt-4 grid gap-2">{openQuestions.slice(0, 5).map((item) => <div key={item} className="flex gap-2 text-[10px] leading-4 text-[#68766f]"><AlertCircle size={13} className="mt-0.5 shrink-0 text-[#a96842]" />{item}</div>)}</div></Card>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CloudRain,
  Construction,
  Database as TankIcon,
  Download,
  Droplet,
  Droplets,
  FileCheck2,
  FileClock,
  FilePlus2,
  FileText,
  Filter,
  Gauge,
  HardHat,
  Info,
  Leaf,
  MapPin,
  Network,
  PackageCheck,
  PanelTop,
  PencilLine,
  Plus,
  Power,
  Printer,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SprayCan,
  Sun,
  TestTube2,
  TrendingUp,
  Upload,
  Waves,
  Wrench,
  Zap,
} from "lucide-react";
import type { PageKey } from "./ranch-water-app";
import { bidScopes, documents, intakeSections, maintenance, regulatoryItems, risks, tasks as seedTasks, type Status, type Task } from "@/lib/data";
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

export function Dashboard({ navigate }: { navigate: (page: PageKey) => void }) {
  const progress = 10;
  const actionItems = [
    { title: "Confirm county and parcel", note: "Sets regulatory pathway", owner: "BP", due: "Week 1", tone: "bg-[#b86743]" },
    { title: "Measure roof and pipe route", note: "Replaces catchment estimate", owner: "BP", due: "Week 2", tone: "bg-[#3d7a78]" },
    { title: "Request well records and test", note: "Defines reliable source capacity", owner: "WP", due: "Weeks 1–3", tone: "bg-[#8c7541]" },
  ];

  return (
    <>
      <SectionHeader
        eyebrow="Project command center"
        title="Water resilience, made buildable."
        description="A single operating picture for capture, storage, source investigation, treatment, distribution, and delivery across Evant Ranch."
        action={<Button onClick={() => navigate("intake")}><ClipboardCheck size={15} /> Continue intake</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Droplets} label="Storage study" value="20k / 30k / 50k" note="Scenarios · no selection yet" accent="blue" />
        <StatCard icon={CloudRain} label="Annual capture" value="43–52k gal" note="~3,000 sq ft roof estimate" accent="green" />
        <StatCard icon={CheckCircle2} label="Tasks complete" value="1 / 10" note="Discovery plan underway" accent="gold" />
        <StatCard icon={ShieldCheck} label="Open decisions" value="7" note="3 affect critical path" accent="clay" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_.85fr]">
        <Card className="relative min-h-[335px] overflow-hidden bg-[#173f37] text-white">
          <div className="paper-grid absolute inset-0 opacity-25" />
          <div className="absolute -top-28 -right-28 size-72 rounded-full border border-white/7" />
          <div className="absolute -top-16 -right-16 size-44 rounded-full border border-white/8" />
          <div className="relative flex h-full flex-col p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge tone="blue">Concept design</Badge>
                <h2 className="serif mt-4 max-w-lg text-[28px] leading-[1.08] font-semibold tracking-[-0.02em] sm:text-[34px]">One ranch. Three sources. A resilient water loop.</h2>
              </div>
              <div className="hidden rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-right sm:block">
                <p className="text-[9px] uppercase tracking-[0.15em] text-[#9ebbb4]">Last reviewed</p>
                <p className="mt-1 text-xs font-bold">June 21, 2026</p>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="flex min-w-[620px] items-center gap-2 overflow-hidden sm:min-w-0">
                {[
                  [CloudRain, "Rainfall", "~3k sq ft roof"],
                  [Gauge, "Well", "Yield TBD"],
                  [TankIcon, "Storage", "20k / 30k / 50k"],
                  [SprayCan, "Treatment", "Use decision TBD"],
                  [Network, "Distribution", "Routes TBD"],
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
            <Badge tone="amber">2 dependencies</Badge>
          </div>
          <div className="mt-5 space-y-4">
            {[
              ["Capture & conveyance", 20, "Roof and route need measurement"],
              ["Storage & civil", 10, "Awaiting demand + site data"],
              ["Pumping & distribution", 5, "Elevations and uses are TBD"],
              ["Treatment & controls", 5, "Use decision + lab data needed"],
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

  const updateValue = (sectionIndex: number, fieldIndex: number, value: string) => {
    setValues((current) => current.map((section, sIndex) => sIndex === sectionIndex ? section.map((field, fIndex) => fIndex === fieldIndex ? value : field) : section));
  };

  return (
    <>
      <SectionHeader
        eyebrow="01 · Define the problem"
        title="Intake questions"
        description="Turn ranch knowledge into an agreed design basis. Values are seeded working assumptions until each section is confirmed."
        action={<Button onClick={() => notify("Intake answers saved locally")}>Save answers <Check size={14} /></Button>}
      />

      <Card className="mb-4 overflow-hidden">
        <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2"><Badge tone="amber">Working basis</Badge><span className="text-[10px] text-[#8a938d]">0 of 4 sections confirmed</span></div>
            <h2 className="mt-3 text-lg font-bold text-[#24433b]">Complete the unknowns before design freeze.</h2>
            <p className="mt-1 text-xs leading-5 text-[#748078]">Demand, elevation, water quality, and well yield are the four inputs with the greatest downstream impact.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative grid size-16 place-items-center rounded-full" style={{ background: "conic-gradient(#4f8b7a 0 0%, #e5e9e4 0% 100%)" }}>
              <div className="grid size-[52px] place-items-center rounded-full bg-white text-sm font-bold text-[#34564e]">0%</div>
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
          <div className="flex gap-3"><Info size={18} className="mt-0.5 shrink-0 text-[#397467]" /><div><p className="text-xs font-bold text-[#275248]">Recommended next decision</p><p className="mt-1 text-xs leading-5 text-[#60736b]">Confirm the project mission and whether any rainwater will enter household plumbing before storage and treatment are selected.</p></div></div>
          <Button variant="secondary" onClick={() => notify("Decision note added to the local plan")}>Add decision note</Button>
        </div>
      </Card>
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
  const [roofArea, setRoofArea] = useState(3000);
  const [rainfall, setRainfall] = useState(30.7);
  const [efficiency, setEfficiency] = useState(85);
  const [dailyDemand, setDailyDemand] = useState(100);
  const [firstFlush, setFirstFlush] = useState(0.02);
  const annualCapture = roofArea * rainfall * 0.623 * (efficiency / 100);
  const oneInchCapture = roofArea * 0.623 * (efficiency / 100);
  const daysCovered = annualCapture / dailyDemand;
  const diverterVolume = roofArea * firstFlush * 0.623;
  const maxMonth = Math.max(...monthlyRain);

  return (
    <>
      <SectionHeader eyebrow="Design tools" title="Rainwater calculators" description="Fast, transparent sizing tools for capture yield, first-flush diversion, and the relationship between rainfall and ranch demand." action={<PageAction label="Method notes" />} />

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
            <div className="flex gap-2"><Info size={15} className="mt-0.5 shrink-0 text-[#4e7e72]" /><p className="text-[10px] leading-5 text-[#66756e]">Yield uses 0.623 gallons per square foot per inch of rain. Collection efficiency accounts for splash, wind, conveyance, and diversion losses.</p></div>
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><MiniLabel>Seasonality</MiniLabel><h2 className="mt-1 text-base font-bold">Monthly capture potential</h2></div><p className="text-[10px] text-[#7c8881]">Illustrative distribution normalized to 30.7 in/yr · replace with station data</p></div>
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
  const [dailyDemand, setDailyDemand] = useState(100);
  const [autonomy, setAutonomy] = useState(30);
  const [reserve, setReserve] = useState(25);
  const usableRequired = dailyDemand * autonomy;
  const nominalRequired = usableRequired / (1 - reserve / 100);
  const options = [
    { label: "Practical backup", total: 20000, config: "Tank arrangement TBD", fit: "Scenario A", note: "Lower-cost starting point for modest verified demand" },
    { label: "Serious backup", total: 30000, config: "Tank arrangement TBD", fit: "Scenario B", note: "Core Scope 2 comparison case" },
    { label: "Upper roof-water case", total: 50000, config: "Tank arrangement TBD", fit: "Scenario C", note: "Test against yield, drought, reserve, pad, and budget" },
  ];

  return (
    <>
      <SectionHeader eyebrow="Storage strategy" title="Tank planning" description="Size storage around usable demand, emergency reserve, constructability, service access, and future expansion—not gallons alone." action={<PageAction label="Compare vendors" />} />
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
          <div className="border-b border-[#e2e7e1] p-5 sm:p-6"><div className="flex items-center justify-between"><div><MiniLabel>Required comparison</MiniLabel><h2 className="mt-1 text-base font-bold">20k / 30k / 50k storage study</h2></div><Badge tone="amber">No selection yet</Badge></div></div>
          <div className="grid gap-6 p-5 sm:grid-cols-[1fr_1.05fr] sm:p-6">
            <div className="relative flex min-h-56 items-end justify-center overflow-hidden rounded-2xl bg-[#eef3ef] p-5">
              <div className="absolute inset-0 paper-grid opacity-70" />
              <div className="relative flex items-end gap-3">
                {[[58, "20k"], [76, "30k"], [100, "50k"]].map(([height, label]) => (
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
                {[["Roof yield", "43–52k gal/yr"], ["Pipe route", "~300 ft · verify"], ["Ranch demand", "TBD"], ["Tank pad / site", "TBD"]].map(([label, value]) => <div key={label} className="rounded-xl border border-[#e1e5e0] p-3"><MiniLabel>{label}</MiniLabel><p className="mt-2 text-sm font-bold text-[#315048]">{value}</p></div>)}
              </div>
              <div className="mt-4 space-y-2.5">
                {["Compare usable volume and drought performance", "Request vendor-specific foundation requirements", "Route screened overflow to stable drainage", "Preserve service access and future expansion"].map((item) => <div key={item} className="flex gap-2 text-[10px] leading-4 text-[#68766f]"><CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#4f8b6d]" />{item}</div>)}
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
  const [flow, setFlow] = useState(10);
  const [staticHead, setStaticHead] = useState(0);
  const [pressure, setPressure] = useState(40);
  const [friction, setFriction] = useState(0);
  const [efficiency, setEfficiency] = useState(60);
  const pressureHead = pressure * 2.31;
  const totalHead = staticHead + pressureHead + friction;
  const waterHp = flow * totalHead / 3960;
  const brakeHp = waterHp / (efficiency / 100);
  const recommendedHp = Math.max(1.5, Math.ceil(brakeHp * 1.2 * 2) / 2);
  const zones = [
    { zone: "Residence", demand: "TBD", pressure: "TBD", run: "TBD", priority: "To decide", icon: PanelTop },
    { zone: "Ranch uses", demand: "TBD", pressure: "TBD", run: "TBD", priority: "To decide", icon: Droplet },
    { zone: "Irrigation", demand: "TBD", pressure: "TBD", run: "TBD", priority: "Optional", icon: Leaf },
    { zone: "Fire / future", demand: "TBD", pressure: "TBD", run: "TBD", priority: "Future", icon: Construction },
  ];

  return (
    <>
      <SectionHeader eyebrow="Hydraulics" title="Pumping & distribution" description="Translate site elevation, delivery pressure, friction loss, and concurrent demand into a maintainable ranch pressure system." action={<PageAction label="Export design basis" />} />

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
          <div className="mt-5 flex gap-2 rounded-xl bg-[#f2f5f2] p-3"><Info size={14} className="mt-0.5 shrink-0 text-[#4d776e]" /><p className="text-[9px] leading-4 text-[#6b7972]">Editable demonstration inputs only. Static head, flow, pressure, pipe size, route, and friction loss all require field confirmation.</p></div>
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><MiniLabel>Service map</MiniLabel><h2 className="mt-1 text-base font-bold">Distribution zones</h2></div><Badge tone="amber">All service runs TBD</Badge></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {zones.map((zone) => {
            const Icon = zone.icon;
            return (
              <div key={zone.zone} className="rounded-2xl border border-[#e0e5df] bg-[#fafbf9] p-4">
                <div className="flex items-center justify-between"><div className="grid size-9 place-items-center rounded-xl bg-[#e2eeea] text-[#376f63]"><Icon size={16} /></div><Badge tone={zone.priority === "Future" ? "neutral" : "amber"}>{zone.priority}</Badge></div>
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
    { label: "Well depth", value: "TBD", note: "Obtain driller or state record", icon: ArrowDown },
    { label: "Static water level", value: "TBD", note: "Measure before test", icon: Waves },
    { label: "Sustainable yield", value: "TBD", note: "Pump test required", icon: Gauge },
    { label: "Water quality", value: "Unknown", note: "Certified sample required", icon: TestTube2 },
  ];
  const steps = [
    { title: "Records review", detail: "Match parcel, driller log, casing, pump, and historical service records.", status: "Ready" },
    { title: "Video inspection", detail: "Confirm casing condition, obstructions, perforations, and total depth.", status: "Not started" },
    { title: "Step-drawdown test", detail: "Establish well and aquifer loss at increasing discharge rates.", status: "Not started" },
    { title: "Constant-rate test", detail: "Run 8–24 hours with recovery observations and discharge control.", status: "Not started" },
    { title: "Certified lab sample", detail: "Analyze baseline potability, minerals, metals, and treatment drivers.", status: "Not started" },
  ];

  return (
    <>
      <SectionHeader eyebrow="Existing source" title="Well investigation" description="Replace assumptions with defensible well condition, sustainable yield, recovery, and water-quality data before committing the source strategy." action={<Button onClick={() => notify("Investigation request template prepared")}><FilePlus2 size={14} /> Prepare test request</Button>} />
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
          <div className="bg-[#173f37] p-5 text-white sm:p-6"><MiniLabel>Decision gate</MiniLabel><h2 className="serif mt-3 text-2xl leading-tight font-semibold">Can the well carry the ranch through a design drought?</h2><p className="mt-3 text-[11px] leading-5 text-[#a8bdb8]">The source allocation remains provisional until sustainable yield and recovery are documented.</p></div>
          <div className="p-5 sm:p-6">
            <MiniLabel>Acceptance criteria</MiniLabel>
            <div className="mt-4 space-y-3">
              {[["Sustainable yield", "Set after the demand inventory"], ["Recovery", "Criterion set with the well professional"], ["Casing integrity", "Serviceable condition documented"], ["Quality", "Supports the selected end uses and treatment plan"]].map(([label, value]) => <div key={label} className="rounded-xl border border-[#e1e5e0] p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-[#7a8982]">{label}</p><p className="mt-1.5 text-[11px] font-semibold leading-4 text-[#355249]">{value}</p></div>)}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export function TreatmentPlanning() {
  const stages = [
    { number: "01", title: "Source protection", detail: "Screened inlets, sealed tank, floating draw, sanitary vents", icon: ShieldCheck, state: "Defined" },
    { number: "02", title: "Coarse filtration", detail: "Spin-down separator, 50–100 micron service filter", icon: RotateCcw, state: "Concept" },
    { number: "03", title: "Fine filtration", detail: "20 micron then 5 micron staged cartridges", icon: SlidersHorizontal, state: "Concept" },
    { number: "04", title: "Polishing", detail: "Carbon or targeted media based on certified results", icon: Sparkles, state: "Pending lab" },
    { number: "05", title: "Disinfection", detail: "NSF-rated UV with intensity monitor and alarm", icon: Sun, state: "Concept" },
  ];
  return (
    <>
      <SectionHeader eyebrow="Water quality" title="Water treatment planning" description="Build the treatment train around source-specific lab results, required end uses, maintenance capacity, and safe failure behavior." action={<PageAction label="Add lab report" />} />
      <Card className="overflow-hidden">
        <div className="border-b border-[#e0e5df] p-5 sm:p-6"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><MiniLabel>Treatment-ready concept</MiniLabel><h2 className="mt-1 text-base font-bold">Potential residence treatment train</h2></div><Badge tone="amber">Use decision + lab required</Badge></div></div>
        <div className="scrollbar-none overflow-x-auto p-5 sm:p-6">
          <div className="flex min-w-[920px] items-stretch gap-2">
            {stages.map((stage, index) => { const Icon = stage.icon; return <div key={stage.number} className="contents"><div className="min-w-0 flex-1 rounded-2xl border border-[#dfe5df] bg-[#fafbf9] p-4"><div className="flex items-center justify-between"><span className="text-[9px] font-bold text-[#799088]">{stage.number}</span><Icon size={17} className="text-[#4d7c73]" /></div><h3 className="mt-5 text-xs font-bold text-[#2b4941]">{stage.title}</h3><p className="mt-2 text-[9px] leading-4 text-[#75817b]">{stage.detail}</p><div className="mt-4"><Badge tone={stage.state === "Defined" ? "green" : stage.state === "Pending lab" ? "amber" : "blue"}>{stage.state}</Badge></div></div>{index < stages.length - 1 && <div className="grid place-items-center"><ArrowRight size={14} className="text-[#8aa099]" /></div>}</div>; })}
          </div>
        </div>
      </Card>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card className="p-5"><div className="flex items-center justify-between"><MiniLabel>Rainwater train</MiniLabel><Badge tone="amber">Use TBD</Badge></div><h3 className="mt-4 text-sm font-bold">Core testing panel</h3><p className="mt-2 text-[10px] leading-5 text-[#748079]">Total coliform / E. coli, turbidity, pH, TDS, hardness, iron, manganese, nitrate, lead, arsenic.</p></Card>
        <Card className="p-5"><div className="flex items-center justify-between"><MiniLabel>Well train</MiniLabel><Badge tone="amber">Unknown</Badge></div><h3 className="mt-4 text-sm font-bold">Expanded baseline</h3><p className="mt-2 text-[10px] leading-5 text-[#748079]">Certified drinking-water suite plus source-specific mineral and nuisance contaminant analysis.</p></Card>
        <Card className="p-5"><div className="flex items-center justify-between"><MiniLabel>Safeguards</MiniLabel><Badge tone="green">Required</Badge></div><h3 className="mt-4 text-sm font-bold">Fail-safe controls</h3><p className="mt-2 text-[10px] leading-5 text-[#748079]">UV alarm, flow interlock, pressure gauges, sample ports, bypass lockout, and leak containment.</p></Card>
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
          <Card className="p-5 sm:p-6"><MiniLabel>Package contents</MiniLabel><div className="mt-4 space-y-3">{["Instructions to bidders", "Existing conditions + site constraints", "Basis of design and performance criteria", "Bid form with allowances and alternates", "Drawing and detail placeholders", "Submittals, commissioning, and closeout"].map((item, index) => <div key={item} className="flex items-center gap-3"><span className={`grid size-6 place-items-center rounded-full text-[8px] font-bold ${index < 3 ? "bg-[#e0eee5] text-[#347052]" : "bg-[#eef0ed] text-[#89928d]"}`}>{index < 3 ? <Check size={11} /> : index + 1}</span><span className="text-[10px] font-semibold text-[#52675f]">{item}</span></div>)}</div></Card>
          <Card className="bg-[#173f37] p-5 text-white sm:p-6"><PackageCheck size={20} className="text-[#8fc2b9]" /><h3 className="serif mt-4 text-xl font-semibold">Make price comparisons fair.</h3><p className="mt-2 text-[10px] leading-5 text-[#a8bdb7]">Require every bidder to identify exclusions, lead times, warranty, start date, and proposed substitutions on the same bid form.</p></Card>
        </div>
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
    { label: "Roof rainwater", sub: "Clean collection layer", icon: CloudRain, color: "bg-[#dcecee] text-[#36737a]" },
    { label: "Existing well", sub: "Capacity and quality TBD", icon: Gauge, color: "bg-[#eee8dc] text-[#886a38]" },
    { label: "Ranch hydrology", sub: "Runoff managed separately", icon: Waves, color: "bg-[#efe4dc] text-[#9b5f3c]" },
  ];
  return (
    <>
      <SectionHeader eyebrow="Integrated concept" title="Ranch-scale water plan" description="The working source-to-use architecture for the whole property, showing how collection, storage, treatment, controls, and priority loads fit together." action={<PageAction label="Print concept plan" />} />
      <Card className="relative overflow-hidden p-5 sm:p-6 lg:p-8">
        <div className="paper-grid absolute inset-0 opacity-65" />
        <div className="relative">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><MiniLabel>System architecture</MiniLabel><h2 className="serif mt-1 text-2xl font-semibold text-[#23463d]">Source → storage → treatment → use</h2></div><Badge tone="amber">Concept · Rev 01</Badge></div>
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_40px_1fr_40px_1fr] lg:items-center">
            <div className="space-y-3">
              {sources.map((source) => { const Icon = source.icon; return <div key={source.label} className="flex items-center gap-3 rounded-2xl border border-[#dce3dc] bg-white p-3.5 shadow-sm"><div className={`grid size-10 place-items-center rounded-xl ${source.color}`}><Icon size={18} /></div><div><p className="text-xs font-bold text-[#2d4a42]">{source.label}</p><p className="mt-0.5 text-[9px] text-[#7c8781]">{source.sub}</p></div></div>; })}
            </div>
            <div className="hidden justify-center lg:flex"><ArrowRight className="text-[#79968f]" /></div>
            <div className="rounded-[24px] border-2 border-[#6e958a] bg-[#173f37] p-5 text-white shadow-[0_16px_35px_rgba(23,63,55,.14)]">
              <div className="flex items-start justify-between"><TankIcon size={23} className="text-[#91c1b8]" /><Badge tone="blue">Roof-water hub</Badge></div><h3 className="serif mt-7 text-2xl font-semibold">20k / 30k / 50k study</h3><p className="mt-2 text-[10px] leading-5 text-[#a5bbb5]">Compare clean storage scenarios with screened overflow, protected reserve, safe access, and future expansion.</p><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/7 p-3"><p className="text-[8px] uppercase text-[#8ca8a1]">Estimated yield</p><p className="mt-1 text-xs font-bold">43–52k / yr</p></div><div className="rounded-xl bg-white/7 p-3"><p className="text-[8px] uppercase text-[#8ca8a1]">Selection</p><p className="mt-1 text-xs font-bold">Pending model</p></div></div>
            </div>
            <div className="hidden justify-center lg:flex"><ArrowRight className="text-[#79968f]" /></div>
            <div className="space-y-3">
              {[{ label: "Residence", sub: "Potable decision pending", icon: PanelTop }, { label: "Ranch uses", sub: "Demand + separation TBD", icon: Droplets }, { label: "Irrigation", sub: "Optional managed branch", icon: Leaf }, { label: "Fire / emergency", sub: "Reserve requirement TBD", icon: ShieldCheck }].map((use) => { const Icon = use.icon; return <div key={use.label} className="flex items-center gap-3 rounded-2xl border border-[#dce3dc] bg-white p-3.5 shadow-sm"><div className="grid size-10 place-items-center rounded-xl bg-[#e4eee8] text-[#3e725b]"><Icon size={18} /></div><div><p className="text-xs font-bold text-[#2d4a42]">{use.label}</p><p className="mt-0.5 text-[9px] text-[#7c8781]">{use.sub}</p></div></div>; })}
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[{ title: "Normal operation", icon: Power, note: "Set source priorities after demand, water quality, well yield, and household-use decisions are confirmed." }, { title: "Drought operation", icon: Sun, note: "Model storage and well recovery through dry periods before setting curtailment and reserve rules." }, { title: "Outage operation", icon: Zap, note: "Confirm gravity access, generator needs, and safe treatment behavior when power or a pump is unavailable." }].map((mode) => { const Icon = mode.icon; return <Card key={mode.title} className="p-5"><div className="grid size-9 place-items-center rounded-xl bg-[#e6eeea] text-[#477267]"><Icon size={16} /></div><h3 className="mt-4 text-sm font-bold text-[#2c4942]">{mode.title}</h3><p className="mt-2 text-[10px] leading-5 text-[#758079]">{mode.note}</p></Card>; })}
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
    { decision: "Confirm the primary mission and complete the demand inventory", state: "Pending owner", impact: "Sets every sizing target" },
    { decision: "Compare 20k, 30k, and 50k storage before selection", state: "Recommended", impact: "Matches the source handoff" },
    { decision: "Define the existing well's role after records and testing", state: "Pending test", impact: "Depends on sustainable yield" },
    { decision: "Choose potable, non-potable, or separated end uses", state: "Pending owner", impact: "Sets treatment and backflow scope" },
  ];
  return (
    <>
      <SectionHeader eyebrow="Owner brief" title="Executive summary" description="The current decision-ready view of project purpose, preferred concept, cost and schedule posture, open decisions, and immediate next actions." action={<Button onClick={() => notify("Executive-summary print view prepared")}><Printer size={14} /> Print summary</Button>} />
      <Card className="overflow-hidden">
        <div className="relative bg-[#173f37] p-6 text-white sm:p-8 lg:p-10"><div className="paper-grid absolute inset-0 opacity-20" /><div className="relative grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-end"><div><Badge tone="blue">Planning target · Scope 2</Badge><h2 className="serif mt-5 max-w-3xl text-[32px] leading-[1.08] font-semibold tracking-[-0.025em] sm:text-[42px]">Advance a serious household and ranch backup study—without selecting a system before the field facts are known.</h2><p className="mt-5 max-w-2xl text-[12px] leading-6 text-[#b1c4bf]">Use clean roof rainwater, the existing well, and ranch-scale runoff as distinct but coordinated layers. Confirm demand, potable use, well capacity, jurisdiction, elevations, and site conditions before final sizing or purchasing.</p></div><div className="grid grid-cols-2 gap-3">{[["Capture", "43–52k / yr"], ["Storage", "20 / 30 / 50k"], ["Autonomy", "TBD"], ["Phase", "Discovery"]].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-[8px] font-bold uppercase tracking-wider text-[#92aba5]">{label}</p><p className="mt-2 text-base font-bold">{value}</p></div>)}</div></div></div>
        <div className="grid lg:grid-cols-[1.25fr_.75fr]">
          <div className="border-b border-[#e1e6e0] p-5 sm:p-7 lg:border-r lg:border-b-0"><MiniLabel>Recommendation</MiniLabel><h3 className="serif mt-3 text-2xl leading-tight font-semibold text-[#23463d]">Advance field verification and 30% design together.</h3><p className="mt-3 text-xs leading-6 text-[#6c7a73]">Complete the demand inventory, survey tank sites, test the well, and collect certified water-quality samples. In parallel, develop capture, civil, hydraulic, treatment, electrical, and control concepts far enough to confirm scope and budget.</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{[{ icon: MapPin, title: "Verify", note: "Demand, elevations, source condition" }, { icon: PencilLine, title: "Design", note: "30% coordinated system package" }, { icon: BarChart3, title: "Price", note: "Comparable contractor bid scopes" }].map((item) => { const Icon = item.icon; return <div key={item.title} className="rounded-2xl border border-[#e0e5df] p-4"><Icon size={17} className="text-[#4a796e]" /><p className="mt-3 text-xs font-bold">{item.title}</p><p className="mt-1 text-[9px] leading-4 text-[#7d8882]">{item.note}</p></div>; })}</div></div>
          <div className="p-5 sm:p-7"><MiniLabel>Schedule posture</MiniLabel><div className="mt-5 space-y-5">{[["Field verification", "Jun–Jul", 35], ["30% design", "Jul–Aug", 18], ["Bid & award", "Aug–Sep", 0], ["Construction", "Fall 2026", 0]].map(([label, date, value], index) => <div key={String(label)}><div className="mb-2 flex items-center justify-between"><div className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-[#e8eee9] text-[8px] font-bold text-[#507167]">{index + 1}</span><span className="text-[10px] font-bold text-[#4a6058]">{label}</span></div><span className="text-[9px] text-[#89938d]">{date}</span></div><Meter value={Number(value)} color={Number(value) > 0 ? "bg-[#568b7c]" : "bg-[#bcc6bf]"} /></div>)}</div></div>
        </div>
      </Card>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_310px]">
        <Card className="overflow-hidden"><div className="border-b border-[#e2e6e1] p-5"><MiniLabel>Decision log</MiniLabel><h2 className="mt-1 text-base font-bold">Owner decisions required</h2></div><div className="divide-y divide-[#e7ebe6]">{decisions.map((decision) => <div key={decision.decision} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-5"><div><p className="text-[11px] font-bold text-[#304e45]">{decision.decision}</p><p className="mt-1 text-[9px] text-[#7f8a84]">{decision.impact}</p></div><Badge tone={decision.state === "Recommended" ? "green" : decision.state === "Pending test" ? "amber" : "blue"}>{decision.state}</Badge></div>)}</div></Card>
        <Card className="p-5"><MiniLabel>Budget frame</MiniLabel><p className="mt-3 text-[10px] leading-5 text-[#748079]">A defensible project cost cannot be set until tank civil work, run lengths, electrical service, and treatment drivers are confirmed.</p><div className="mt-5 rounded-2xl bg-[#f3eee4] p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-[#896f47]">Current classification</p><p className="mt-2 text-lg font-bold text-[#59472e]">Class 4 estimate</p><p className="mt-1 text-[9px] leading-4 text-[#87775f]">Concept-level range; expected accuracy remains broad.</p></div><div className="mt-4 flex items-center gap-2 text-[9px] text-[#6b7a73]"><TrendingUp size={13} className="text-[#4f806f]" /> Next cost gate: 30% design + site data</div></Card>
      </div>
    </>
  );
}

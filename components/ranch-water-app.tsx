"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Calculator,
  CheckSquare2,
  ChevronDown,
  ClipboardList,
  ClipboardCheck,
  Database as TankIcon,
  Droplets,
  FileBox,
  FileSpreadsheet,
  FileText,
  Gauge,
  LayoutDashboard,
  Menu,
  Network,
  PanelLeftClose,
  ShieldAlert,
  Sparkles,
  SprayCan,
  UserCheck,
  Wrench,
  X,
} from "lucide-react";
import {
  BidPackage,
  Dashboard,
  DocumentLibrary,
  ExecutiveSummary,
  BidSystem,
  ContractorRecommendations,
  IntakeQuestions,
  MaintenancePlan,
  MasterTaskBoard,
  PumpingDistribution,
  RainwaterCalculators,
  RanchScalePlan,
  RegulatoryChecklist,
  RiskRegister,
  SiteVisitPlanner,
  TankPlanning,
  TreatmentPlanning,
  WellInvestigation,
} from "./sections";

export type PageKey =
  | "dashboard"
  | "intake"
  | "tasks"
  | "siteVisit"
  | "calculators"
  | "tanks"
  | "distribution"
  | "well"
  | "treatment"
  | "regulatory"
  | "bids"
  | "recommendations"
  | "bidSystem"
  | "documents"
  | "plan"
  | "risks"
  | "maintenance"
  | "summary";

const groups = [
  {
    label: "Project",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "intake", label: "Intake questions", icon: ClipboardCheck, count: 4 },
      { key: "siteVisit", label: "Site visit planner", icon: ClipboardList, count: 4 },
      { key: "tasks", label: "Master task board", icon: CheckSquare2, count: 12 },
    ],
  },
  {
    label: "System design",
    items: [
      { key: "calculators", label: "Rainwater calculators", icon: Calculator },
      { key: "tanks", label: "Tank planning", icon: TankIcon },
      { key: "distribution", label: "Pumping & distribution", icon: Network },
      { key: "well", label: "Well investigation", icon: Gauge },
      { key: "treatment", label: "Water treatment", icon: SprayCan },
    ],
  },
  {
    label: "Delivery",
    items: [
      { key: "regulatory", label: "Regulatory checklist", icon: ClipboardCheck },
      { key: "bids", label: "Contractor bid package", icon: FileText },
      { key: "recommendations", label: "Contractor recommendations", icon: UserCheck },
      { key: "bidSystem", label: "Bid comparison", icon: FileSpreadsheet },
      { key: "documents", label: "Document library", icon: FileBox },
    ],
  },
  {
    label: "Operations",
    items: [
      { key: "plan", label: "Source plan", icon: BookOpen },
      { key: "risks", label: "Risk register", icon: ShieldAlert, count: 6 },
      { key: "maintenance", label: "Maintenance plan", icon: Wrench },
      { key: "summary", label: "Executive summary", icon: Sparkles },
    ],
  },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid size-10 place-items-center overflow-hidden rounded-[13px] bg-[#dceae7] text-[#1c5a50]">
        <Droplets size={20} strokeWidth={1.8} />
        <span className="absolute inset-x-0 bottom-0 h-1 bg-[#b9744c]" />
      </div>
      <div className="min-w-0">
        <p className="serif truncate text-[18px] leading-5 font-semibold tracking-[-0.01em] text-white">Evant Ranch</p>
        <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.19em] text-[#9cbab2]">Rainwater + well</p>
      </div>
    </div>
  );
}

function Sidebar({ page, setPage, mobile = false, close }: { page: PageKey; setPage: (page: PageKey) => void; mobile?: boolean; close?: () => void }) {
  return (
    <aside className={`flex h-full w-[286px] shrink-0 flex-col bg-[#143a33] text-white ${mobile ? "shadow-2xl" : ""}`}>
      <div className="flex h-[84px] items-center justify-between border-b border-white/8 px-5">
        <Brand />
        {mobile && <button aria-label="Close navigation" className="focus-ring rounded-lg p-2 text-[#bdd0ca] hover:bg-white/10" onClick={close}><X size={18} /></button>}
      </div>

      <nav className="scrollbar-none flex-1 overflow-y-auto px-3 py-5" aria-label="Project navigation">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.21em] text-[#789b92]">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = page === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setPage(item.key);
                      close?.();
                    }}
                    className={`focus-ring group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold transition-colors ${active ? "bg-white text-[#173f37] shadow-[0_4px_14px_rgba(0,0,0,.12)]" : "text-[#bfd0cb] hover:bg-white/7 hover:text-white"}`}
                  >
                    <Icon size={16} strokeWidth={active ? 2.1 : 1.7} className={active ? "text-[#317166]" : "text-[#85a9a0] group-hover:text-[#b9d3cd]"} />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {"count" in item && <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${active ? "bg-[#e7efec] text-[#3d6e62]" : "bg-white/8 text-[#a8c0ba]"}`}>{item.count}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="m-3 rounded-2xl border border-white/8 bg-[#0f302a] p-3.5">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-full bg-[#b66f46] text-[10px] font-extrabold text-white">BP</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold text-white">Project owner</p>
            <p className="truncate text-[9px] text-[#84a59d]">Local planning workspace</p>
          </div>
          <ChevronDown size={14} className="text-[#6f968c]" />
        </div>
      </div>
    </aside>
  );
}

function PageContent({ page, setPage, notify }: { page: PageKey; setPage: (page: PageKey) => void; notify: (message: string) => void }) {
  switch (page) {
    case "intake": return <IntakeQuestions notify={notify} />;
    case "tasks": return <MasterTaskBoard notify={notify} />;
    case "siteVisit": return <SiteVisitPlanner notify={notify} />;
    case "calculators": return <RainwaterCalculators />;
    case "tanks": return <TankPlanning />;
    case "distribution": return <PumpingDistribution />;
    case "well": return <WellInvestigation notify={notify} />;
    case "treatment": return <TreatmentPlanning />;
    case "regulatory": return <RegulatoryChecklist />;
    case "bids": return <BidPackage notify={notify} />;
    case "recommendations": return <ContractorRecommendations notify={notify} />;
    case "bidSystem": return <BidSystem notify={notify} />;
    case "documents": return <DocumentLibrary notify={notify} />;
    case "plan": return <RanchScalePlan />;
    case "risks": return <RiskRegister notify={notify} />;
    case "maintenance": return <MaintenancePlan />;
    case "summary": return <ExecutiveSummary notify={notify} />;
    default: return <Dashboard navigate={setPage} />;
  }
}

export function RanchWaterApp() {
  const [page, setPage] = useState<PageKey>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const setActivePage = (nextPage: PageKey) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen lg:flex">
      <div className="hidden h-screen lg:sticky lg:top-0 lg:block">
        <Sidebar page={page} setPage={setActivePage} />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button aria-label="Close navigation overlay" className="absolute inset-0 bg-[#0a201c]/55 backdrop-blur-[2px]" onClick={() => setMenuOpen(false)} />
          <div className="relative h-full"><Sidebar page={page} setPage={setActivePage} mobile close={() => setMenuOpen(false)} /></div>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-[#dde3dc] bg-[#f7f8f5]/92 px-4 backdrop-blur-xl sm:px-6 lg:hidden">
          <button aria-label="Open navigation" onClick={() => setMenuOpen(true)} className="focus-ring rounded-xl border border-[#d8dfd8] bg-white p-2.5 text-[#34534c]"><Menu size={18} /></button>
          <div className="flex items-center gap-2">
            <Droplets size={17} className="text-[#3a7e75]" />
            <span className="serif text-base font-semibold text-[#183d35]">Evant Ranch</span>
          </div>
          <div className="grid size-9 place-items-center rounded-full bg-[#173f37] text-[9px] font-bold text-white">BP</div>
        </div>

        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8 xl:p-10">
          <div key={page} className="page-rise">
            <PageContent page={page} setPage={setActivePage} notify={setToast} />
          </div>
        </div>
      </main>

      {toast && (
        <div role="status" className="fixed right-4 bottom-4 z-[70] flex items-center gap-2 rounded-2xl bg-[#173f37] px-4 py-3 text-xs font-semibold text-white shadow-2xl sm:right-6 sm:bottom-6">
          <span className="grid size-5 place-items-center rounded-full bg-white/15"><PanelLeftClose size={11} /></span>
          {toast}
        </div>
      )}
    </div>
  );
}

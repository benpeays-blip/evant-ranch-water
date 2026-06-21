import type { ReactNode } from "react";
import { ArrowUpRight, LucideIcon } from "lucide-react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  const background = className.includes("bg-") ? "" : "bg-white";
  const borderColor = className.includes("border-[") ? "" : "border-[#dde4dc]";
  return (
    <section className={`min-w-0 rounded-[22px] border ${borderColor} ${background} shadow-[0_1px_2px_rgba(17,45,39,.03),0_10px_30px_rgba(17,45,39,.025)] ${className}`}>
      {children}
    </section>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "green" | "blue" | "amber" | "red" | "neutral" }) {
  const tones = {
    green: "bg-[#e1efe6] text-[#246048]",
    blue: "bg-[#e2eff2] text-[#306a72]",
    amber: "bg-[#f6ead2] text-[#8b5b19]",
    red: "bg-[#f7e2dc] text-[#9a4a35]",
    neutral: "bg-[#edf0eb] text-[#5f6d66]",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${tones[tone]}`}>{children}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status === "Complete" || status === "Uploaded"
    ? "green"
    : status === "In progress" || status === "Working"
      ? "blue"
      : status === "Blocked"
        ? "red"
        : status === "Ready"
          ? "amber"
          : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#4d7b78]">{eyebrow}</p>
        <h1 className="serif text-[32px] leading-[1.05] font-semibold tracking-[-0.025em] text-[#173b34] sm:text-[42px]">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#65716a] sm:text-[15px]">{description}</p>
      </div>
      {action}
    </header>
  );
}

export function Button({ children, variant = "primary", onClick, className = "", type = "button" }: { children: ReactNode; variant?: "primary" | "secondary" | "ghost"; onClick?: () => void; className?: string; type?: "button" | "submit" }) {
  const variants = {
    primary: "bg-[#173f37] text-white shadow-[0_6px_16px_rgba(23,63,55,.15)] hover:bg-[#0f322b]",
    secondary: "border border-[#d8dfd8] bg-white text-[#27443e] hover:border-[#a9bbb5] hover:bg-[#f8faf8]",
    ghost: "text-[#47635c] hover:bg-[#edf2ee]",
  };
  return (
    <button type={type} onClick={onClick} className={`focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function StatCard({ icon: Icon, label, value, note, accent = "green" }: { icon: LucideIcon; label: string; value: string; note: string; accent?: "green" | "blue" | "clay" | "gold" }) {
  const colors = {
    green: "bg-[#e4eee8] text-[#2e6351]",
    blue: "bg-[#e2eef1] text-[#3f7580]",
    clay: "bg-[#f4e6dd] text-[#a05e3b]",
    gold: "bg-[#f4ecd8] text-[#94702a]",
  };
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7d8781]">{label}</p>
          <p className="mt-2 text-[25px] font-semibold tracking-[-0.04em] text-[#203d37]">{value}</p>
          <p className="mt-1 text-[11px] text-[#758078]">{note}</p>
        </div>
        <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${colors[accent]}`}><Icon size={18} strokeWidth={1.8} /></div>
      </div>
    </Card>
  );
}

export function Meter({ value, color = "bg-[#4e8b7a]" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-[#e7ebe6]">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} />
    </div>
  );
}

export function Field({ label, value, type = "text", suffix, onChange, min, max, step }: { label: string; value: string | number; type?: "text" | "number"; suffix?: string; onChange?: (value: string) => void; min?: number; max?: number; step?: number }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#738079]">{label}</span>
      <span className="relative block">
        <input
          type={type}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange?.(event.target.value)}
          readOnly={!onChange}
          className="focus-ring h-11 w-full rounded-xl border border-[#dce2dc] bg-[#fafbf9] px-3.5 pr-16 text-sm font-semibold text-[#28453e] outline-none transition-colors focus:border-[#8aada5] focus:bg-white"
        />
        {suffix && <span className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-[#8b948f]">{suffix}</span>}
      </span>
    </label>
  );
}

export function PageAction({ label, onClick }: { label: string; onClick?: () => void }) {
  return <Button variant="secondary" onClick={onClick}>{label}<ArrowUpRight size={14} /></Button>;
}

export function MiniLabel({ children }: { children: ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a857e]">{children}</p>;
}

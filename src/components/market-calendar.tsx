"use client";

import { useEffect, useMemo, useState } from "react";
import { CALENDAR_EVENTS } from "@/lib/calendar";
import type { CalendarEvent } from "@/lib/types";

const IMPACT_STYLE: Record<CalendarEvent["impact"], string> = {
 High: "bg-down/15 text-down border-down/30",
 Medium: "bg-warn/15 text-warn border-warn/30",
 Low: "bg-up/15 text-up border-up/30",
};
const DOT: Record<CalendarEvent["impact"], string> = { High: "bg-down", Medium: "bg-warn", Low: "bg-up" };
const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function monthKey(d: Date) { return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`; }
function daysInMonth(y: number, m: number) { return new Date(Date.UTC(y, m + 1, 0)).getUTCDate(); }
function firstWeekday(y: number, m: number) { return new Date(Date.UTC(y, m, 1)).getUTCDay(); }
function pad(n: number) { return String(n).padStart(2, "0"); }

export function MarketCalendar() {
 const [impact, setImpact] = useState<"All" | CalendarEvent["impact"]>("All");
 const [view, setView] = useState<"list" | "calendar">("calendar");
 const [nowTs, setNowTs] = useState<number | null>(null);
 const [month, setMonth] = useState("2026-11");
 const [selectedDate, setSelectedDate] = useState<string | null>(null);

 useEffect(() => {
  const now = Date.now();
  setNowTs(now);
  setMonth(monthKey(new Date(now)));
 }, []);

 const filtered = useMemo(() => {
  return CALENDAR_EVENTS.filter((e) => impact === "All" || e.impact === impact)
   .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
 }, [impact]);

 const byDate = useMemo(() => {
  const m = new Map<string, CalendarEvent[]>();
  for (const e of filtered) {
   const arr = m.get(e.date) || [];
   arr.push(e);
   m.set(e.date, arr);
  }
  return m;
 }, [filtered]);

 const [year, mon] = month.split("-").map(Number);
 const monthIndex = mon - 1;
 const totalDays = daysInMonth(year, monthIndex);
 const startDay = firstWeekday(year, monthIndex);
 const cells: Array<{ day: number; date: string } | null> = [];
 for (let i = 0; i < startDay; i++) cells.push(null);
 for (let d = 1; d <= totalDays; d++) cells.push({ day: d, date: `${year}-${pad(mon)}-${pad(d)}` });
 while (cells.length % 7 !== 0) cells.push(null);

 const base = nowTs ?? Date.parse("2026-11-24T00:00:00Z");
 const listItems = filtered.filter((e) => new Date(`${e.date}T${e.time}:00Z`).getTime() >= base - 24 * 3600 * 1000);
 const monthEvents = filtered.filter((e) => e.date.startsWith(month));
 const sideEvents = selectedDate ? (byDate.get(selectedDate) || []) : monthEvents;
 const todayStr = nowTs ? new Date(nowTs).toISOString().slice(0, 10) : "";

 function shiftMonth(delta: number) {
  const d = new Date(Date.UTC(year, monthIndex + delta, 1));
  setMonth(monthKey(d));
  setSelectedDate(null);
 }

 return (
  <section id="calendar" className="scroll-mt-24 space-y-4" data-aos="fade-right">
   <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
     <h2 className="text-2xl font-semibold text-text">Market Calendar</h2>
     <p className="text-sm text-muted">Jadwal event ekonomi dan rilis data pasar.</p>
    </div>
    <div className="flex flex-wrap items-center gap-2">
     <div className="inline-flex border border-border bg-panel p-0.5">
      <button onClick={() => setView("calendar")} className={`px-3 py-1.5 text-xs font-medium transition ${view === "calendar" ? "bg-brand text-white" : "text-muted hover:text-text"}`}>Kalender</button>
      <button onClick={() => setView("list")} className={`px-3 py-1.5 text-xs font-medium transition ${view === "list" ? "bg-brand text-white" : "text-muted hover:text-text"}`}>List</button>
     </div>
     <div className="flex flex-wrap gap-1.5">
      {(["All", "High", "Medium", "Low"] as const).map((i) => (
       <button key={i} onClick={() => setImpact(i)} className={`px-2.5 py-1.5 text-[11px] border transition ${impact === i ? "bg-brand text-white border-brand" : "bg-panel text-muted border-border hover:text-text hover:border-brand/30"}`}>
        {i}
       </button>
      ))}
     </div>
    </div>
   </div>

   {view === "calendar" ? (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
     <div className="border border-border bg-panel">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-panel-elev">
       <button onClick={() => shiftMonth(-1)} className="h-8 w-8 inline-flex items-center justify-center border border-border text-muted hover:text-text hover:border-brand/40 transition" aria-label="Bulan sebelumnya">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
       </button>
       <div className="text-center">
        <div className="font-semibold text-text">{new Date(Date.UTC(year, monthIndex, 1)).toLocaleString("id-ID", { month: "long", year: "numeric", timeZone: "UTC" })}</div>
        <div className="text-[11px] text-muted">{monthEvents.length} event di bulan ini</div>
       </div>
       <button onClick={() => shiftMonth(1)} className="h-8 w-8 inline-flex items-center justify-center border border-border text-muted hover:text-text hover:border-brand/40 transition" aria-label="Bulan berikutnya">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
       </button>
      </div>

      <div className="p-3 sm:p-4">
       <div className="grid grid-cols-7 border-l border-t border-border">
        {WEEKDAYS.map((d) => (
         <div key={d} className="border-r border-b border-border bg-bg/40 px-1 py-2 text-center text-[10px] sm:text-[11px] font-medium text-muted uppercase tracking-wide">{d}</div>
        ))}
        {cells.map((c, idx) => {
         if (!c) return <div key={`e-${idx}`} className="min-h-[72px] sm:min-h-[88px] border-r border-b border-border bg-bg/20" />;
         const evs = byDate.get(c.date) || [];
         const active = selectedDate === c.date;
         const isToday = c.date === todayStr;
         const marks = ["High", "Medium", "Low"].filter((lvl) => evs.some((e) => e.impact === lvl)) as CalendarEvent["impact"][];
         return (
          <button
           key={c.date}
           onClick={() => setSelectedDate(active ? null : c.date)}
           className={`min-h-[72px] sm:min-h-[88px] border-r border-b border-border p-1.5 sm:p-2 text-left transition relative ${active ? "bg-brand-soft/60" : "bg-panel hover:bg-panel-elev/60"}`}
          >
           <div className="flex items-start justify-between gap-1">
            <span className={`inline-flex h-6 w-6 items-center justify-center text-xs font-num ${isToday ? "bg-brand text-white" : "text-text"}`}>{c.day}</span>
            {evs.length > 0 && <span className="text-[10px] text-muted font-num">{evs.length}</span>}
           </div>
           <div className="mt-2 flex flex-wrap gap-1">
            {marks.map((m) => <span key={m} className={`h-1.5 w-4 ${DOT[m]}`} title={m} />)}
           </div>
           {evs.length > 0 && <div className="mt-1 hidden sm:block text-[10px] text-muted truncate">{evs[0].event}</div>}
           {active && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" />}
          </button>
         );
        })}
       </div>

       <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-4 bg-down" />High impact</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-4 bg-warn" />Medium impact</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-4 bg-up" />Low impact</span>
       </div>
      </div>
     </div>

     <div className="border border-border bg-panel overflow-hidden flex flex-col min-h-[360px]">
      <div className="px-4 py-3 border-b border-border bg-panel-elev">
       <div className="flex items-center justify-between gap-2">
        <div>
         <div className="text-sm font-semibold text-text">{selectedDate ? `Event ${selectedDate}` : "Event bulan ini"}</div>
         <div className="text-[11px] text-muted">{selectedDate ? "Detail event pada tanggal terpilih" : "Pilih tanggal untuk melihat detail"}</div>
        </div>
        {selectedDate && <button onClick={() => setSelectedDate(null)} className="text-[11px] text-brand hover:opacity-80">Reset</button>}
       </div>
      </div>
      <div className="flex-1 overflow-auto divide-y divide-border">
       {sideEvents.length === 0 ? (
        <div className="p-6 text-sm text-muted text-center">Tidak ada event untuk filter ini.</div>
       ) : sideEvents.map((e) => (
        <div key={e.id} className="p-4 hover:bg-panel-elev/30 transition">
         <div className="flex items-start justify-between gap-3 mb-1.5">
          <span className="text-[11px] font-num text-muted">{e.date} · {e.time} UTC</span>
          <span className={`inline-flex px-2 py-0.5 text-[10px] border shrink-0 ${IMPACT_STYLE[e.impact]}`}>{e.impact}</span>
         </div>
         <div className="text-sm font-medium text-text leading-6">{e.event}</div>
         <div className="mt-1 text-[11px] text-muted">{e.country} · {e.category}</div>
        </div>
       ))}
      </div>
     </div>
    </div>
   ) : (
    <div className="border border-border bg-panel overflow-x-auto">
     <table className="w-full min-w-[640px] text-xs">
      <thead className="bg-panel-elev text-muted text-[11px] uppercase tracking-wide">
       <tr>
        <th className="text-left px-3 py-2.5 font-medium">Date</th>
        <th className="text-left px-3 py-2.5 font-medium">Time (UTC)</th>
        <th className="text-left px-3 py-2.5 font-medium">Country</th>
        <th className="text-left px-3 py-2.5 font-medium">Event</th>
        <th className="text-left px-3 py-2.5 font-medium">Impact</th>
       </tr>
      </thead>
      <tbody>
       {listItems.map((e) => (
        <tr key={e.id} className="border-t border-border hover:bg-panel-elev/50 transition">
         <td className="px-3 py-2.5 font-num text-text">{e.date}</td>
         <td className="px-3 py-2.5 font-num text-muted">{e.time}</td>
         <td className="px-3 py-2.5 text-text">{e.country}</td>
         <td className="px-3 py-2.5 text-text">{e.event}</td>
         <td className="px-3 py-2.5"><span className={`inline-flex px-2 py-0.5 text-[10px] border ${IMPACT_STYLE[e.impact]}`}>{e.impact}</span></td>
        </tr>
       ))}
       {listItems.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-muted">Tidak ada event.</td></tr>}
      </tbody>
     </table>
    </div>
   )}
  </section>
 );
}

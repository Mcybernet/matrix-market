"use client";

import { useEffect, useMemo, useState } from "react";
import { CALENDAR_EVENTS } from "@/lib/calendar";
import type { CalendarEvent } from "@/lib/types";

const IMPACT_STYLE: Record<CalendarEvent["impact"], string> = {
 High: "bg-down/15 text-down border-down/30",
 Medium: "bg-warn/15 text-warn border-warn/30",
 Low: "bg-up/15 text-up border-up/30",
};

const DOT: Record<CalendarEvent["impact"], string> = {
 High: "bg-down",
 Medium: "bg-warn",
 Low: "bg-up",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthKey(d: Date) {
 return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number) {
 return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function firstWeekday(year: number, month: number) {
 return new Date(Date.UTC(year, month, 1)).getUTCDay();
}

export function MarketCalendar() {
 const [impact, setImpact] = useState<"All" | CalendarEvent["impact"]>("All");
 const [view, setView] = useState<"list" | "calendar">("calendar");
 const [nowTs, setNowTs] = useState<number | null>(null);
 const [month, setMonth] = useState(() => monthKey(new Date(Date.UTC(2026, 10, 1))));
 const [selectedDate, setSelectedDate] = useState<string | null>(null);

 useEffect(() => {
  const now = Date.now();
  setNowTs(now);
  const d = new Date(now);
  setMonth(monthKey(d));
 }, []);

 const filtered = useMemo(() => {
  return CALENDAR_EVENTS.filter((e) => impact === "All" || e.impact === impact).sort((a, b) =>
   `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
  );
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
 for (let d = 1; d <= totalDays; d++) {
  const date = `${year}-${String(mon).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  cells.push({ day: d, date });
 }
 while (cells.length % 7 !== 0) cells.push(null);

 const selectedEvents = selectedDate ? byDate.get(selectedDate) || [] : filtered;
 const base = nowTs ?? Date.parse("2026-11-24T00:00:00Z");
 const listItems = filtered.filter((e) => new Date(`${e.date}T${e.time}:00Z`).getTime() >= base - 24 * 3600 * 1000);

 function shiftMonth(delta: number) {
  const d = new Date(Date.UTC(year, monthIndex + delta, 1));
  setMonth(monthKey(d));
  setSelectedDate(null);
 }

 return (
  <section id="calendar" className="scroll-mt-24 space-y-4" data-aos="fade-right">
   <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
     <h2 className="text-2xl font-semibold text-text">Market Calendar</h2>
     <p className="text-sm text-muted">Upcoming economic events and data releases.</p>
    </div>
    <div className="flex flex-wrap gap-2">
     <div className="flex border border-border">
      <button onClick={() => setView("calendar")} className={`px-3 py-1.5 text-xs transition ${view === "calendar" ? "bg-brand text-white" : "bg-panel text-muted hover:text-text"}`}>Kalender</button>
      <button onClick={() => setView("list")} className={`px-3 py-1.5 text-xs transition ${view === "list" ? "bg-brand text-white" : "bg-panel text-muted hover:text-text"}`}>List</button>
     </div>
     {(["All", "High", "Medium", "Low"] as const).map((i) => (
      <button key={i} onClick={() => setImpact(i)} className={`px-3 py-1.5 text-xs border transition ${impact === i ? "bg-brand text-white border-brand" : "bg-panel text-muted border-border hover:text-text"}`}>{i}</button>
     ))}
    </div>
   </div>

   {view === "calendar" ? (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
     <div className="border border-border bg-panel p-4">
      <div className="flex items-center justify-between mb-4">
       <button onClick={() => shiftMonth(-1)} className="px-2 py-1 border border-border text-muted hover:text-text hover:border-brand/40 transition" aria-label="Previous month">‹</button>
       <div className="font-medium text-text">{new Date(Date.UTC(year, monthIndex, 1)).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}</div>
       <button onClick={() => shiftMonth(1)} className="px-2 py-1 border border-border text-muted hover:text-text hover:border-brand/40 transition" aria-label="Next month">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-[11px] text-muted mb-1">
       {WEEKDAYS.map((d) => <div key={d} className="text-center py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
       {cells.map((c, idx) => {
        if (!c) return <div key={`e-${idx}`} className="h-16 sm:h-20 border border-transparent" />;
        const evs = byDate.get(c.date) || [];
        const active = selectedDate === c.date;
        const hasHigh = evs.some((e) => e.impact === "High");
        const hasMed = evs.some((e) => e.impact === "Medium");
        const hasLow = evs.some((e) => e.impact === "Low");
        return (
         <button key={c.date} onClick={() => setSelectedDate(active ? null : c.date)} className={`h-16 sm:h-20 border p-1 text-left transition ${active ? "border-brand bg-brand-soft" : "border-border hover:border-brand/40 hover:bg-panel-elev/40"}`}>
          <div className="text-xs font-num text-text">{c.day}</div>
          <div className="mt-1 flex flex-wrap gap-1">
           {hasHigh && <span className={`w-2 h-2 ${DOT.High}`} />}
           {hasMed && <span className={`w-2 h-2 ${DOT.Medium}`} />}
           {hasLow && <span className={`w-2 h-2 ${DOT.Low}`} />}
          </div>
          {evs.length > 0 && <div className="mt-1 text-[10px] text-muted hidden sm:block">{evs.length} event{evs.length > 1 ? "s" : ""}</div>}
         </button>
        );
       })}
      </div>
      <div className="mt-3 flex gap-3 text-[11px] text-muted">
       <span className="inline-flex items-center gap-1"><span className="w-2 h-2 bg-down" />High</span>
       <span className="inline-flex items-center gap-1"><span className="w-2 h-2 bg-warn" />Medium</span>
       <span className="inline-flex items-center gap-1"><span className="w-2 h-2 bg-up" />Low</span>
      </div>
     </div>

     <div className="border border-border bg-panel overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-panel-elev text-sm font-medium text-text">
       {selectedDate ? `Events on ${selectedDate}` : "Events in selected filter"}
      </div>
      <div className="max-h-[420px] overflow-auto divide-y divide-border">
       {selectedEvents.length === 0 ? (
        <div className="p-4 text-sm text-muted">No events for this date/filter.</div>
       ) : selectedEvents.map((e) => (
        <div key={e.id} className="p-4">
         <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-num text-muted">{e.date} {e.time} UTC</span>
          <span className={`inline-flex px-2 py-0.5 text-[10px] border ${IMPACT_STYLE[e.impact]}`}>{e.impact}</span>
         </div>
         <div className="text-sm text-text">{e.event}</div>
         <div className="text-[11px] text-muted mt-1">{e.country} · {e.category}</div>
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
      </tbody>
     </table>
    </div>
   )}
  </section>
 );
}

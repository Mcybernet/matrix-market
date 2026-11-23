"use client";

import { useEffect, useMemo, useState } from "react";
import { CALENDAR_EVENTS } from "@/lib/calendar";
import type { CalendarEvent } from "@/lib/types";

const IMPACT_STYLE: Record<CalendarEvent["impact"], string> = {
 High: "bg-down/15 text-down border-down/30",
 Medium: "bg-warn/15 text-warn border-warn/30",
 Low: "bg-up/15 text-up border-up/30",
};

export function MarketCalendar() {
 const [impact, setImpact] = useState<"All" | CalendarEvent["impact"]>("All");
 const [nowTs, setNowTs] = useState<number | null>(null);

 useEffect(() => {
  setNowTs(Date.now());
 }, []);

 const items = useMemo(() => {
  const base = nowTs ?? Date.parse("2026-11-24T00:00:00Z");
  return CALENDAR_EVENTS
   .filter((e) => impact === "All" || e.impact === impact)
   .filter((e) => new Date(`${e.date}T${e.time}:00Z`).getTime() >= base - 24 * 3600 * 1000)
   .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
 }, [impact, nowTs]);

 return (
  <section id="calendar" className="scroll-mt-24 space-y-4" data-aos="fade-right">
   <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
     <h2 className="text-2xl font-semibold text-text">Market Calendar</h2>
     <p className="text-sm text-muted">Upcoming economic events and data releases.</p>
    </div>
    <div className="flex gap-2">
     {(["All", "High", "Medium", "Low"] as const).map((i) => (
      <button
       key={i}
       onClick={() => setImpact(i)}
       className={`px-3 py-1.5 text-xs border transition ${impact === i ? "bg-brand text-white border-brand" : "bg-panel text-muted border-border hover:text-text"}`}
      >
       {i}
      </button>
     ))}
    </div>
   </div>
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
      {items.map((e) => (
       <tr key={e.id} className="border-t border-border hover:bg-panel-elev/50 transition">
        <td className="px-3 py-2.5 font-num text-text">{e.date}</td>
        <td className="px-3 py-2.5 font-num text-muted">{e.time}</td>
        <td className="px-3 py-2.5 text-text">{e.country}</td>
        <td className="px-3 py-2.5 text-text">{e.event}</td>
        <td className="px-3 py-2.5">
         <span className={`inline-flex px-2 py-0.5 text-[10px] border ${IMPACT_STYLE[e.impact]}`}>{e.impact}</span>
        </td>
       </tr>
      ))}
     </tbody>
    </table>
   </div>
  </section>
 );
}
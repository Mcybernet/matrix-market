import type { CalendarEvent } from "./types";

export const CALENDAR_EVENTS: CalendarEvent[] = [
 { id: "c1", date: "2026-11-24", time: "20:30", country: "US", event: "US GDP Growth Rate (QoQ, 2nd Est.)", impact: "High", category: "GDP" },
 { id: "c2", date: "2026-11-25", time: "20:30", country: "US", event: "Core PCE Price Index (MoM)", impact: "High", category: "Inflation" },
 { id: "c3", date: "2026-11-25", time: "20:30", country: "US", event: "Initial Jobless Claims", impact: "Medium", category: "Employment" },
 { id: "c4", date: "2026-11-26", time: "15:00", country: "DE", event: "Germany CPI (YoY, Flash)", impact: "High", category: "Inflation" },
 { id: "c5", date: "2026-11-27", time: "07:30", country: "JP", event: "Tokyo CPI (YoY)", impact: "Medium", category: "Inflation" },
 { id: "c6", date: "2026-11-27", time: "10:00", country: "CN", event: "Manufacturing PMI", impact: "Medium", category: "Other" },
 { id: "c7", date: "2026-12-01", time: "09:00", country: "ID", event: "Indonesia Inflation Rate (YoY)", impact: "High", category: "Inflation" },
 { id: "c8", date: "2026-12-02", time: "15:30", country: "US", event: "Fed Chair Speech", impact: "High", category: "Central Bank" },
 { id: "c9", date: "2026-12-04", time: "20:30", country: "US", event: "Non-Farm Payrolls", impact: "High", category: "Employment" },
 { id: "c10", date: "2026-12-10", time: "19:00", country: "US", event: "FOMC Interest Rate Decision", impact: "High", category: "Rates" },
];
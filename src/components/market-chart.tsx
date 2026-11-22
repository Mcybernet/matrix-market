"use client";

import { useMemo, useState } from "react";
import type { ChartPoint } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function MarketChart({
 points,
 symbol,
 up,
}: {
 points: ChartPoint[];
 symbol: string;
 up: boolean;
}) {
 const [hover, setHover] = useState<number | null>(null);
 const w = 720;
 const h = 280;
 const pad = { l: 8, r: 56, t: 12, b: 24 };
 const innerW = w - pad.l - pad.r;
 const innerH = h - pad.t - pad.b;

 const { min, max, path, area, coords } = useMemo(() => {
 const values = points.map((p) => p.value);
 const minV = Math.min(...values);
 const maxV = Math.max(...values);
 const range = maxV - minV || 1;
 const c = points.map((p, i) => {
 const x = pad.l + (i / Math.max(1, points.length - 1)) * innerW;
 const y = pad.t + (1 - (p.value - minV) / range) * innerH;
 return { x, y, p };
 });
 const line = c.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ");
 const areaD = `${line} L ${c[c.length - 1].x} ${pad.t + innerH} L ${c[0].x} ${pad.t + innerH} Z`;
 return { min: minV, max: maxV, path: line, area: areaD, coords: c };
 }, [points, innerW, innerH, pad.l, pad.t]);

 const color = up ? "var(--up)" : "var(--down)";
 const active = hover !== null ? coords[hover] : coords[coords.length - 1];

 return (
 <div className=" border border-border bg-panel">
 <div className="flex items-center justify-between border-b border-border px-4 py-3">
 <div>
 <h2 className="text-sm font-semibold text-text">Chart {symbol}</h2>
 <p className="text-xs text-muted">Performa 30 hari • hover untuk detail</p>
 </div>
 <div className="text-right">
 <div className="font-num text-sm text-text">{formatNumber(active.p.value, active.p.value < 10 ? 4 : 2)}</div>
 <div className="text-[11px] text-muted">{active.p.time}</div>
 </div>
 </div>
 <div className="p-3">
 <svg
 viewBox={`0 0 ${w} ${h}`}
 className="w-full h-auto"
 onMouseLeave={() => setHover(null)}
 onMouseMove={(e) => {
 const rect = e.currentTarget.getBoundingClientRect();
 const x = ((e.clientX - rect.left) / rect.width) * w;
 const idx = Math.round(((x - pad.l) / innerW) * (points.length - 1));
 setHover(Math.max(0, Math.min(points.length - 1, idx)));
 }}
 >
 <defs>
 <linearGradient id={`g-${symbol.replace(/[^a-zA-Z0-9]/g, "")}`} x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor={color} stopOpacity="0.28" />
 <stop offset="100%" stopColor={color} stopOpacity="0" />
 </linearGradient>
 </defs>
 {[0, 0.25, 0.5, 0.75, 1].map((t) => {
 const y = pad.t + innerH * t;
 const val = max - (max - min) * t;
 return (
 <g key={t}>
 <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="var(--border)" strokeDasharray="2 4" />
 <text x={w - 6} y={y + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)" className="font-num">
 {formatNumber(val, val < 10 ? 4 : 0)}
 </text>
 </g>
 );
 })}
 <path d={area} fill={`url(#g-${symbol.replace(/[^a-zA-Z0-9]/g, "")})`} />
 <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
 {active && (
 <>
 <line x1={active.x} x2={active.x} y1={pad.t} y2={pad.t + innerH} stroke="var(--text-muted)" strokeDasharray="3 3" opacity="0.5" />
 <circle cx={active.x} cy={active.y} r="4" fill={color} stroke="var(--panel)" strokeWidth="2" />
 </>
 )}
 </svg>
 </div>
 </div>
 );
}

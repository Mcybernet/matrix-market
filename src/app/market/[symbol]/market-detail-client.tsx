"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Asset } from "@/lib/types";

type ApiResponse = { assets: Asset[]; updatedAt?: string };

function fmtPrice(asset: Asset) {
 if (asset.currency === "IDR") return `Rp ${asset.price.toLocaleString("id-ID")}`;
 return `$${asset.price.toLocaleString("en-US", { minimumFractionDigits: asset.price < 10 ? 4 : 2, maximumFractionDigits: asset.price < 10 ? 4 : 2 })}`;
}

function Chart({ data, positive }: { data: number[]; positive: boolean }) {
 if (!data || data.length < 2) return null;
 const w = 720;
 const h = 260;
 const min = Math.min(...data);
 const max = Math.max(...data);
 const range = max - min || 1;
 const pts = data.map((v, i) => {
  const x = (i / (data.length - 1)) * w;
  const y = h - ((v - min) / range) * (h - 30) - 15;
  return [x, y] as const;
 });
 const line = pts.map((p) => p.join(",")).join(" ");
 const area = `0,${h} ${line} ${w},${h}`;
 const stroke = positive ? "var(--up)" : "var(--down)";
 const fill = positive ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)";
 return (
  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[220px] sm:h-[280px]" aria-label="Price chart">
   <defs>
    <linearGradient id="chartFillDetail" x1="0" x2="0" y1="0" y2="1">
     <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
     <stop offset="100%" stopColor={stroke} stopOpacity="0" />
    </linearGradient>
   </defs>
   {[0, 1, 2, 3, 4].map((i) => {
    const y = 15 + (i / 4) * (h - 30);
    return <line key={i} x1="0" y1={y} x2={w} y2={y} stroke="var(--border)" strokeDasharray="4 4" />;
   })}
   <polygon points={area} fill="url(#chartFillDetail)" />
   <polygon points={area} fill={fill} opacity="0.25" />
   <polyline points={line} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
   {pts.map((p, i) => (
    <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 4 : 2.5} fill={stroke} />
   ))}
  </svg>
 );
}

export default function MarketDetailClient() {
 const params = useParams<{ symbol: string }>();
 const raw = typeof params?.symbol === "string" ? params.symbol : "";
 const symbol = decodeURIComponent(raw).replace(/--/g, "/");
 const [assets, setAssets] = useState<Asset[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  let active = true;
  fetch("/api/market", { cache: "no-store" })
   .then((r) => r.json())
   .then((d: ApiResponse) => {
    if (active) setAssets(d.assets || []);
   })
   .finally(() => {
    if (active) setLoading(false);
   });
  return () => {
   active = false;
  };
 }, []);

 const asset = useMemo(() => assets.find((a) => a.symbol === symbol), [assets, symbol]);
 const up = (asset?.changePercent ?? 0) >= 0;

 return (
  <div className="min-h-screen bg-bg">
   <header className="border-b border-border/80 bg-bg/85 backdrop-blur-md sticky top-0 z-40">
    <div className="mx-auto max-w-[1200px] px-4 py-4 flex items-center justify-between">
     <Link href="/#market" className="text-sm text-muted hover:text-text transition">← Back to Market</Link>
     <span className="font-mono text-sm tracking-[0.2em] text-brand">MATRIX</span>
    </div>
   </header>
   <main className="mx-auto max-w-[1200px] px-4 py-8 space-y-6">
    {loading ? (
     <div className="h-[320px] border border-border bg-panel animate-pulse" />
    ) : !asset ? (
     <div className="border border-border bg-panel p-8 text-center">
      <p className="text-text font-medium">Asset not found</p>
      <Link href="/#market" className="text-brand text-sm mt-2 inline-block">Return to market</Link>
     </div>
    ) : (
     <>
      <section className="border border-border bg-panel p-6" data-aos="fade-right">
       <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
         <p className="text-xs tracking-wide text-muted uppercase">{asset.category}</p>
         <h1 className="mt-1 text-3xl font-semibold text-text font-mono">{asset.symbol}</h1>
         <p className="text-muted mt-1">{asset.name}</p>
        </div>
        <div className="sm:text-right">
         <div className="font-num text-3xl font-semibold text-text">{fmtPrice(asset)}</div>
         <div className={`font-num text-sm mt-1 ${up ? "text-up" : "text-down"}`}>
          {up ? "+" : ""}
          {asset.change.toLocaleString("en-US", { maximumFractionDigits: 4 })} ({up ? "+" : ""}
          {asset.changePercent.toFixed(2)}%)
         </div>
         <div className="text-xs text-muted mt-2">Status: {asset.marketStatus}</div>
        </div>
       </div>
       <div className="mt-6 border border-border bg-bg/40 p-4">
        <div className="flex items-center justify-between mb-3">
         <h2 className="text-sm font-medium text-text">Price Trend</h2>
         <span className="text-xs text-muted">Recent data points</span>
        </div>
        <Chart data={asset.sparkline} positive={up} />
       </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-aos="fade-up">
       {[
        { label: "Open", value: asset.open },
        { label: "High", value: asset.high },
        { label: "Low", value: asset.low },
        { label: "Prev Close", value: asset.prevClose },
       ].map((s) => (
        <div key={s.label} className="border border-border bg-panel p-4">
         <div className="text-xs text-muted uppercase tracking-wide">{s.label}</div>
         <div className="mt-2 font-num text-xl text-text">{s.value.toLocaleString("en-US", { maximumFractionDigits: 4 })}</div>
        </div>
       ))}
      </section>

      <section className="border border-border bg-panel p-5" data-aos="fade-left">
       <h2 className="text-sm font-semibold text-text">About this asset</h2>
       <p className="mt-2 text-sm leading-7 text-muted">
        {asset.name} is tracked in the {asset.category.toLowerCase()} category. Prices shown are for informational reference only and may be delayed or sourced from public/open APIs. Always verify with official sources before making financial decisions.
       </p>
      </section>
     </>
    )}
   </main>
  </div>
 );
}
"use client";

import Link from "next/link";
import { formatPercent } from "@/lib/utils";
import { timeAgo } from "@/lib/format";
import type { Asset } from "@/lib/types";
import { Sparkline } from "./sparkline";

function ChevronUp() {
 return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6" /></svg>;
}
function ChevronDown() {
 return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;
}
function StarIcon({ filled }: { filled?: boolean }) {
 return <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}

function displayPrice(asset: Asset) {
 if (asset.currency === "IDR") return `Rp ${asset.price.toLocaleString("id-ID")}`;
 return `$${asset.price.toLocaleString("en-US", { minimumFractionDigits: asset.price < 10 ? 4 : 2, maximumFractionDigits: asset.price < 10 ? 4 : 2 })}`;
}

export function MarketCard({ asset, watched, onToggleWatch, globalUpdatedAt }: { asset: Asset; watched?: boolean; onToggleWatch?: (symbol: string) => void; globalUpdatedAt?: string | null }) {
 const up = asset.changePercent >= 0;
 const fresh = asset.updatedAt || globalUpdatedAt;
 return (
  <div className="relative">
   {onToggleWatch && (
    <button
     onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWatch(asset.symbol); }}
     className={`absolute top-3 right-3 z-10 p-1 border border-border bg-panel/90 transition hover:border-brand/40 ${watched ? "text-warn" : "text-muted hover:text-text"}`}
     aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
     title={watched ? "Remove from watchlist" : "Add to watchlist"}
    >
     <StarIcon filled={watched} />
    </button>
   )}
   <Link href={`/market/${encodeURIComponent(asset.symbol.replace(/\//g, "--"))}`} className="block">
    <article data-aos="zoom-in" className="surface-transition card-glow group relative border border-border bg-panel p-4 hover:-translate-y-1 hover:border-brand/50 hover:bg-panel-elev">
     <div className="absolute top-0 left-0 h-[2px] w-0 bg-brand transition-all duration-300 group-hover:w-full" aria-hidden="true" />
     <div className="mb-3 flex items-start justify-between gap-3 pr-8">
      <div>
       <div className="text-xs text-muted">{asset.category}</div>
       <div className="font-mono text-sm font-semibold tracking-wide text-text">{asset.symbol}</div>
      </div>
      <span className={up ? "bg-up/10 text-up px-2 py-0.5 text-[11px] font-medium" : "bg-down/10 text-down px-2 py-0.5 text-[11px] font-medium"}>{asset.marketStatus}</span>
     </div>

     <div className="text-sm text-muted">{asset.name}</div>
     <div className="mt-2 flex items-end justify-between gap-3">
      <div>
       <div className="font-num text-2xl font-semibold text-text">{displayPrice(asset)}</div>
       <div className={`mt-1 inline-flex items-center gap-1 font-num text-sm ${up ? "text-up" : "text-down"}`}>
        {up ? <ChevronUp /> : <ChevronDown />}
        <span>{formatPercent(asset.changePercent)}</span>
       </div>
      </div>
      <Sparkline data={asset.sparkline} positive={up} className="shrink-0" />
     </div>

     <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-[11px] text-muted">
      <div><div>O</div><div className="font-num text-text/80">{asset.open.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div></div>
      <div><div>H</div><div className="font-num text-text/80">{asset.high.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div></div>
      <div><div>L</div><div className="font-num text-text/80">{asset.low.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div></div>
     </div>
     <div className="mt-2 text-[10px] text-muted font-num">Updated {timeAgo(fresh)}</div>
    </article>
   </Link>
  </div>
 );
}

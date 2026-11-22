import { formatPercent } from "@/lib/utils";
import type { Asset } from "@/lib/types";

function ChevronUp() {
 return (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="m18 15-6-6-6 6" />
 </svg>
 );
}
function ChevronDown() {
 return (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="m6 9 6 6 6-6" />
 </svg>
 );
}

function displayPrice(asset: Asset) {
 if (asset.currency === "IDR") return `Rp ${asset.price.toLocaleString("id-ID")}`;
 return `$${asset.price.toLocaleString("en-US", {
 minimumFractionDigits: asset.price < 10 ? 4 : 2,
 maximumFractionDigits: asset.price < 10 ? 4 : 2,
 })}`;
}

export function MarketCard({ asset }: { asset: Asset }) {
 const up = asset.changePercent >= 0;
 return (
 <article
 data-aos="zoom-in"
 className="surface-transition card-glow group border border-border bg-panel p-5 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
 >
 <div className="flex items-start justify-between gap-3">
 <div>
 <h3 className="text-sm font-semibold text-text">{asset.name}</h3>
 <p className="mt-0.5 text-xs text-muted">{asset.symbol} • {asset.category}</p>
 </div>
 <span className="bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand">
 {asset.marketStatus}
 </span>
 </div>

 <div className="mt-5 flex items-end justify-between gap-4">
 <div>
 <div className="font-num text-2xl font-semibold tracking-tight text-text">{displayPrice(asset)}</div>
 <div className={`mt-2 inline-flex items-center gap-1 px-2 py-1 font-num text-xs ${up ? "bg-up/10 text-up" : "bg-down/10 text-down"}`}>
 {up ? <ChevronUp /> : <ChevronDown />}
 {formatPercent(asset.changePercent)}
 </div>
 </div>
 <div className="text-right text-[11px] text-muted">
 <div>Prev: <span className="font-num text-text">{asset.prevClose.toLocaleString("en-US")}</span></div>
 <div>Update: <span className="font-num text-text">{new Date(asset.updatedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span></div>
 </div>
 </div>
 </article>
 );
}

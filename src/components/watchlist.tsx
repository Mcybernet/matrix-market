"use client";

function Star({ size = 14, fill = "none", className }: { size?: number; fill?: string; className?: string }) {
 return (
 <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 );
}
import { formatPercent } from "@/lib/utils";
import type { Asset } from "@/lib/types";

export function Watchlist({
 assets,
 favorites,
 onToggle,
 onSelect,
 selectedSymbol,
}: {
 assets: Asset[];
 favorites: string[];
 onToggle: (symbol: string) => void;
 onSelect: (symbol: string) => void;
 selectedSymbol: string;
}) {
 const items = assets.filter((a) => favorites.includes(a.symbol));
 return (
 <div className=" border border-border bg-panel">
 <div className="flex items-center justify-between border-b border-border px-4 py-3">
 <h2 className="text-sm font-semibold text-text">Watchlist</h2>
 <span className="text-xs text-muted">{items.length} aset</span>
 </div>
 <div className="p-2">
 {items.length === 0 ? (
 <p className="px-2 py-6 text-center text-xs text-muted">
 Belum ada favorit. Klik bintang di tabel untuk menambah.
 </p>
 ) : (
 <div className="space-y-1">
 {items.map((asset) => {
 const up = asset.changePercent >= 0;
 const selected = asset.symbol === selectedSymbol;
 return (
 <div
 key={asset.symbol}
 className={`flex items-center gap-2 px-2 py-2 ${
 selected ? "bg-panel-elev" : "hover:bg-panel-elev/50"
 }`}
 >
 <button
 onClick={() => onToggle(asset.symbol)}
 className="text-warn"
 aria-label={`Hapus ${asset.symbol} dari watchlist`}
 >
 <Star size={14} fill="currentColor" />
 </button>
 <button
 onClick={() => onSelect(asset.symbol)}
 className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left"
 >
 <div className="min-w-0">
 <div className="text-sm font-medium text-text">{asset.symbol}</div>
 <div className="truncate text-[11px] text-muted">{asset.name}</div>
 </div>
 <div className={`font-num text-xs ${up ? "text-up" : "text-down"}`}>
 {formatPercent(asset.changePercent)}
 </div>
 </button>
 </div>
 );
 })}
 </div>
 )}
 </div>
 </div>
 );
}

"use client";

function Star({ size = 14, fill = "none", className }: { size?: number; fill?: string; className?: string }) {
 return (
 <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 );
}
import { formatPercent } from "@/lib/utils";
import type { Asset, AssetCategory } from "@/lib/types";

const CATEGORIES: Array<"Semua" | AssetCategory> = ["Semua", "Komoditas", "Forex", "Indeks", "Crypto"];

function displayPrice(asset: Asset) {
 if (asset.currency === "IDR") return `Rp ${asset.price.toLocaleString("id-ID")}`;
 if (asset.currency === "USD") return `$${asset.price.toLocaleString("en-US", { minimumFractionDigits: asset.price < 10 ? 4 : 2, maximumFractionDigits: asset.price < 10 ? 4 : 2 })}`;
 return `${asset.price.toLocaleString("en-US")} ${asset.currency}`;
}

export function AssetTable({
 assets,
 category,
 onCategoryChange,
 favorites,
 onToggleFavorite,
 selectedSymbol,
 onSelect,
}: {
 assets: Asset[];
 category: "Semua" | AssetCategory;
 onCategoryChange: (c: "Semua" | AssetCategory) => void;
 favorites: string[];
 onToggleFavorite: (symbol: string) => void;
 selectedSymbol: string;
 onSelect: (symbol: string) => void;
}) {
 return (
 <div className=" border border-border bg-panel">
 <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
 <h2 className="text-sm font-semibold text-text">Daftar Aset</h2>
 <div className="flex flex-wrap gap-1.5">
 {CATEGORIES.map((c) => (
 <button
 key={c}
 onClick={() => onCategoryChange(c)}
 className={` px-2.5 py-1.5 text-xs transition ${
 category === c
 ? "bg-brand text-white"
 : "border border-border bg-bg text-muted hover:text-text"
 }`}
 >
 {c}
 </button>
 ))}
 </div>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full min-w-[640px] text-xs">
 <thead className="text-[11px] uppercase tracking-wide text-muted">
 <tr className="border-b border-border">
 <th className="px-4 py-2 text-left font-medium">Aset</th>
 <th className="px-4 py-2 text-right font-medium">Harga</th>
 <th className="px-4 py-2 text-right font-medium">Perubahan</th>
 <th className="px-4 py-2 text-right font-medium">High</th>
 <th className="px-4 py-2 text-right font-medium">Low</th>
 <th className="px-4 py-2 text-right font-medium">Status</th>
 </tr>
 </thead>
 <tbody>
 {assets.map((asset) => {
 const up = asset.changePercent >= 0;
 const fav = favorites.includes(asset.symbol);
 const selected = selectedSymbol === asset.symbol;
 return (
 <tr
 key={asset.symbol}
 onClick={() => onSelect(asset.symbol)}
 className={`cursor-pointer border-b border-border/70 last:border-0 ${
 selected ? "bg-panel-elev" : "hover:bg-panel-elev/40"
 }`}
 >
 <td className="px-4 py-2.5">
 <div className="flex items-center gap-2">
 <button
 onClick={(e) => {
 e.stopPropagation();
 onToggleFavorite(asset.symbol);
 }}
 className={fav ? "text-warn" : "text-muted hover:text-warn"}
 aria-label={fav ? "Hapus favorit" : "Tambah favorit"}
 >
 <Star size={14} fill={fav ? "currentColor" : "none"} />
 </button>
 <div>
 <div className="font-medium text-text">{asset.symbol}</div>
 <div className="text-[11px] text-muted">{asset.name}</div>
 </div>
 </div>
 </td>
 <td className="px-4 py-2.5 text-right font-num text-text">{displayPrice(asset)}</td>
 <td className={`px-4 py-2.5 text-right font-num ${up ? "text-up" : "text-down"}`}>
 {up ? "▲" : "▼"} {formatPercent(asset.changePercent)}
 </td>
 <td className="px-4 py-2.5 text-right font-num text-muted">
 {asset.high.toLocaleString("en-US")}
 </td>
 <td className="px-4 py-2.5 text-right font-num text-muted">
 {asset.low.toLocaleString("en-US")}
 </td>
 <td className="px-4 py-2.5 text-right text-[11px] text-muted">{asset.marketStatus}</td>
 </tr>
 );
 })}
 {assets.length === 0 && (
 <tr>
 <td colSpan={6} className="px-4 py-8 text-center text-xs text-muted">
 Tidak ada aset yang cocok.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 );
}

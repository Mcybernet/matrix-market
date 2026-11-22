"use client";

import { formatPercent, formatPrice } from "@/lib/utils";
import type { Asset } from "@/lib/types";

export function TickerBar({ assets }: { assets: Asset[] }) {
 const items = [...assets, ...assets];
 return (
 <div className="border-b border-border bg-panel/60 overflow-hidden">
 <div className="animate-ticker flex w-max min-w-full gap-6 px-4 py-2">
 {items.map((asset, i) => {
 const up = asset.changePercent >= 0;
 return (
 <div
 key={`${asset.symbol}-${i}`}
 className="flex items-center gap-2 text-xs whitespace-nowrap"
 >
 <span className="font-medium text-text">{asset.symbol}</span>
 <span className="font-num text-muted">
 {asset.currency === "IDR" && asset.price > 1000
 ? asset.price.toLocaleString("en-US", { maximumFractionDigits: 2 })
 : formatPrice(asset.price, asset.currency === "IDR" ? "USD" : asset.currency).replace("$", asset.currency === "USD" ? "$" : "")}
 </span>
 <span className={up ? "font-num text-up" : "font-num text-down"}>
 {formatPercent(asset.changePercent)}
 </span>
 </div>
 );
 })}
 </div>
 </div>
 );
}

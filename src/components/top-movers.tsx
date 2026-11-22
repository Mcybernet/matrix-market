import { formatPercent } from "@/lib/utils";
import type { Asset } from "@/lib/types";

export function TopMovers({ assets }: { assets: Asset[] }) {
 const sorted = [...assets].sort((a, b) => b.changePercent - a.changePercent);
 const gainers = sorted.filter((a) => a.changePercent > 0).slice(0, 3);
 const losers = sorted.filter((a) => a.changePercent < 0).slice(-3).reverse();

 const Row = ({ asset }: { asset: Asset }) => {
 const up = asset.changePercent >= 0;
 return (
 <div className="flex items-center justify-between py-2">
 <div>
 <div className="text-sm font-medium text-text">{asset.symbol}</div>
 <div className="text-[11px] text-muted">{asset.name}</div>
 </div>
 <div className={`font-num text-sm ${up ? "text-up" : "text-down"}`}>
 {up ? "▲" : "▼"} {formatPercent(asset.changePercent)}
 </div>
 </div>
 );
 };

 return (
 <div className=" border border-border bg-panel">
 <div className="border-b border-border px-4 py-3">
 <h2 className="text-sm font-semibold text-text">Top Movers</h2>
 </div>
 <div className="grid gap-0 sm:grid-cols-2">
 <div className="border-b border-border px-4 py-2 sm:border-r sm:border-b-0">
 <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-up">Gainers</div>
 <div className="divide-y divide-border">
 {gainers.map((a) => <Row key={a.symbol} asset={a} />)}
 </div>
 </div>
 <div className="px-4 py-2">
 <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-down">Losers</div>
 <div className="divide-y divide-border">
 {losers.map((a) => <Row key={a.symbol} asset={a} />)}
 </div>
 </div>
 </div>
 </div>
 );
}

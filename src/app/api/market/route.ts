import { NextResponse } from "next/server";
import type { Asset, AssetCategory } from "@/lib/types";

type RawAsset = {
 symbol: string;
 name: string;
 category: AssetCategory;
 currency: string;
 unit?: string;
 marketStatus: Asset["marketStatus"];
};

const ASSET_DEFS: RawAsset[] = [
 { symbol: "XAU/USD", name: "Emas (XAU/USD)", category: "Komoditas", currency: "USD", unit: "/oz", marketStatus: "24/5" },
 { symbol: "XAG/USD", name: "Perak (XAG/USD)", category: "Komoditas", currency: "USD", unit: "/oz", marketStatus: "24/5" },
 { symbol: "WTI", name: "Minyak WTI", category: "Komoditas", currency: "USD", unit: "/bbl", marketStatus: "24/5" },
 { symbol: "USD/IDR", name: "Dolar AS / Rupiah", category: "Forex", currency: "IDR", marketStatus: "24/5" },
 { symbol: "EUR/USD", name: "Euro / Dolar AS", category: "Forex", currency: "USD", marketStatus: "24/5" },
 { symbol: "IHSG", name: "IHSG (IDX Composite)", category: "Indeks", currency: "IDR", marketStatus: "Closed" },
 { symbol: "SPX", name: "S&P 500", category: "Indeks", currency: "USD", marketStatus: "Closed" },
 { symbol: "BTC/USD", name: "Bitcoin", category: "Crypto", currency: "USD", marketStatus: "24/7" },
 { symbol: "ETH/USD", name: "Ethereum", category: "Crypto", currency: "USD", marketStatus: "24/7" },
];

async function fetchFrankfurterRate(base: string, quote: string) {
 const url = `https://api.frankfurter.dev/v2/rate/${base.toLowerCase()}/${quote.toLowerCase()}`;
 const res = await fetch(url, { next: { revalidate: 300 } });
 if (!res.ok) throw new Error(`Frankfurter ${base}/${quote} failed`);
 const data = await res.json();
 return { rate: Number(data.rate), date: String(data.date) };
}

async function fetchFrankfurterChange(base: string, quote: string) {
 // Get recent series to compute change from previous available day
 const end = new Date();
 const start = new Date();
 start.setDate(end.getDate() - 10);
 const fmt = (d: Date) => d.toISOString().slice(0, 10);
 const url = `https://api.frankfurter.dev/v2/rates?base=${base.toLowerCase()}&quotes=${quote.toLowerCase()}&from=${fmt(start)}&to=${fmt(end)}`;
 const res = await fetch(url, { next: { revalidate: 300 } });
 if (!res.ok) throw new Error(`Frankfurter series ${base}/${quote} failed`);
 const data = await res.json();
 const raw = Array.isArray(data) ? data : (data.rates || []);
 const rows = raw as Array<{ date: string; rate: number }>;
 rows.sort((a, b) => a.date.localeCompare(b.date));
 const last = rows[rows.length - 1];
 const prev = rows[rows.length - 2] ?? last;
 const price = Number(last?.rate ?? 0);
 const prevClose = Number(prev?.rate ?? price);
 const change = price - prevClose;
 const changePercent = prevClose ? (change / prevClose) * 100 : 0;
 return { price, prevClose, change, changePercent, date: last?.date ?? fmt(end) };
}

async function fetchYahoo(symbol: string) {
 const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
 const res = await fetch(url, {
 next: { revalidate: 300 },
 headers: { "User-Agent": "Mozilla/5.0" },
 });
 if (!res.ok) throw new Error(`Yahoo ${symbol} failed`);
 const data = await res.json();
 const meta = data?.chart?.result?.[0]?.meta;
 if (!meta) throw new Error(`Yahoo ${symbol} no meta`);
 const price = Number(meta.regularMarketPrice ?? 0);
 const prevClose = Number(meta.chartPreviousClose ?? meta.previousClose ?? price);
 const change = price - prevClose;
 const changePercent = prevClose ? (change / prevClose) * 100 : 0;
 return { price, prevClose, change, changePercent, high: Number(meta.regularMarketDayHigh ?? price), low: Number(meta.regularMarketDayLow ?? price), open: Number(meta.regularMarketOpen ?? price) };
}

function toAsset(def: RawAsset, values: Partial<Asset> & Pick<Asset, "price" | "prevClose" | "change" | "changePercent">): Asset {
 const price = values.price;
 return {
 symbol: def.symbol,
 name: def.name,
 category: def.category,
 price,
 change: values.change,
 changePercent: values.changePercent,
 currency: def.currency,
 unit: def.unit,
 open: values.open ?? price,
 high: values.high ?? price,
 low: values.low ?? price,
 prevClose: values.prevClose,
 marketStatus: def.marketStatus,
 updatedAt: values.updatedAt ?? new Date().toISOString(),
 sparkline: [values.prevClose, price],
 };
}

export async function GET() {
 const updatedAt = new Date().toISOString();
 const results = await Promise.allSettled(
 ASSET_DEFS.map(async (def) => {
 if (def.symbol === "XAU/USD") {
 const v = await fetchFrankfurterChange("XAU", "USD");
 return toAsset(def, { ...v, updatedAt });
 }
 if (def.symbol === "XAG/USD") {
 const v = await fetchFrankfurterChange("XAG", "USD");
 return toAsset(def, { ...v, updatedAt });
 }
 if (def.symbol === "USD/IDR") {
 const v = await fetchFrankfurterChange("USD", "IDR");
 return toAsset(def, { ...v, updatedAt });
 }
 if (def.symbol === "EUR/USD") {
 const v = await fetchFrankfurterChange("EUR", "USD");
 return toAsset(def, { ...v, updatedAt });
 }
 if (def.symbol === "BTC/USD") {
 const v = await fetchFrankfurterChange("BTC", "USD");
 return toAsset(def, { ...v, updatedAt });
 }
 if (def.symbol === "ETH/USD") {
 const v = await fetchFrankfurterChange("ETH", "USD");
 return toAsset(def, { ...v, updatedAt });
 }
 const yahooMap: Record<string, string> = { WTI: "CL=F", IHSG: "^JKSE", SPX: "^GSPC" };
 if (yahooMap[def.symbol]) {
 const v = await fetchYahoo(yahooMap[def.symbol]);
 return toAsset(def, { ...v, updatedAt });
 }
 throw new Error("Unknown symbol");
 })
 );

 const assets: Asset[] = [];
 const errors: string[] = [];
 results.forEach((r, i) => {
 if (r.status === "fulfilled") assets.push(r.value);
 else errors.push(`${ASSET_DEFS[i].symbol}: ${r.reason instanceof Error ? r.reason.message : "error"}`);
 });

 return NextResponse.json({
 assets,
 updatedAt,
 sources: [
 { name: "Frankfurter", url: "https://frankfurter.dev/", note: "Open-source API, data referensi bank sentral/sumber resmi" },
 { name: "Yahoo Finance chart endpoint", url: "https://query1.finance.yahoo.com/", note: "Fallback unofficial untuk minyak/indeks" },
 ],
 errors,
 }, {
 headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
 });
}

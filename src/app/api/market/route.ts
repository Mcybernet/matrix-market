import { NextResponse } from "next/server";
import type { Asset, AssetCategory, SourceStatus } from "@/lib/types";

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

async function fetchFrankfurterChange(base: string, quote: string) {
 const end = new Date();
 const start = new Date();
 start.setDate(end.getDate() - 14);
 const fmt = (d: Date) => d.toISOString().slice(0, 10);
 const url = `https://api.frankfurter.dev/v1/${fmt(start)}..${fmt(end)}?base=${base}&symbols=${quote}`;
 const res = await fetch(url, { next: { revalidate: 300 } });
 if (!res.ok) throw new Error(`Frankfurter ${base}/${quote} failed`);
 const data = await res.json();
 const rates = data?.rates || {};
 const rows = Object.entries(rates)
  .map(([date, v]: [string, any]) => ({ date, rate: Number(v?.[quote] ?? 0) }))
  .filter((r) => r.rate > 0)
  .sort((a, b) => a.date.localeCompare(b.date));
 if (rows.length < 1) throw new Error(`Frankfurter ${base}/${quote} no data`);
 const last = rows[rows.length - 1];
 const prev = rows[rows.length - 2] ?? last;
 const price = last.rate;
 const prevClose = prev.rate;
 const change = price - prevClose;
 const changePercent = prevClose ? (change / prevClose) * 100 : 0;
 const sparkline = rows.slice(-10).map((r) => r.rate);
 return { price, prevClose, change, changePercent, date: last.date, sparkline };
}

async function fetchYahoo(symbol: string) {
 const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1mo`;
 const res = await fetch(url, {
  next: { revalidate: 300 },
  headers: { "User-Agent": "Mozilla/5.0" },
 });
 if (!res.ok) throw new Error(`Yahoo ${symbol} failed`);
 const data = await res.json();
 const result = data?.chart?.result?.[0];
 const meta = result?.meta;
 if (!meta) throw new Error(`Yahoo ${symbol} no meta`);
 const closes = (result?.indicators?.quote?.[0]?.close || [])
  .filter((v: unknown) => typeof v === "number" && Number.isFinite(v)) as number[];
 const price = Number(meta.regularMarketPrice ?? closes[closes.length - 1] ?? 0);
 const prevClose = Number(meta.chartPreviousClose ?? meta.previousClose ?? closes[closes.length - 2] ?? price);
 const change = price - prevClose;
 const changePercent = prevClose ? (change / prevClose) * 100 : 0;
 const sparkline = closes.slice(-10);
 return {
  price,
  prevClose,
  change,
  changePercent,
  high: Number(meta.regularMarketDayHigh ?? price),
  low: Number(meta.regularMarketDayLow ?? price),
  open: Number(meta.regularMarketOpen ?? price),
  sparkline: sparkline.length ? sparkline : [prevClose, price],
 };
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
  sparkline: values.sparkline?.length ? values.sparkline : [values.prevClose, price],
 };
}

export async function GET() {
 const updatedAt = new Date().toISOString();
 const sourceStats: Record<string, { ok: number; err: number }> = {
  Frankfurter: { ok: 0, err: 0 },
  "Yahoo Finance": { ok: 0, err: 0 },
 };

 const results = await Promise.allSettled(
  ASSET_DEFS.map(async (def) => {
   const fxMap: Record<string, [string, string]> = {
    "XAU/USD": ["XAU", "USD"],
    "XAG/USD": ["XAG", "USD"],
    "USD/IDR": ["USD", "IDR"],
    "EUR/USD": ["EUR", "USD"],
    "BTC/USD": ["BTC", "USD"],
    "ETH/USD": ["ETH", "USD"],
   };
   if (fxMap[def.symbol]) {
    const [base, quote] = fxMap[def.symbol];
    const v = await fetchFrankfurterChange(base, quote);
    sourceStats.Frankfurter.ok++;
    return toAsset(def, { ...v, updatedAt });
   }
   const yahooMap: Record<string, string> = { WTI: "CL=F", IHSG: "^JKSE", SPX: "^GSPC" };
   if (yahooMap[def.symbol]) {
    const v = await fetchYahoo(yahooMap[def.symbol]);
    sourceStats["Yahoo Finance"].ok++;
    return toAsset(def, { ...v, updatedAt });
   }
   throw new Error("Unknown symbol");
  })
 );

 const assets: Asset[] = [];
 const errors: string[] = [];
 results.forEach((r, i) => {
  if (r.status === "fulfilled") assets.push(r.value);
  else {
   const def = ASSET_DEFS[i];
   const isYahoo = ["WTI", "IHSG", "SPX"].includes(def.symbol);
   if (isYahoo) sourceStats["Yahoo Finance"].err++;
   else sourceStats.Frankfurter.err++;
   errors.push(`${def.symbol}: ${r.reason instanceof Error ? r.reason.message : "error"}`);
  }
 });

 const sourceStatuses: SourceStatus[] = [
  {
   name: "Frankfurter",
   url: "https://frankfurter.dev/",
   note: "Open-source currency/metal/crypto reference data",
   status: sourceStats.Frankfurter.err > 0 ? (sourceStats.Frankfurter.ok > 0 ? "fallback" : "error") : "ok",
   lastUpdated: updatedAt,
   itemCount: sourceStats.Frankfurter.ok,
  },
  {
   name: "Yahoo Finance",
   url: "https://query1.finance.yahoo.com/",
   note: "Public chart endpoint fallback for oil and indices",
   status: sourceStats["Yahoo Finance"].err > 0 ? (sourceStats["Yahoo Finance"].ok > 0 ? "fallback" : "error") : "ok",
   lastUpdated: updatedAt,
   itemCount: sourceStats["Yahoo Finance"].ok,
  },
 ];

 return NextResponse.json(
  {
   assets,
   updatedAt,
   sources: sourceStatuses,
   errors,
   cacheWindowSeconds: 300,
  },
  {
   headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  }
 );
}
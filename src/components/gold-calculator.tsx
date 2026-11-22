"use client";

import { useMemo, useState } from "react";
import { GOLD_IDR_PER_GRAM } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export function GoldCalculator({ xauUsd }: { xauUsd: number }) {
 const [amount, setAmount] = useState("10");
 const [unit, setUnit] = useState<"gram" | "oz">("gram");
 const [currency, setCurrency] = useState<"IDR" | "USD">("IDR");

 const result = useMemo(() => {
 const n = Number(amount);
 if (!Number.isFinite(n) || n < 0) return 0;
 const grams = unit === "oz" ? n * 31.1034768 : n;
 if (currency === "IDR") return grams * GOLD_IDR_PER_GRAM;
 const oz = grams / 31.1034768;
 return oz * xauUsd;
 }, [amount, unit, currency, xauUsd]);

 return (
 <div className=" border border-border bg-panel">
 <div className="border-b border-border px-4 py-3">
 <h2 className="text-sm font-semibold text-text">Kalkulator Emas</h2>
 <p className="text-xs text-muted">Estimasi cepat berdasarkan harga referensi</p>
 </div>
 <div className="space-y-3 p-4">
 <div className="grid grid-cols-2 gap-2">
 <label className="text-xs text-muted">
 Jumlah
 <input
 type="number"
 min="0"
 value={amount}
 onChange={(e) => setAmount(e.target.value)}
 className="mt-1 w-full border border-border bg-bg px-3 py-2 font-num text-sm text-text outline-none focus:border-brand"
 />
 </label>
 <label className="text-xs text-muted">
 Satuan
 <select
 value={unit}
 onChange={(e) => setUnit(e.target.value as "gram" | "oz")}
 className="mt-1 w-full border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-brand"
 >
 <option value="gram">Gram</option>
 <option value="oz">Troy oz</option>
 </select>
 </label>
 </div>
 <label className="block text-xs text-muted">
 Mata uang
 <select
 value={currency}
 onChange={(e) => setCurrency(e.target.value as "IDR" | "USD")}
 className="mt-1 w-full border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-brand"
 >
 <option value="IDR">IDR</option>
 <option value="USD">USD</option>
 </select>
 </label>
 <div className=" border border-border bg-bg px-3 py-3">
 <div className="text-[11px] uppercase tracking-wide text-muted">Estimasi nilai</div>
 <div className="font-num text-xl font-semibold text-text">
 {currency === "IDR" ? `Rp ${formatNumber(result, 0)}` : `$${formatNumber(result, 2)}`}
 </div>
 <div className="mt-1 text-[11px] text-muted">
 Ref: XAU/USD {formatNumber(xauUsd, 2)} • Emas IDR {formatNumber(GOLD_IDR_PER_GRAM, 0)}/gram
 </div>
 </div>
 </div>
 </div>
 );
}

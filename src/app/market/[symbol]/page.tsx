import type { Metadata } from "next";
import { Suspense } from "react";
import MarketDetailClient from "./market-detail-client";

type Props = { params: Promise<{ symbol: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { symbol } = await params;
 const s = decodeURIComponent(symbol).replace(/--/g, "/");
 return {
  title: `${s} | MATRIX`,
  description: `Price, trend, and key stats for ${s} on MATRIX.`,
 };
}

export default function MarketDetailPage() {
 return (
  <Suspense fallback={<div className="min-h-screen bg-bg"><div className="mx-auto max-w-[1200px] px-4 py-8"><div className="h-[320px] border border-border bg-panel animate-pulse" /></div></div>}>
   <MarketDetailClient />
  </Suspense>
 );
}

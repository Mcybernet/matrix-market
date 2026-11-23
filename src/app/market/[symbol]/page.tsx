import { Suspense } from "react";
import MarketDetailClient from "./market-detail-client";

export default function MarketDetailPage() {
 return (
  <Suspense fallback={<div className="min-h-screen bg-bg"><div className="mx-auto max-w-[1200px] px-4 py-8"><div className="h-[320px] border border-border bg-panel animate-pulse" /></div></div>}>
   <MarketDetailClient />
  </Suspense>
 );
}
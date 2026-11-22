"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { NEWS } from "@/lib/mock-data";
import type { Asset, AssetCategory } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { Header } from "./header";
import { MarketCard } from "./market-card";
import { NewsFeed } from "./news-feed";
import { TickerBar } from "./ticker-bar";

type ApiResponse = {
 assets: Asset[];
 updatedAt: string;
 sources?: Array<{ name: string; url: string; note: string }>;
 errors?: string[];
};

export function Dashboard() {
 const { t } = useI18n();
 const [query, setQuery] = useState("");
 const [category, setCategory] = useState<"Semua" | AssetCategory>("Semua");
 const [assets, setAssets] = useState<Asset[]>([]);
 const [updatedAt, setUpdatedAt] = useState<string | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [showSources, setShowSources] = useState(false);
 const [showMarket, setShowMarket] = useState(true);

 const CATEGORIES: Array<{ key: "Semua" | AssetCategory; label: string }> = [
 { key: "Semua", label: t("all") },
 { key: "Komoditas", label: t("commodities") },
 { key: "Forex", label: t("forex") },
 { key: "Indeks", label: t("indices") },
 { key: "Crypto", label: t("crypto") },
 ];

 useEffect(() => {
 let active = true;
 async function load() {
 try {
 setLoading(true);
 const res = await fetch("/api/market", { cache: "no-store" });
 if (!res.ok) throw new Error("Gagal memuat data market");
 const data = (await res.json()) as ApiResponse;
 if (!active) return;
 setAssets(data.assets || []);
 setUpdatedAt(data.updatedAt || null);
 setError(data.errors?.length ? `${t("errorPartial")} ${data.errors.length} ${t("assets")}` : null);
 } catch (e) {
 if (!active) return;
 setError(e instanceof Error ? e.message : "Gagal memuat data");
 } finally {
 if (active) setLoading(false);
 }
 }
 load();
 return () => { active = false; };
 }, [t]);

 const filtered = useMemo(() => {
 const q = query.trim().toLowerCase();
 return assets.filter((a) => {
 const matchCategory = category === "Semua" || a.category === category;
 const matchQuery =
 !q || a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
 return matchCategory && matchQuery;
 });
 }, [assets, query, category]);

 const stats = [
 { label: t("statsAssets"), value: assets.length ? String(assets.length) : "9" },
 { label: t("statsCategories"), value: "4" },
 { label: t("statsSources"), value: "2" },
 { label: t("statsRefresh"), value: t("minutes") },
 ];

 const insights = [
 { title: t("insight1Title"), desc: t("insight1Desc") },
 { title: t("insight2Title"), desc: t("insight2Desc") },
 { title: t("insight3Title"), desc: t("insight3Desc") },
 ];

 const learns = [
 { title: t("learn1Title"), desc: t("learn1Desc") },
 { title: t("learn2Title"), desc: t("learn2Desc") },
 { title: t("learn3Title"), desc: t("learn3Desc") },
 ];

 return (
 <div className="min-h-screen bg-bg">
 <Header query={query} onQueryChange={setQuery} />
 <TickerBar assets={assets} />

 <main className="mx-auto max-w-[1200px] space-y-12 px-4 py-8">
 <section className="bg-hero-gradient relative overflow-hidden border border-border p-6 sm:p-8" data-aos="fade-right" data-aos-duration="700">
 <div className="absolute top-0 left-0 h-1 w-24 bg-brand" aria-hidden="true" />
 <div className="grid items-center gap-8 lg:grid-cols-2">
 <div className="space-y-4">
 <p className="inline-flex border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-medium tracking-wide text-brand uppercase">
 {t("heroBadge")}
 </p>
 <div>
 <p className="font-mono text-sm tracking-[0.25em] text-brand">MATRIX</p>
 <h1 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight text-text sm:text-5xl">
 {t("heroTitle")}
 </h1>
 </div>
 <p className="max-w-xl text-sm leading-7 text-muted sm:text-base">
 {t("heroDesc")}
 </p>
 <p className="text-xs tracking-wide text-muted uppercase">{t("tagline")}</p>
 <div className="flex flex-wrap gap-3 pt-2">
 <a href="#market" className="surface-transition bg-brand px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 hover:-translate-y-0.5">
 {t("heroCta")}
 </a>
 <a href="#berita" className="surface-transition border border-border bg-panel px-5 py-2.5 text-sm font-medium text-text hover:bg-panel-elev hover:border-brand/40 hover:-translate-y-0.5">
 {t("heroCta2")}
 </a>
 </div>
 </div>
 <div className="relative h-[240px] overflow-hidden border border-border sm:h-[320px]" data-aos="fade-left" data-aos-delay="150">
 <Image
 src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"
 alt="Financial market charts"
 fill
 className="object-cover transition duration-500 hover:scale-[1.02]"
 sizes="(max-width: 1024px) 100vw, 50vw"
 priority
 />
 <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
 <div className="absolute bottom-0 left-0 h-1 w-full bg-brand/60" aria-hidden="true" />
 </div>
 </div>
 </section>

 <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 {stats.map((s, i) => (
 <div key={s.label} data-aos="fade-up" data-aos-delay={i * 80} className="surface-transition border border-border border-t-2 border-t-brand/50 bg-panel p-4 hover:-translate-y-1 hover:border-brand/40">
 <div className="text-xs tracking-wide text-muted uppercase">{s.label}</div>
 <div className="mt-2 font-num text-2xl font-semibold text-text">{s.value}</div>
 </div>
 ))}
 </section>

 <section id="market" className="space-y-4 scroll-mt-24" data-aos="fade-left" data-aos-duration="650">
 <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
 <div>
 <h2 className="text-2xl font-semibold text-text">{t("marketTitle")}</h2>
 <p className="text-sm text-muted">{t("marketDesc")}</p>
 </div>
 <div className="flex items-center gap-3 text-xs text-muted font-num">
 <span>{loading ? t("loading") : updatedAt ? `${t("update")}: ${new Date(updatedAt).toLocaleString()}` : `${t("update")}: -`}</span>
 <button
 onClick={() => setShowMarket((v) => !v)}
 className="font-sans font-medium text-brand hover:opacity-80 transition"
 >
 {showMarket ? t("hide") : t("show")}
 </button>
 </div>
 </div>

 <div className="flex flex-wrap gap-2">
 {CATEGORIES.map((c) => (
 <button
 key={c.key}
 onClick={() => setCategory(c.key)}
 className={`surface-transition px-3.5 py-1.5 text-sm hover:-translate-y-0.5 ${
 category === c.key ? "bg-brand text-white" : "border border-border bg-panel text-muted hover:text-text"
 }`}
 >
 {c.label}
 </button>
 ))}
 </div>

 {error && (
 <div className="border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">{error}</div>
 )}

 {showMarket && (
 loading ? (
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {Array.from({ length: 6 }).map((_, i) => (
 <div key={i} className="h-[170px] animate-pulse border border-border bg-panel" />
 ))}
 </div>
 ) : (
 <>
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {filtered.map((asset) => <MarketCard key={asset.symbol} asset={asset} />)}
 </div>
 {filtered.length === 0 && (
 <div className="border border-border bg-panel px-4 py-10 text-center text-sm text-muted">
 {t("noResults")}
 </div>
 )}
 </>
 )
 )}
 </section>

 <section id="insights" className="scroll-mt-24 space-y-4">
 <div data-aos="fade-right">
 <h2 className="text-2xl font-semibold text-text">{t("insightsTitle")}</h2>
 <p className="text-sm text-muted">{t("insightsDesc")}</p>
 </div>
 <div className="grid gap-4 md:grid-cols-3">
 {insights.map((item, i) => (
 <div key={item.title} data-aos="fade-up" data-aos-delay={i * 100} className="surface-transition border border-border bg-panel p-5 hover:-translate-y-1 hover:border-brand/40">
 <div className="mb-3 h-1 w-10 bg-brand" />
 <h3 className="text-sm font-semibold text-text">{item.title}</h3>
 <p className="mt-2 text-sm leading-6 text-muted">{item.desc}</p>
 </div>
 ))}
 </div>
 </section>

 <section id="berita" className="grid gap-4 lg:grid-cols-3 scroll-mt-24">
 <div className="lg:col-span-2">
 <NewsFeed items={NEWS} />
 </div>
 <div className="space-y-4">
 <div className="overflow-hidden border border-border bg-panel card-glow" data-aos="zoom-in" data-aos-delay="100">
 <div className="relative h-36">
 <Image
 src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=900&q=80"
 alt="Financial analysis"
 fill
 className="object-cover transition duration-500 hover:scale-[1.02]"
 sizes="(max-width: 1024px) 100vw, 33vw"
 />
 </div>
 <div className="p-4">
 <h2 className="text-sm font-semibold text-text">{t("sourcesTitle")}</h2>
 <p className="mt-2 text-sm leading-6 text-muted">{t("sourcesDesc")}</p>
 <button
 onClick={() => setShowSources((v) => !v)}
 className="mt-3 text-xs font-medium text-brand hover:opacity-80 transition"
 >
 {showSources ? t("hideDetail") : t("showDetail")}
 </button>
 {showSources && (
 <div className="mt-3 space-y-2 text-xs text-muted">
 <div className="flex justify-between border-b border-border pb-2"><span>{t("forexMetals")}</span><span className="text-text">Frankfurter</span></div>
 <div className="flex justify-between border-b border-border pb-2"><span>Crypto</span><span className="text-text">Frankfurter</span></div>
 <div className="flex justify-between border-b border-border pb-2"><span>{t("oilIndices")}</span><span className="text-text">Yahoo fallback</span></div>
 <div className="flex justify-between"><span>{t("cache")}</span><span className="text-text">{t("minutes")}</span></div>
 </div>
 )}
 </div>
 </div>

 <div className="border border-border bg-panel p-4 card-glow" data-aos="fade-left" data-aos-delay="150">
 <h3 className="text-sm font-semibold text-text">{t("learnTitle")}</h3>
 <p className="mt-1 text-xs text-muted">{t("learnDesc")}</p>
 <div className="mt-4 space-y-3">
 {learns.map((l) => (
 <div key={l.title} className="border-l-2 border-brand/50 pl-3">
 <div className="text-sm font-medium text-text">{l.title}</div>
 <div className="text-xs leading-5 text-muted">{l.desc}</div>
 </div>
 ))}
 </div>
  </div>
 </div>
        </section>

        <section id="faq" className="scroll-mt-24 space-y-4">
          <div data-aos="fade-right">
 <h2 className="text-2xl font-semibold text-text">{t("faqTitle")}</h2>
 <p className="text-sm text-muted">{t("faqDesc")}</p>
 </div>
 <div className="grid gap-4 md:grid-cols-3">
 {[
 { q: t("faq1Q"), a: t("faq1A") },
 { q: t("faq2Q"), a: t("faq2A") },
 { q: t("faq3Q"), a: t("faq3A") },
 ].map((f, i) => (
 <details key={f.q} data-aos="fade-up" data-aos-delay={i * 100} className="group surface-transition border border-border bg-panel p-5 hover:-translate-y-1 hover:border-brand/40">
                <summary className="cursor-pointer list-none text-sm font-semibold text-text flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 transition-transform duration-200 group-open:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

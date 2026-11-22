"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { NewsItem } from "@/lib/types";

function ChevronLeftIcon() {
 return (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="m15 18-6-6 6-6" />
 </svg>
 );
}

export function ArticleDetail({ item }: { item: NewsItem }) {
 const { t } = useI18n();
 const paragraphs = item.content.split("\n\n").filter(Boolean);

 return (
 <div className="min-h-screen bg-bg">
 <header className="border-b border-border/80 bg-bg/85 backdrop-blur-md">
 <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-4">
 <Link href="/" className="surface-transition inline-flex items-center gap-1.5 text-sm text-muted hover:text-text hover:-translate-x-0.5">
 <ChevronLeftIcon />
 {t("backHome")}
 </Link>
 <span className="bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand">{item.category}</span>
 </div>
 </header>

 <main className="mx-auto max-w-[900px] px-4 py-10">
 <article data-aos="fade-right" data-aos-duration="650" className="border border-border bg-panel card-glow overflow-hidden">
 <div className="relative h-[240px] sm:h-[360px] w-full border-b border-border">
 <Image src={item.image} alt={item.title} fill className="object-cover transition duration-500 hover:scale-[1.02]" sizes="(max-width: 900px) 100vw, 900px" priority />
 <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
 </div>
 <div className="p-6 sm:p-8">
 <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted">
 <span>{item.source}</span>
 <span>•</span>
 <span>{item.time}</span>
 </div>
 <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
 {item.title}
 </h1>
 <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{item.summary}</p>

 <div className="mt-8 space-y-5 border-t border-border pt-8">
 {paragraphs.map((p, i) => (
 <p key={i} className="text-[15px] leading-8 text-text/90">
 {p}
 </p>
 ))}
 </div>

 <div className="mt-10 border border-border bg-bg/60 p-4 text-sm text-muted">
 {t("articleDisclaimer")}
 </div>
 </div>
 </article>
 </main>
 </div>
 );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { NewsItem } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

function Chevron({ open }: { open: boolean }) {
 return (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
 <path d="m6 9 6 6 6-6" />
 </svg>
 );
}

export function NewsFeed({ items }: { items: NewsItem[] }) {
 const [openId, setOpenId] = useState<string | null>(null);
 const { t } = useI18n();

 return (
 <div className="border border-border bg-panel card-glow overflow-hidden" data-aos="fade-left" data-aos-duration="650">
 <div className="flex items-center justify-between border-b border-border px-4 py-4">
 <h2 className="text-sm font-semibold text-text">{t("newsTitle")}</h2>
 <span className="text-xs text-muted">{t("newsLatest")}</span>
 </div>
 <div className="divide-y divide-border">
 {items.map((item) => {
 const open = openId === item.id;
 return (
 <article key={item.id} className="px-4 py-4 surface-transition hover:bg-panel-elev/40">
 <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
 <div className="relative h-40 w-full sm:h-24 sm:w-36 shrink-0 overflow-hidden border border-border bg-bg">
 <Image
 src={item.image}
 alt={item.title}
 fill
 className="object-cover transition duration-300 hover:scale-105"
 sizes="(max-width: 640px) 100vw, 144px"
 />
 </div>
 <div className="min-w-0 flex-1">
 <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
 <span className="bg-brand-soft px-2 py-0.5 text-[10px] font-medium text-brand">
 {item.category}
 </span>
 <span>{item.source}</span>
 <span>•</span>
 <span>{item.time}</span>
 </div>
 <h3 className="text-sm font-medium leading-6 text-text">
 <Link href={item.url} className="hover:text-brand transition">
 {item.title}
 </Link>
 </h3>

 <div className="mt-3 flex items-center gap-3">
 <button
 onClick={() => setOpenId(open ? null : item.id)}
 className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:opacity-80 transition"
 >
 {open ? t("hideSummary") : t("showSummary")}
 <Chevron open={open} />
 </button>
 <Link href={item.url} className="text-xs text-muted hover:text-text transition">
 {t("readArticle")}
 </Link>
 </div>

 {open && (
 <p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p>
 )}
 </div>
 </div>
 </article>
 );
 })}
 </div>
 </div>
 );
}

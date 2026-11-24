"use client";

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

function NewsLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
 if (href.startsWith("http")) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
 }
 return <Link href={href} className={className}>{children}</Link>;
}

export function NewsFeed({ items, meta }: { items: NewsItem[]; meta?: { source?: string; fallback?: boolean; updatedAt?: string } }) {
 const [openId, setOpenId] = useState<string | null>(null);
 const { t } = useI18n();

 return (
  <div className="border border-border bg-panel card-glow overflow-hidden" data-aos="fade-left" data-aos-duration="650">
   <div className="flex items-center justify-between border-b border-border px-4 py-4 gap-3">
    <div>
     <h2 className="text-sm font-semibold text-text">{t("newsTitle")}</h2>
     {meta?.source && (
      <p className="text-[11px] text-muted mt-0.5">
       {meta.fallback ? "Fallback" : "Live"}: {meta.source}
      </p>
     )}
    </div>
    <span className="text-xs text-muted">{t("newsLatest")}</span>
   </div>
   <div className="grid grid-cols-2 gap-3 p-3 bg-bg sm:block sm:gap-0 sm:p-0 sm:bg-transparent">
    {items.map((item) => {
     const open = openId === item.id;
     return (
      <article key={item.id} className="border border-border bg-panel surface-transition hover:bg-panel-elev/40 sm:border-0 sm:border-b sm:border-border sm:px-4 sm:py-4 sm:last:border-b-0">
       <div className="min-w-0 flex-1 p-3 sm:p-0">
        <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-muted">
         <span className="bg-brand-soft px-1.5 py-0.5 text-[10px] font-medium text-brand">
          {item.category}
         </span>
         <span className="truncate">{item.source}</span>
         <span className="hidden sm:inline">•</span>
         <span className="hidden sm:inline">{item.time}</span>
        </div>
        <h3 className="text-xs sm:text-sm font-medium leading-5 sm:leading-6 text-text line-clamp-3 sm:line-clamp-none">
         <NewsLink href={item.url} className="hover:text-brand transition">
          {item.title}
         </NewsLink>
        </h3>

        <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3">
         <button
          onClick={() => setOpenId(open ? null : item.id)}
          className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-brand hover:opacity-80 transition"
         >
          {open ? t("hideSummary") : t("showSummary")}
          <Chevron open={open} />
         </button>
         <NewsLink href={item.url} className="hidden sm:inline text-xs text-muted hover:text-text transition">
          {t("readArticle")}
         </NewsLink>
        </div>

        {open && (
         <p className="mt-2 sm:mt-3 text-[11px] sm:text-sm leading-5 sm:leading-7 text-muted">{item.summary}</p>
        )}
       </div>
      </article>
     );
    })}
   </div>
  </div>
 );
}
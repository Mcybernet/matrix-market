"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LANGUAGES, useI18n } from "@/lib/i18n";

function SearchIcon({ className = "" }: { className?: string }) {
 return (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
 <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
 </svg>
 );
}

export function Header({
 query,
 onQueryChange,
}: {
 query: string;
 onQueryChange: (value: string) => void;
}) {
 const { t, locale, setLocale } = useI18n();
 const navItems = [
  { href: "#market", label: t("navMarket") },
  { href: "#berita", label: t("navNews") },
  { href: "#calendar", label: t("navCalendar") },
  { href: "#insights", label: t("navInsights") },
 ];

 return (
 <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-md">
 <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-3">
 <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
 <div className="flex h-9 w-9 items-center justify-center bg-brand/15 font-mono text-sm font-bold text-brand">
 MX
 </div>
 <div className="hidden sm:block">
 <div className="text-base font-semibold tracking-wide text-text">{t("brand")}</div>
 <div className="max-w-[260px] text-[11px] leading-4 text-muted hidden lg:block">{t("tagline")}</div>
 </div>
 </Link>

 <nav className="hidden items-center gap-1 md:flex ml-4">
 {navItems.map((item) => (
 <Link
 key={item.href}
 href={item.href}
 className="surface-transition px-3 py-2 text-sm text-muted hover:bg-panel hover:text-text"
 >
 {item.label}
 </Link>
 ))}
 </nav>

 <div className="ml-auto flex items-center gap-2">
 <div className="relative hidden sm:block">
 <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
 <input
 value={query}
 onChange={(e) => onQueryChange(e.target.value)}
 placeholder={t("search")}
 className="w-44 lg:w-52 border border-border bg-panel py-2 pl-9 pr-3 text-sm text-text outline-none placeholder:text-muted focus:border-brand transition"
 />
 </div>
 <select
 value={locale}
 onChange={(e) => setLocale(e.target.value as any)}
 className="border border-border bg-panel px-2 py-2 text-xs text-text outline-none focus:border-brand transition max-w-[130px]"
 aria-label="Language"
 >
 {LANGUAGES.map((l) => (
 <option key={l.code} value={l.code}>{l.label}</option>
 ))}
 </select>
 <ThemeToggle />
 </div>
 </div>
 <div className="border-t border-border px-4 py-2 sm:hidden">
 <div className="relative">
 <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
 <input
 value={query}
 onChange={(e) => onQueryChange(e.target.value)}
 placeholder={t("search")}
 className="w-full border border-border bg-panel py-2 pl-9 pr-3 text-sm text-text outline-none placeholder:text-muted focus:border-brand transition"
 />
 </div>
 </div>
 </header>
 );
}

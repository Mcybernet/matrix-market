"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

function HomeIcon() {
 return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>);
}
function ChartIcon() {
 return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m7 16 4-4 4 4 5-6"/></svg>);
}
function NewsIcon() {
 return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>);
}
function InsightIcon() {
 return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>);
}

export function MobileNav() {
 const { t } = useI18n();
 const items = [
 { href: "/", label: t("navHome"), icon: HomeIcon },
 { href: "/#market", label: t("navMarket"), icon: ChartIcon },
 { href: "/#berita", label: t("navNews"), icon: NewsIcon },
 { href: "/#insights", label: t("navInsights"), icon: InsightIcon },
 ];

 return (
 <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-bg/95 backdrop-blur md:hidden">
 <div className="mx-auto grid max-w-[1200px] grid-cols-4 px-4 py-2">
 {items.map((item) => {
 const Icon = item.icon;
 return (
 <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 py-2 text-muted hover:text-brand transition hover:-translate-y-0.5">
 <Icon />
 <span className="text-[11px] font-medium">{item.label}</span>
 </Link>
 );
 })}
 </div>
 </nav>
 );
}

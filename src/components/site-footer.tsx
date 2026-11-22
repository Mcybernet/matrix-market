"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
 const { t } = useI18n();
 const links = [
 { href: "/", label: t("navHome") },
 { href: "/#market", label: t("navMarket") },
 { href: "/#berita", label: t("navNews") },
 { href: "/#insights", label: t("navInsights") },
 ];

 return (
 <footer className="border-t border-border bg-panel/40 mt-12 pb-24 md:pb-0">
 <div className="mx-auto max-w-[1200px] px-4 py-10">
 <div className="grid gap-8 md:grid-cols-3">
 <div>
 <div className="flex items-center gap-2">
 <div className="flex h-8 w-8 items-center justify-center bg-brand/15 font-mono text-xs font-bold text-brand">MX</div>
 <span className="font-semibold tracking-wide text-text">{t("brand")}</span>
 </div>
 <p className="mt-3 text-sm leading-6 text-muted">{t("footerDesc")}</p>
 <p className="mt-2 text-xs text-muted">{t("tagline")}</p>
 </div>
 <div>
 <h3 className="text-sm font-semibold text-text">{t("footerNav")}</h3>
 <div className="mt-3 flex flex-col gap-2">
 {links.map((l) => (
 <Link key={l.href + l.label} href={l.href} className="text-sm text-muted hover:text-text hover:translate-x-1 transition inline-flex w-fit">
 {l.label}
 </Link>
 ))}
 </div>
 </div>
 <div>
 <h3 className="text-sm font-semibold text-text">{t("footerNote")}</h3>
 <p className="mt-3 text-sm leading-6 text-muted">{t("footerNoteDesc")}</p>
 </div>
 </div>
 <div className="mt-8 border-t border-border pt-4 text-xs text-muted">
 {t("footerCopy")}
 </div>
 </div>
 </footer>
 );
}

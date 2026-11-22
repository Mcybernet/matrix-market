"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

function SunIcon() {
 return (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
 </svg>
 );
}

function MoonIcon() {
 return (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
 </svg>
 );
}

export function ThemeToggle() {
 const [theme, setTheme] = useState<"dark" | "light">("dark");
 const { t } = useI18n();

 useEffect(() => {
 const current = document.documentElement.getAttribute("data-theme");
 if (current === "light" || current === "dark") setTheme(current);
 }, []);

 function toggle() {
 const next = theme === "dark" ? "light" : "dark";
 setTheme(next);
 document.documentElement.setAttribute("data-theme", next);
 try { localStorage.setItem("theme", next); } catch {}
 }

 return (
 <button
 onClick={toggle}
 className="surface-transition inline-flex items-center gap-2 border border-border bg-panel px-3 py-2 text-xs font-medium text-text hover:bg-panel-elev hover:-translate-y-0.5"
 aria-label="Toggle theme"
 >
 {theme === "dark" ? <SunIcon /> : <MoonIcon />}
 <span className="hidden sm:inline">{theme === "dark" ? t("themeLight") : t("themeDark")}</span>
 </button>
 );
}

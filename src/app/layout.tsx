import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AOSProvider } from "@/components/aos-provider";
import { SiteFooter } from "@/components/site-footer";
import { MobileNav } from "@/components/mobile-nav";
import { I18nProvider } from "@/lib/i18n";

const geistSans = Geist({
 variable: "--font-geist-sans",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable: "--font-geist-mono",
 subsets: ["latin"],
});

export const metadata: Metadata = {
 title: "MATRIX — Market Analysis, Trading & Research Intelligence Exchange",
 description:
 "Pusat informasi, analisis, trading, dan riset pasar keuangan. Pantau emas, komoditas, forex, indeks, dan crypto.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
 return (
 <html
 lang="id"
 data-theme="dark"
 suppressHydrationWarning
 className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
 >
 <body className="min-h-full bg-bg text-text pb-16 md:pb-0">
 <script
 dangerouslySetInnerHTML={{
 __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`,
 }}
 />
 <I18nProvider>
 <AOSProvider>
 {children}
 <SiteFooter />
 <MobileNav />
 </AOSProvider>
 </I18nProvider>
 </body>
 </html>
 );
}

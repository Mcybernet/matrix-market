import { NextResponse } from "next/server";
import { NEWS } from "@/lib/mock-data";
import type { NewsItem } from "@/lib/types";

function decodeHtml(s: string) {
 return s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .trim();
}

function pickTag(block: string, tag: string) {
 const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
 return m ? decodeHtml(m[1]) : "";
}

function pickSource(block: string) {
 const m = block.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
 return m ? decodeHtml(m[1]) : "Google News";
}

function guessCategory(text: string): NewsItem["category"] {
 const t = text.toLowerCase();
 if (/(gold|silver|oil|wti|commodity|commodities)/.test(t)) return "Komoditas";
 if (/(forex|usd|eur|idr|currency|dollar|rupiah|yen)/.test(t)) return "Forex";
 if (/(index|indices|ihsg|s&p|nasdaq|dow|stock)/.test(t)) return "Indeks";
 if (/(bitcoin|crypto|ethereum|btc|eth)/.test(t)) return "Crypto";
 return "Market";
}

function imageForCategory(cat: NewsItem["category"], i: number) {
 const map: Record<string, string[]> = {
  Komoditas: [
   "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1550565118-3a14e8d0386f?auto=format&fit=crop&w=900&q=80",
  ],
  Forex: [
   "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1621981386829-9b458a2cddde?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=900&q=80",
  ],
  Indeks: [
   "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&w=900&q=80",
  ],
  Crypto: [
   "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=900&q=80",
  ],
  Market: [
   "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=900&q=80",
  ],
 };
 const arr = map[cat] || map.Market;
 return arr[i % arr.length];
}

function relativeTime(dateStr: string) {
 const d = new Date(dateStr);
 if (Number.isNaN(d.getTime())) return dateStr;
 const diff = Date.now() - d.getTime();
 const mins = Math.floor(diff / 60000);
 if (mins < 60) return `${Math.max(1, mins)}m ago`;
 const hrs = Math.floor(mins / 60);
 if (hrs < 24) return `${hrs}h ago`;
 const days = Math.floor(hrs / 24);
 return `${days}d ago`;
}

export async function GET() {
 try {
  const rssUrl =
   "https://news.google.com/rss/search?q=gold+OR+forex+OR+bitcoin+OR+stock+market+OR+oil+price&hl=en-US&gl=US&ceid=US:en";
  const res = await fetch(rssUrl, {
   next: { revalidate: 300 },
   headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`RSS failed ${res.status}`);
  const xml = await res.text();
  const items = xml.match(/<item>([\s\S]*?)<\/item>/gi) || [];
  const parsed: NewsItem[] = items.slice(0, 8).map((block, i) => {
   const title = pickTag(block, "title");
   const link = pickTag(block, "link");
   const pubDate = pickTag(block, "pubDate");
   const source = pickSource(block);
   const category = guessCategory(title);
   const summary = `${title}. Source: ${source}.`;
   return {
    id: `live-${i + 1}`,
    title,
    source,
    time: relativeTime(pubDate),
    category,
    summary,
    content: `${title}\n\n${summary}\n\nThis headline was fetched from a public RSS feed for informational purposes. Open the source link for full context.`,
    image: imageForCategory(category, i),
    url: link || "#",
   };
  }).filter((n) => n.title);

  if (parsed.length === 0) throw new Error("No RSS items");
  return NextResponse.json(
   { items: parsed, source: "Google News RSS", updatedAt: new Date().toISOString(), fallback: false },
   { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
 } catch (e) {
  return NextResponse.json(
   {
    items: NEWS,
    source: "Mock fallback",
    updatedAt: new Date().toISOString(),
    fallback: true,
    error: e instanceof Error ? e.message : "News fetch failed",
   },
   { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
 }
}
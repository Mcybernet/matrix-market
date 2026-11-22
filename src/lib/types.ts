export type AssetCategory = "Komoditas" | "Forex" | "Indeks" | "Crypto";

export interface Asset {
 symbol: string;
 name: string;
 category: AssetCategory;
 price: number;
 change: number;
 changePercent: number;
 currency: string;
 unit?: string;
 open: number;
 high: number;
 low: number;
 prevClose: number;
 volume?: string;
 marketStatus: "Open" | "Closed" | "24/5" | "24/7";
 updatedAt: string;
 sparkline: number[];
}

export interface NewsItem {
 id: string;
 title: string;
 source: string;
 time: string;
 category: AssetCategory | "Market";
 summary: string;
 content: string;
 image: string;
 url: string;
}

export interface ChartPoint {
 time: string;
 value: number;
}

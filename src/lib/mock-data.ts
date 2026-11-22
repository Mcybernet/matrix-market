export const GOLD_IDR_PER_GRAM = 1_850_000;

import type { Asset, NewsItem } from "./types";

const now = new Date().toISOString();

export const NEWS: NewsItem[] = [
 {
 id: "n1",
 title: "Emas menguat seiring pelaku pasar menunggu sinyal suku bunga",
 source: "MarketPulse",
 time: "15 menit lalu",
 category: "Komoditas",
 summary: "Harga emas spot naik tipis karena investor mencari aset aman menjelang rilis data inflasi.",
 content:
 "Harga emas spot bergerak menguat pada perdagangan hari ini seiring pelaku pasar menunggu sinyal kebijakan suku bunga dari bank sentral. Investor cenderung memilih aset aman saat ketidakpastian arah inflasi masih tinggi.\n\nSelain itu, pelemahan dolar AS pada sejumlah sesi memberikan ruang tambahan bagi penguatan emas. Analis mencatat bahwa level psikologis dan area support terdekat masih menjadi perhatian utama pelaku pasar.\n\nMeski demikian, pergerakan emas tetap sensitif terhadap data ekonomi yang akan dirilis dalam waktu dekat, terutama inflasi, tenaga kerja, dan pernyataan pejabat bank sentral. Investor disarankan mencermati volatilitas jangka pendek.",
 image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=900&q=80",
 url: "/berita/n1",
 },
 {
 id: "n2",
 title: "Dolar melemah, rupiah bergerak stabil di sesi Asia",
 source: "FX Daily",
 time: "32 menit lalu",
 category: "Forex",
 summary: "USD/IDR bergerak dalam rentang sempit dengan volume moderat menjelang pembukaan Eropa.",
 content:
 "Pasangan USD/IDR bergerak relatif stabil pada sesi Asia. Tekanan dolar AS yang melemah terhadap sejumlah mata uang utama membuat rupiah tidak mengalami volatilitas besar.\n\nPelaku pasar masih menunggu sentimen baru dari pembukaan pasar Eropa dan data ekonomi global. Volume transaksi tercatat moderat, dengan kecenderungan pasar bersikap hati-hati.\n\nKe depan, pergerakan rupiah akan dipengaruhi oleh arah yield obligasi AS, arus modal asing, dan sentimen risiko global. Untuk kebutuhan informasi, pengguna dapat memantau update kurs secara berkala.",
 image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=900&q=80",
 url: "/berita/n2",
 },
 {
 id: "n3",
 title: "Bitcoin kembali di atas level psikologis setelah arus masuk ETF",
 source: "Crypto Wire",
 time: "1 jam lalu",
 category: "Crypto",
 summary: "Sentimen risk-on mendorong BTC naik, sementara altcoin bergerak mixed.",
 content:
 "Bitcoin kembali bergerak di atas level psikologis setelah adanya arus masuk ke produk ETF berbasis aset kripto. Sentimen risk-on mendorong minat beli, terutama dari investor institusional.\n\nNamun, pergerakan altcoin masih beragam. Beberapa aset mencatat kenaikan moderat, sementara lainnya tertahan oleh aksi ambil untung. Kondisi ini menunjukkan pasar masih selektif terhadap aset berisiko.\n\nPengguna perlu memahami bahwa harga crypto sangat volatil. Informasi yang ditampilkan di web ini bersifat informatif dan bukan rekomendasi investasi.",
 image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=900&q=80",
 url: "/berita/n3",
 },
 {
 id: "n4",
 title: "IHSG ditutup menguat didorong saham sektor komoditas",
 source: "IDX Insight",
 time: "2 jam lalu",
 category: "Indeks",
 summary: "Penguatan harga komoditas memberi angin segar bagi saham berbasis sumber daya.",
 content:
 "Indeks Harga Saham Gabungan (IHSG) ditutup menguat didorong oleh kinerja saham-saham sektor komoditas. Kenaikan harga komoditas global memberi sentimen positif bagi emiten berbasis sumber daya.\n\nSelain sektor komoditas, beberapa saham big cap juga ikut menopang pergerakan indeks. Investor terlihat mencermati arah kebijakan global dan prospek pertumbuhan domestik.\n\nMeski indeks menguat, pelaku pasar tetap disarankan memperhatikan risiko koreksi, terutama jika terjadi perubahan sentimen global atau tekanan pada nilai tukar.",
 image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80",
 url: "/berita/n4",
 },
 {
 id: "n5",
 title: "Harga minyak bergerak variatif jelang data persediaan AS",
 source: "Energy Desk",
 time: "3 jam lalu",
 category: "Komoditas",
 summary: "Pelaku pasar menunggu laporan persediaan minyak mentah untuk melihat arah permintaan.",
 content:
 "Harga minyak mentah bergerak variatif karena pasar menunggu data persediaan resmi dari Amerika Serikat. Investor ingin melihat apakah permintaan energi tetap kuat di tengah ketidakpastian ekonomi global.\n\nSelain data persediaan, kebijakan produksi negara produsen dan perkembangan geopolitik juga menjadi faktor penting. Perubahan kecil pada outlook pasokan dapat memicu pergerakan harga yang cepat.\n\nUntuk pembaca market, penting memisahkan pergerakan jangka pendek dari tren fundamental agar tidak salah membaca konteks.",
 image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80",
 url: "/berita/n5",
 },
 {
 id: "n6",
 title: "Pasar global menanti data inflasi untuk arah suku bunga",
 source: "Global Macro",
 time: "4 jam lalu",
 category: "Market",
 summary: "Investor lintas aset menunggu data inflasi sebagai petunjuk kebijakan bank sentral.",
 content:
 "Pasar global bergerak hati-hati menjelang rilis data inflasi utama. Angka inflasi dapat memengaruhi ekspektasi suku bunga, yang pada gilirannya berdampak pada saham, obligasi, mata uang, dan emas.\n\nKetika ekspektasi suku bunga berubah, arus dana antar aset juga bisa bergeser cepat. Karena itu, kalender ekonomi menjadi alat penting bagi siapa pun yang mengikuti pasar.\n\nMATRIX menyajikan informasi ini untuk membantu pengguna memahami konteks pasar, bukan sebagai sinyal transaksi.",
 image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
 url: "/berita/n6",
 },
];

export function formatPrice(price: number, currency: string): string {
 if (currency === "IDR") {
 return `Rp ${price.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
 }
 if (currency === "USD") {
 return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
 }
 return price.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function formatChange(change: number, percent: number): string {
 const sign = change >= 0 ? "+" : "";
 return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
}

export function getAssetBySymbol(assets: Asset[], symbol: string): Asset | undefined {
 return assets.find((a) => a.symbol === symbol);
}

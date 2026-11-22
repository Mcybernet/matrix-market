# Konsep Web Informasi Market

## Ringkasan
Web informasi market bergaya **Dark Financial Dashboard** untuk memantau harga aset seperti emas, komoditas, forex, indeks, dan crypto. Fokus utama: data cepat terbaca, tampilan profesional, dan navigasi sederhana.

## Target Pengguna
- Investor/pengamat market umum
- Pengguna yang ingin memantau harga emas dan aset utama
- Pembaca yang butuh ringkasan market + berita

## Fitur MVP
- **Dashboard overview**: kartu ringkasan aset utama (harga, perubahan %, sparkline).
- **Live ticker bar**: strip harga aset utama.
- **Detail aset**: statistik open/high/low/prev close, status pasar.
- **Chart interaktif**: grafik historis 30 hari dengan hover tooltip.
- **Pencarian & filter kategori**: Komoditas, Forex, Indeks, Crypto.
- **Watchlist**: simpan aset favorit.
- **Top movers**: gainers dan losers.
- **Berita market**: feed berita ringkas.
- **Kalkulator emas**: konversi gram/oz ke IDR/USD.

## Fase Lanjutan
- Price alert/notifikasi
- Perbandingan aset
- Kalender ekonomi
- Heatmap market
- Login & sinkronisasi watchlist
- Integrasi API data real-time

## Rekomendasi Style: Dark Financial Dashboard
- **Background**: `#131722`
- **Panel**: `#1E222D`
- **Border**: `#2A2E39`
- **Text**: `#D1D4DC`, muted `#787B86`
- **Accent**: brand blue `#2962FF`
- **Semantic**: up `#089981`, down `#F23645`
- **Typography**: Geist/sans untuk UI, Geist Mono/tabular-nums untuk angka
- **Prinsip**: data-first, kontras jelas, warna hijau/merah hanya untuk naik/turun.

## Stack Teknis
- **Bahasa**: TypeScript
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Chart**: SVG chart interaktif (MVP), dapat diganti Lightweight Charts
- **Deploy**: Vercel

## Catatan Data
MVP menggunakan data simulasi/delayed. Untuk produksi, sambungkan API market/news resmi dan tampilkan timestamp + sumber data.

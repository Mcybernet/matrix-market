"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "zh" | "hi" | "es" | "ar" | "fr" | "bn" | "pt" | "id" | "ur";

export const LANGUAGES: { code: Locale; label: string }[] = [
 { code: "en", label: "English" },
 { code: "zh", label: "Mandarin Chinese" },
 { code: "hi", label: "Hindi" },
 { code: "es", label: "Spanish" },
 { code: "ar", label: "Standard Arabic" },
 { code: "fr", label: "French" },
 { code: "bn", label: "Bengali" },
 { code: "pt", label: "Portuguese" },
 { code: "id", label: "Indonesian" },
 { code: "ur", label: "Urdu" },
];

type Dict = Record<string, string>;

const en: Dict = {
 brand: "MATRIX",
 tagline: "Market Analysis, Trading & Research Intelligence Exchange",
 navHome: "Home",
 navMarket: "Market",
 navNews: "News",
 navInsights: "Insights",
 search: "Search assets...",
 themeLight: "Light",
 themeDark: "Dark",
 heroBadge: "Market Information",
 heroTitle: "Track global markets in one dashboard.",
 heroDesc: "Monitor gold, commodities, forex, indices, and crypto prices in one place. All data is for information only, not trading advice.",
 heroCta: "View Market",
 heroCta2: "Read News",
 marketTitle: "Market Overview",
 marketDesc: "Latest prices across asset categories.",
 update: "Update",
 loading: "Loading data...",
 show: "Show",
 hide: "Hide",
 all: "All",
 commodities: "Commodities",
 forex: "Forex",
 indices: "Indices",
 crypto: "Crypto",
 noResults: "No assets match your search.",
 newsTitle: "Market News",
 newsLatest: "Latest updates",
 showSummary: "Show summary",
 hideSummary: "Hide summary",
 readArticle: "Read article",
 sourcesTitle: "Data Sources",
 sourcesDesc: "Price data is sourced from open/public APIs for general information. Not investment advice.",
 showDetail: "Show details",
 hideDetail: "Hide details",
 forexMetals: "Forex & Metals",
 oilIndices: "Oil & Indices",
 cache: "Cache",
 footerDesc: "Market information dashboard for gold, commodities, forex, indices, and crypto.",
 footerNav: "Navigation",
 footerNote: "Disclaimer",
 footerNoteDesc: "Data is informational, not investment advice. Sources: Frankfurter (open-source) and public fallback.",
 footerCopy: "© 2026 MATRIX. Market information for education and reference.",
 backHome: "Back to MATRIX",
 articleDisclaimer: "This information is general and not investment advice. Always verify with official sources before making decisions.",
 insightsTitle: "Market Insights",
 insightsDesc: "Quick context to help you read the market.",
 insight1Title: "Broaden Your View",
 insight1Desc: "Compare multiple asset classes to understand market direction, not just one ticker.",
 insight2Title: "Watch Volatility",
 insight2Desc: "Large moves often follow news, macro events, or liquidity changes.",
 insight3Title: "Verify Sources",
 insight3Desc: "Use this data as a reference and confirm with official exchanges or institutions.",
 statsTitle: "At a Glance",
 statsAssets: "Assets Tracked",
 statsCategories: "Categories",
 statsSources: "Data Sources",
 statsRefresh: "Cache Refresh",
 learnTitle: "Learn the Basics",
 learnDesc: "Simple guides for new market readers.",
 learn1Title: "What moves gold?",
 learn1Desc: "Gold often reacts to interest rates, inflation expectations, USD strength, and risk sentiment.",
 learn2Title: "Forex basics",
 learn2Desc: "Currency pairs show the relative strength of two economies and their monetary policy.",
 learn3Title: "Index meaning",
 learn3Desc: "An index tracks a group of stocks to represent a market segment or the broader economy.",
 faqTitle: "Frequently Asked Questions",
 faqDesc: "Quick answers for common market questions.",
 faq1Q: "Is this a trading platform?",
 faq1A: "No. MATRIX is an information-only market dashboard for monitoring prices, news, and context.",
 faq2Q: "Where does the data come from?",
 faq2A: "We use open-source/public APIs like Frankfurter and public fallback sources, with short cache windows.",
 faq3Q: "How often is data updated?",
 faq3A: "Market data is cached briefly (around 5 minutes) to balance freshness and reliability.",
 minutes: "~5 min",
 errorPartial: "Some data failed to load:",
 assets: "assets",
 marketOpen: "Market",
};

const id: Dict = {
 ...en,
 tagline: "Market Analysis, Trading & Research Intelligence Exchange",
 navHome: "Beranda",
 navMarket: "Market",
 navNews: "Berita",
 navInsights: "Insight",
 search: "Cari aset...",
 themeLight: "Terang",
 themeDark: "Gelap",
 heroBadge: "Informasi Market",
 heroTitle: "Pantau pasar global dalam satu dasbor.",
 heroDesc: "Pantau harga emas, komoditas, forex, indeks, dan crypto dalam satu tempat. Data hanya untuk informasi, bukan ajakan trading.",
 heroCta: "Lihat Market",
 heroCta2: "Baca Berita",
 marketTitle: "Ringkasan Market",
 marketDesc: "Harga terkini dari berbagai kategori aset.",
 update: "Update",
 loading: "Memuat data...",
 show: "Tampilkan",
 hide: "Sembunyikan",
 all: "Semua",
 commodities: "Komoditas",
 forex: "Forex",
 indices: "Indeks",
 crypto: "Crypto",
 noResults: "Tidak ada aset yang cocok dengan pencarian.",
 newsTitle: "Berita Market",
 newsLatest: "Update terbaru",
 showSummary: "Tampilkan ringkasan",
 hideSummary: "Sembunyikan ringkasan",
 readArticle: "Baca artikel",
 sourcesTitle: "Sumber Data",
 sourcesDesc: "Data harga diambil dari API open-source/publik untuk informasi umum. Bukan rekomendasi investasi.",
 showDetail: "Tampilkan detail",
 hideDetail: "Sembunyikan detail",
 forexMetals: "Forex & Logam",
 oilIndices: "Minyak & Indeks",
 cache: "Cache",
 footerDesc: "Dasbor informasi market untuk memantau emas, komoditas, forex, indeks, dan crypto.",
 footerNav: "Navigasi",
 footerNote: "Disclaimer",
 footerNoteDesc: "Data bersifat informasional, bukan rekomendasi investasi. Sumber: Frankfurter (open-source) dan fallback publik.",
 footerCopy: "© 2026 MATRIX. Informasi pasar untuk edukasi dan referensi.",
 backHome: "Kembali ke MATRIX",
 articleDisclaimer: "Informasi ini bersifat umum dan bukan rekomendasi investasi. Selalu verifikasi dengan sumber resmi sebelum mengambil keputusan.",
 insightsTitle: "Insight Market",
 insightsDesc: "Konteks cepat untuk membantu membaca pasar.",
 insight1Title: "Lihat Secara Luas",
 insight1Desc: "Bandingkan beberapa kelas aset untuk memahami arah pasar, bukan hanya satu ticker.",
 insight2Title: "Perhatikan Volatilitas",
 insight2Desc: "Pergerakan besar sering mengikuti berita, event makro, atau perubahan likuiditas.",
 insight3Title: "Verifikasi Sumber",
 insight3Desc: "Gunakan data ini sebagai referensi dan konfirmasi ke bursa atau institusi resmi.",
 statsTitle: "Sekilas",
 statsAssets: "Aset Dipantau",
 statsCategories: "Kategori",
 statsSources: "Sumber Data",
 statsRefresh: "Refresh Cache",
 learnTitle: "Belajar Dasar",
 learnDesc: "Panduan sederhana untuk pembaca pasar pemula.",
 learn1Title: "Apa yang menggerakkan emas?",
 learn1Desc: "Emas sering bereaksi terhadap suku bunga, ekspektasi inflasi, kekuatan USD, dan sentimen risiko.",
 learn2Title: "Dasar forex",
 learn2Desc: "Pasangan mata uang menunjukkan kekuatan relatif dua ekonomi dan kebijakan moneternya.",
 learn3Title: "Arti indeks",
 learn3Desc: "Indeks melacak sekelompok saham untuk mewakili segmen pasar atau ekonomi yang lebih luas.",
 faqTitle: "Pertanyaan Umum",
 faqDesc: "Jawaban cepat untuk pertanyaan umum seputar market.",
 faq1Q: "Apakah ini platform trading?",
 faq1A: "Tidak. MATRIX adalah dashboard informasi market untuk memantau harga, berita, dan konteks.",
 faq2Q: "Dari mana data berasal?",
 faq2A: "Kami menggunakan API open-source/publik seperti Frankfurter dan sumber fallback publik, dengan cache singkat.",
 faq3Q: "Seberapa sering data diperbarui?",
 faq3A: "Data market di-cache sebentar (sekitar 5 menit) untuk menjaga keseimbangan kesegaran dan keandalan.",
 minutes: "~5 menit",
 errorPartial: "Sebagian data gagal dimuat:",
 assets: "aset",
 marketOpen: "Market",
};

const zh: Dict = { ...en, navHome:"首页", navMarket:"市场", navNews:"新闻", navInsights:"洞察", search:"搜索资产...", themeLight:"浅色", themeDark:"深色", heroBadge:"市场信息", heroTitle:"在一个仪表板中追踪全球市场。", heroDesc:"在一个地方追踪黄金、大宗商品、外汇、指数和加密货币。数据仅供参考，不构成交易建议。", heroCta:"查看市场", heroCta2:"阅读新闻", marketTitle:"市场概览", marketDesc:"各类资产的最新价格。", update:"更新", loading:"加载数据...", show:"显示", hide:"隐藏", all:"全部", commodities:"大宗商品", forex:"外汇", indices:"指数", crypto:"加密货币", noResults:"没有匹配的资产。", newsTitle:"市场新闻", newsLatest:"最新动态", showSummary:"显示摘要", hideSummary:"隐藏摘要", readArticle:"阅读文章", sourcesTitle:"数据来源", sourcesDesc:"价格数据来自开源/公共API，仅供一般信息参考。非投资建议。", showDetail:"显示详情", hideDetail:"隐藏详情", footerDesc:"一个用于监控黄金、大宗商品、外汇、指数和加密货币的简单市场信息网站。", footerNav:"导航", footerNote:"免责声明", footerNoteDesc:"数据仅供参考，不构成投资建议。来源：Frankfurter（开源）及公共备用源。", footerCopy:"© 2026 MATRIX. 市场信息仅供教育与参考。", backHome:"返回 MATRIX", articleDisclaimer:"此信息为一般信息，不构成投资建议。做决定前请务必核实官方来源。", insightsTitle:"市场洞察", insightsDesc:"帮助你理解市场的快速背景。", insight1Title:"多元视角", insight1Desc:"跟踪多种资产类别以了解更广泛的市场情绪。", insight2Title:"关注波动", insight2Desc:"较大的百分比变动通常意味着新闻、宏观事件或流动性变化。", insight3Title:"核实来源", insight3Desc:"将市场数据作为参考，并与官方交易所或机构确认。", statsTitle:"概览", statsAssets:"跟踪资产", statsCategories:"类别", statsSources:"数据来源", statsRefresh:"缓存刷新", learnTitle:"基础学习", learnDesc:"给市场新手的简单指南。", learn1Title:"黄金受什么影响？", learn1Desc:"利率、通胀预期、美元强弱和风险情绪通常影响黄金。", learn2Title:"外汇基础", learn2Desc:"货币对反映两个经济体及其货币政策的相对强弱。", learn3Title:"指数含义", learn3Desc:"指数跟踪一组股票以代表市场板块或整体经济。", minutes:"~5 分钟", errorPartial:"部分数据加载失败：", assets:"资产" };
const hi: Dict = { ...en, navHome:"होम", navMarket:"मार्केट", navNews:"समाचार", navInsights:"इनसाइट्स", search:"एसेट खोजें...", themeLight:"लाइट", themeDark:"डार्क", heroBadge:"बाज़ार जानकारी", heroTitle:"एक डैशबोर्ड में वैश्विक बाजार ट्रैक करें।", heroDesc:"सोना, कमोडिटी, फॉरेक्स, इंडेक्स और क्रिप्टो को एक जगह ट्रैक करें। डेटा केवल जानकारी के लिए है।", heroCta:"मार्केट देखें", heroCta2:"समाचार पढ़ें", marketTitle:"मार्केट ओवरव्यू", marketDesc:"विभिन्न परिसंपत्ति श्रेणियों की नवीनतम कीमतें।", update:"अपडेट", loading:"डेटा लोड हो रहा है...", show:"दिखाएं", hide:"छिपाएं", all:"सभी", commodities:"कमोडिटी", forex:"फॉरेक्स", indices:"इंडेक्स", crypto:"क्रिप्टो", noResults:"कोई एसेट नहीं मिला।", newsTitle:"मार्केट समाचार", newsLatest:"ताज़ा अपडेट", showSummary:"सारांश दिखाएं", hideSummary:"सारांश छिपाएं", readArticle:"लेख पढ़ें", sourcesTitle:"डेटा स्रोत", sourcesDesc:"मूल्य डेटा खुले/सार्वजनिक API से है। निवेश सलाह नहीं।", showDetail:"विवरण दिखाएं", hideDetail:"विवरण छिपाएं", footerDesc:"सोना, कमोडिटी, फॉरेक्स, इंडेक्स और क्रिप्टो की निगरानी के लिए सरल बाजार सूचना वेबसाइट।", footerNav:"नेविगेशन", footerNote:"अस्वीकरण", footerNoteDesc:"डेटा केवल सूचनात्मक है, निवेश सलाह नहीं।", footerCopy:"© 2026 MATRIX. शिक्षा और संदर्भ के लिए बाजार जानकारी।", backHome:"MATRIX पर वापस", articleDisclaimer:"यह जानकारी सामान्य है और निवेश सलाह नहीं है।", insightsTitle:"मार्केट इनसाइट्स", insightsDesc:"बाजार समझने के लिए त्वरित संदर्भ।", insight1Title:"व्यापक दृष्टिकोण", insight1Desc:"बाजार भावना समझने के लिए कई परिसंपत्ति वर्गों को देखें।", insight2Title:"अस्थिरता देखें", insight2Desc:"बड़े प्रतिशत बदलाव अक्सर समाचार या मैक्रो घटनाओं का संकेत देते हैं।", insight3Title:"स्रोत सत्यापित करें", insight3Desc:"डेटा को संदर्भ के रूप में उपयोग करें और आधिकारिक स्रोतों से पुष्टि करें।", statsTitle:"एक नज़र में", statsAssets:"ट्रैक किए गए एसेट", statsCategories:"श्रेणियाँ", statsSources:"डेटा स्रोत", statsRefresh:"कैश रिफ्रेश", learnTitle:"मूल बातें सीखें", learnDesc:"नए बाजार पाठकों के लिए सरल गाइड।", learn1Title:"सोने को क्या प्रभावित करता है?", learn1Desc:"ब्याज दरें, मुद्रास्फीति अपेक्षाएं, USD और जोखिम भावना।", learn2Title:"फॉरेक्स बेसिक्स", learn2Desc:"मुद्रा जोड़े दो अर्थव्यवस्थाओं की सापेक्ष ताकत दर्शाते हैं।", learn3Title:"इंडेक्स का अर्थ", learn3Desc:"इंडेक्स शेयरों के समूह को ट्रैक करता है।", minutes:"~5 मिनट", errorPartial:"कुछ डेटा लोड नहीं हुआ:", assets:"एसेट" };
const es: Dict = { ...en, navHome:"Inicio", navMarket:"Mercado", navNews:"Noticias", navInsights:"Perspectivas", search:"Buscar activos...", themeLight:"Claro", themeDark:"Oscuro", heroBadge:"Información del mercado", heroTitle:"Sigue los mercados globales en un solo panel.", heroDesc:"Sigue oro, materias primas, forex, índices y cripto en un solo lugar. Datos solo informativos.", heroCta:"Ver mercado", heroCta2:"Leer noticias", marketTitle:"Resumen del mercado", marketDesc:"Precios recientes por categoría de activo.", update:"Actualización", loading:"Cargando datos...", show:"Mostrar", hide:"Ocultar", all:"Todos", commodities:"Materias primas", forex:"Forex", indices:"Índices", crypto:"Cripto", noResults:"No hay activos que coincidan.", newsTitle:"Noticias del mercado", newsLatest:"Últimas actualizaciones", showSummary:"Mostrar resumen", hideSummary:"Ocultar resumen", readArticle:"Leer artículo", sourcesTitle:"Fuentes de datos", sourcesDesc:"Datos de precios de APIs abiertas/públicas. No es asesoría de inversión.", showDetail:"Mostrar detalles", hideDetail:"Ocultar detalles", footerDesc:"Web simple para monitorear oro, materias primas, forex, índices y cripto.", footerNav:"Navegación", footerNote:"Aviso", footerNoteDesc:"Datos informativos, no asesoría de inversión.", footerCopy:"© 2026 MATRIX. Información de mercado para educación y referencia.", backHome:"Volver a MATRIX", articleDisclaimer:"Esta información es general y no constituye asesoría de inversión.", insightsTitle:"Perspectivas del mercado", insightsDesc:"Contexto rápido para leer el mercado.", insight1Title:"Diversifica tu vista", insight1Desc:"Sigue varias clases de activos para entender el sentimiento general.", insight2Title:"Observa la volatilidad", insight2Desc:"Grandes movimientos porcentuales suelen señalar noticias o eventos macro.", insight3Title:"Verifica fuentes", insight3Desc:"Usa los datos como referencia y confirma con fuentes oficiales.", statsTitle:"De un vistazo", statsAssets:"Activos seguidos", statsCategories:"Categorías", statsSources:"Fuentes de datos", statsRefresh:"Actualización caché", learnTitle:"Aprende lo básico", learnDesc:"Guías simples para nuevos lectores.", learn1Title:"¿Qué mueve el oro?", learn1Desc:"Tasas de interés, inflación, USD y sentimiento de riesgo.", learn2Title:"Básicos de forex", learn2Desc:"Los pares de divisas reflejan la fuerza relativa de dos economías.", learn3Title:"Qué es un índice", learn3Desc:"Un índice rastrea un grupo de acciones para representar un mercado.", minutes:"~5 min", errorPartial:"Algunos datos no se cargaron:", assets:"activos" };
const ar: Dict = { ...en, navHome:"الرئيسية", navMarket:"السوق", navNews:"الأخبار", navInsights:"رؤى", search:"ابحث عن الأصول...", themeLight:"فاتح", themeDark:"داكن", heroBadge:"معلومات السوق", heroTitle:"تتبع الأسواق العالمية في لوحة واحدة.", heroDesc:"تتبع الذهب والسلع والعملات والمؤشرات والعملات المشفرة في مكان واحد. البيانات للأغراض المعلوماتية فقط.", heroCta:"عرض السوق", heroCta2:"قراءة الأخبار", marketTitle:"نظرة عامة على السوق", marketDesc:"أحدث الأسعار عبر فئات الأصول.", update:"تحديث", loading:"جارٍ تحميل البيانات...", show:"عرض", hide:"إخفاء", all:"الكل", commodities:"السلع", forex:"فوركس", indices:"المؤشرات", crypto:"كريبتو", noResults:"لا توجد أصول مطابقة.", newsTitle:"أخبار السوق", newsLatest:"آخر التحديثات", showSummary:"عرض الملخص", hideSummary:"إخفاء الملخص", readArticle:"قراءة المقال", sourcesTitle:"مصادر البيانات", sourcesDesc:"بيانات الأسعار من واجهات برمجة مفتوحة/عامة. ليست نصيحة استثمارية.", showDetail:"عرض التفاصيل", hideDetail:"إخفاء التفاصيل", footerDesc:"موقع بسيط لمعلومات السوق لمتابعة الذهب والسلع والعملات والمؤشرات والعملات المشفرة.", footerNav:"التنقل", footerNote:"إخلاء مسؤولية", footerNoteDesc:"البيانات معلوماتية وليست نصيحة استثمارية.", footerCopy:"© 2026 MATRIX. معلومات السوق للتعليم والمرجع.", backHome:"العودة إلى MATRIX", articleDisclaimer:"هذه المعلومات عامة وليست نصيحة استثمارية.", insightsTitle:"رؤى السوق", insightsDesc:"سياق سريع لمساعدتك على قراءة السوق.", insight1Title:"نوّع نظرتك", insight1Desc:"تتبع فئات أصول متعددة لفهم معنويات السوق.", insight2Title:"راقب التقلب", insight2Desc:"الحركات الكبيرة غالبًا تشير إلى أخبار أو أحداث كلية.", insight3Title:"تحقق من المصادر", insight3Desc:"استخدم البيانات كمرجع وتحقق من المصادر الرسمية.", statsTitle:"لمحة سريعة", statsAssets:"الأصول المتتبعة", statsCategories:"الفئات", statsSources:"مصادر البيانات", statsRefresh:"تحديث الكاش", learnTitle:"تعلم الأساسيات", learnDesc:"أدلة بسيطة لقراء السوق الجدد.", learn1Title:"ما الذي يحرك الذهب؟", learn1Desc:"أسعار الفائدة والتضخم وقوة الدولار ومعنويات المخاطر.", learn2Title:"أساسيات الفوركس", learn2Desc:"أزواج العملات تعكس القوة النسبية بين اقتصادين.", learn3Title:"معنى المؤشر", learn3Desc:"المؤشر يتتبع مجموعة من الأسهم لتمثيل السوق.", minutes:"~5 دقائق", errorPartial:"فشل تحميل بعض البيانات:", assets:"أصول" };
const fr: Dict = { ...en, navHome:"Accueil", navMarket:"Marché", navNews:"Actualités", navInsights:"Analyses", search:"Rechercher des actifs...", themeLight:"Clair", themeDark:"Sombre", heroBadge:"Informations marché", heroTitle:"Suivez les marchés mondiaux dans un seul tableau de bord.", heroDesc:"Suivez l'or, les matières premières, le forex, les indices et la crypto en un seul endroit. Données à titre informatif.", heroCta:"Voir le marché", heroCta2:"Lire les actualités", marketTitle:"Aperçu du marché", marketDesc:"Derniers prix par catégorie d'actifs.", update:"Mise à jour", loading:"Chargement...", show:"Afficher", hide:"Masquer", all:"Tous", commodities:"Matières premières", forex:"Forex", indices:"Indices", crypto:"Crypto", noResults:"Aucun actif correspondant.", newsTitle:"Actualités marché", newsLatest:"Dernières mises à jour", showSummary:"Afficher le résumé", hideSummary:"Masquer le résumé", readArticle:"Lire l'article", sourcesTitle:"Sources de données", sourcesDesc:"Données issues d'API ouvertes/publiques. Pas un conseil en investissement.", showDetail:"Afficher les détails", hideDetail:"Masquer les détails", footerDesc:"Site simple d'information marché pour suivre or, matières premières, forex, indices et crypto.", footerNav:"Navigation", footerNote:"Avertissement", footerNoteDesc:"Données informatives, pas un conseil en investissement.", footerCopy:"© 2026 MATRIX. Informations marché pour l'éducation et la référence.", backHome:"Retour à MATRIX", articleDisclaimer:"Ces informations sont générales et ne constituent pas un conseil en investissement.", insightsTitle:"Analyses marché", insightsDesc:"Contexte rapide pour lire le marché.", insight1Title:"Diversifiez votre vue", insight1Desc:"Suivez plusieurs classes d'actifs pour comprendre le sentiment global.", insight2Title:"Surveillez la volatilité", insight2Desc:"Les grands mouvements signalent souvent des nouvelles ou événements macro.", insight3Title:"Vérifiez les sources", insight3Desc:"Utilisez les données comme référence et confirmez avec des sources officielles.", statsTitle:"En un coup d'œil", statsAssets:"Actifs suivis", statsCategories:"Catégories", statsSources:"Sources de données", statsRefresh:"Rafraîchissement cache", learnTitle:"Apprendre les bases", learnDesc:"Guides simples pour les nouveaux lecteurs.", learn1Title:"Qu'est-ce qui fait bouger l'or ?", learn1Desc:"Taux d'intérêt, inflation, USD et sentiment de risque.", learn2Title:"Bases du forex", learn2Desc:"Les paires de devises reflètent la force relative de deux économies.", learn3Title:"Sens d'un indice", learn3Desc:"Un indice suit un groupe d'actions pour représenter un marché.", minutes:"~5 min", errorPartial:"Certaines données n'ont pas pu être chargées :", assets:"actifs" };
const bn: Dict = { ...en, navHome:"হোম", navMarket:"মার্কেট", navNews:"খবর", navInsights:"ইনসাইট", search:"অ্যাসেট খুঁজুন...", themeLight:"লাইট", themeDark:"ডার্ক", heroBadge:"বাজার তথ্য", heroTitle:"একটি ড্যাশবোর্ডে বৈশ্বিক বাজার ট্র্যাক করুন।", heroDesc:"সোনা, কমোডিটি, ফরেক্স, সূচক এবং ক্রিপ্টো এক জায়গায় ট্র্যাক করুন। তথ্য শুধুমাত্র তথ্যের জন্য।", heroCta:"মার্কেট দেখুন", heroCta2:"খবর পড়ুন", marketTitle:"মার্কেট ওভারভিউ", marketDesc:"বিভিন্ন সম্পদ শ্রেণির সর্বশেষ মূল্য।", update:"আপডেট", loading:"ডেটা লোড হচ্ছে...", show:"দেখান", hide:"লুকান", all:"সব", commodities:"কমোডিটি", forex:"ফরেক্স", indices:"সূচক", crypto:"ক্রিপ্টো", noResults:"কোনো অ্যাসেট পাওয়া যায়নি।", newsTitle:"মার্কেট খবর", newsLatest:"সর্বশেষ আপডেট", showSummary:"সারাংশ দেখান", hideSummary:"সারাংশ লুকান", readArticle:"নিবন্ধ পড়ুন", sourcesTitle:"ডেটা উৎস", sourcesDesc:"মূল্য ডেটা ওপেন/পাবলিক API থেকে। বিনিয়োগ পরামর্শ নয়।", showDetail:"বিস্তারিত দেখান", hideDetail:"বিস্তারিত লুকান", footerDesc:"সোনা, কমোডিটি, ফরেক্স, সূচক এবং ক্রিপ্টো পর্যবেক্ষণের জন্য সহজ বাজার তথ্য ওয়েব।", footerNav:"নেভিগেশন", footerNote:"দাবিত্যাগ", footerNoteDesc:"ডেটা তথ্যমূলক, বিনিয়োগ পরামর্শ নয়।", footerCopy:"© 2026 MATRIX. শিক্ষা ও রেফারেন্সের জন্য বাজার তথ্য।", backHome:"MATRIX-এ ফিরে যান", articleDisclaimer:"এই তথ্য সাধারণ এবং বিনিয়োগ পরামর্শ নয়।", insightsTitle:"মার্কেট ইনসাইট", insightsDesc:"বাজার বুঝতে দ্রুত প্রেক্ষাপট।", insight1Title:"বিস্তৃত দেখুন", insight1Desc:"বাজার অনুভূতি বুঝতে একাধিক সম্পদ শ্রেণি ট্র্যাক করুন।", insight2Title:"উস্থিরতা দেখুন", insight2Desc:"বড় শতাংশ পরিবর্তন প্রায়ই খবর বা ম্যাক্রো ইভেন্ট নির্দেশ করে।", insight3Title:"উৎস যাচাই করুন", insight3Desc:"ডেটা রেফারেন্স হিসেবে ব্যবহার করুন এবং অফিসিয়াল উৎস যাচাই করুন।", statsTitle:"এক নজরে", statsAssets:"ট্র্যাক করা অ্যাসেট", statsCategories:"বিভাগ", statsSources:"ডেটা উৎস", statsRefresh:"ক্যাশ রিফ্রেশ", learnTitle:"বেসিক শিখুন", learnDesc:"নতুন পাঠকদের জন্য সহজ গাইড।", learn1Title:"সোনা কীভাবে চলে?", learn1Desc:"সুদের হার, মুদ্রাস্ফীতি, USD এবং ঝুঁকি অনুভূতি।", learn2Title:"ফরেক্স বেসিক", learn2Desc:"কারেন্সি পেয়ার দুই অর্থনীতির আপেক্ষিক শক্তি দেখায়।", learn3Title:"সূচকের অর্থ", learn3Desc:"একটি সূচক শেয়ারের একটি গ্রুপ ট্র্যাক করে।", minutes:"~৫ মিনিট", errorPartial:"কিছু ডেটা লোড হয়নি:", assets:"অ্যাসেট" };
const pt: Dict = { ...en, navHome:"Início", navMarket:"Mercado", navNews:"Notícias", navInsights:"Insights", search:"Buscar ativos...", themeLight:"Claro", themeDark:"Escuro", heroBadge:"Informação de mercado", heroTitle:"Acompanhe os mercados globais em um só painel.", heroDesc:"Acompanhe ouro, commodities, forex, índices e cripto em um só lugar. Dados apenas informativos.", heroCta:"Ver mercado", heroCta2:"Ler notícias", marketTitle:"Visão geral do mercado", marketDesc:"Preços recentes por categoria de ativo.", update:"Atualização", loading:"Carregando dados...", show:"Mostrar", hide:"Ocultar", all:"Todos", commodities:"Commodities", forex:"Forex", indices:"Índices", crypto:"Cripto", noResults:"Nenhum ativo encontrado.", newsTitle:"Notícias do mercado", newsLatest:"Últimas atualizações", showSummary:"Mostrar resumo", hideSummary:"Ocultar resumo", readArticle:"Ler artigo", sourcesTitle:"Fontes de dados", sourcesDesc:"Dados de preços de APIs abertas/públicas. Não é recomendação de investimento.", showDetail:"Mostrar detalhes", hideDetail:"Ocultar detalhes", footerDesc:"Site simples de informação de mercado para acompanhar ouro, commodities, forex, índices e cripto.", footerNav:"Navegação", footerNote:"Aviso", footerNoteDesc:"Dados informativos, não recomendação de investimento.", footerCopy:"© 2026 MATRIX. Informação de mercado para educação e referência.", backHome:"Voltar ao MATRIX", articleDisclaimer:"Esta informação é geral e não constitui recomendação de investimento.", insightsTitle:"Insights do mercado", insightsDesc:"Contexto rápido para ler o mercado.", insight1Title:"Diversifique sua visão", insight1Desc:"Acompanhe várias classes de ativos para entender o sentimento geral.", insight2Title:"Observe a volatilidade", insight2Desc:"Grandes movimentos percentuais geralmente sinalizam notícias ou eventos macro.", insight3Title:"Verifique fontes", insight3Desc:"Use dados como referência e confirme com fontes oficiais.", statsTitle:"Em resumo", statsAssets:"Ativos acompanhados", statsCategories:"Categorias", statsSources:"Fontes de dados", statsRefresh:"Atualização de cache", learnTitle:"Aprenda o básico", learnDesc:"Guias simples para novos leitores.", learn1Title:"O que move o ouro?", learn1Desc:"Juros, inflação, USD e sentimento de risco.", learn2Title:"Básico de forex", learn2Desc:"Pares de moedas refletem a força relativa de duas economias.", learn3Title:"O que é um índice", learn3Desc:"Um índice acompanha um grupo de ações para representar um mercado.", minutes:"~5 min", errorPartial:"Alguns dados falharam ao carregar:", assets:"ativos" };
const ur: Dict = { ...en, navHome:"ہوم", navMarket:"مارکیٹ", navNews:"خبریں", navInsights:"بصیرت", search:"اثاثے تلاش کریں...", themeLight:"لائٹ", themeDark:"ڈارک", heroBadge:"مارکیٹ معلومات", heroTitle:"ایک ڈیش بورڈ میں عالمی منڈیوں کو ٹریک کریں۔", heroDesc:"سونا، کموڈٹیز، فاریکس، انڈیکس اور کرپٹو ایک جگہ ٹریک کریں۔ ڈیٹا صرف معلومات کے لیے ہے۔", heroCta:"مارکیٹ دیکھیں", heroCta2:"خبریں پڑھیں", marketTitle:"مارکیٹ جائزہ", marketDesc:"مختلف اثاثہ زمروں کی تازہ ترین قیمتیں۔", update:"اپڈیٹ", loading:"ڈیٹا لوڈ ہو رہا ہے...", show:"دکھائیں", hide:"چھپائیں", all:"سب", commodities:"کموڈٹیز", forex:"فاریکس", indices:"انڈیکس", crypto:"کرپٹو", noResults:"کوئی اثاثہ نہیں ملا۔", newsTitle:"مارکیٹ خبریں", newsLatest:"تازہ ترین اپڈیٹس", showSummary:"خلاصہ دکھائیں", hideSummary:"خلاصہ چھپائیں", readArticle:"مضمون پڑھیں", sourcesTitle:"ڈیٹا ذرائع", sourcesDesc:"قیمتوں کا ڈیٹا اوپن/پبلک APIs سے ہے۔ سرمایہ کاری کی مشورہ نہیں۔", showDetail:"تفصیل دکھائیں", hideDetail:"تفصیل چھپائیں", footerDesc:"سونا، کموڈٹیز، فاریکس، انڈیکس اور کرپٹو کی نگرانی کے لیے سادہ مارکیٹ معلومات ویب۔", footerNav:"نیویگیشن", footerNote:"دستبرداری", footerNoteDesc:"ڈیٹا معلوماتی ہے، سرمایہ کاری کی مشورہ نہیں۔", footerCopy:"© 2026 MATRIX. تعلیم اور حوالہ کے لیے مارکیٹ معلومات۔", backHome:"MATRIX پر واپس", articleDisclaimer:"یہ معلومات عمومی ہے اور سرمایہ کاری کی مشورہ نہیں۔", insightsTitle:"مارکیٹ بصیرت", insightsDesc:"مارکیٹ سمجھنے کے لیے فوری سیاق و سباق۔", insight1Title:"وسیع نظر رکھیں", insight1Desc:"مارکیٹ جذبات سمجھنے کے لیے متعدد اثاثہ کلاسز ٹریک کریں۔", insight2Title:"اتار چڑھاؤ دیکھیں", insight2Desc:"بڑی فیصد حرکتیں اکثر خبریں یا میکرو واقعات کا اشارہ دیتی ہیں۔", insight3Title:"ذرائع کی تصدیق کریں", insight3Desc:"ڈیٹا کو حوالہ کے طور پر استعمال کریں اور سرکاری ذرائع سے تصدیق کریں۔", statsTitle:"ایک نظر میں", statsAssets:"ٹریک شدہ اثاثے", statsCategories:"زمرے", statsSources:"ڈیٹا ذرائع", statsRefresh:"کیش ریفریش", learnTitle:"بنیاد سیکھیں", learnDesc:"نئے قارئین کے لیے سادہ رہنما۔", learn1Title:"سونا کیسے حرکت کرتا ہے؟", learn1Desc:"شرح سود، مہنگائی، USD اور رسک جذبات۔", learn2Title:"فاریکس بنیادیات", learn2Desc:"کرنسی جوڑے دو معیشتوں کی نسبتی طاقت ظاہر کرتے ہیں۔", learn3Title:"انڈیکس کا مطلب", learn3Desc:"انڈیکس حصص کے گروپ کو ٹریک کرتا ہے۔", minutes:"~5 منٹ", errorPartial:"کچھ ڈیٹا لوڈ نہیں ہوا:", assets:"اثاثے" };

const DICTS: Record<Locale, Dict> = { en, zh, hi, es, ar, fr, bn, pt, id, ur };

type I18nCtx = {
 locale: Locale;
 setLocale: (l: Locale) => void;
 t: (key: string) => string;
 dir: "ltr" | "rtl";
};

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
 const [locale, setLocaleState] = useState<Locale>("id");

 useEffect(() => {
 try {
 const saved = localStorage.getItem("locale") as Locale | null;
 if (saved && DICTS[saved]) setLocaleState(saved);
 } catch {}
 }, []);

 function setLocale(l: Locale) {
 setLocaleState(l);
 try { localStorage.setItem("locale", l); } catch {}
 document.documentElement.lang = l;
 document.documentElement.dir = l === "ar" || l === "ur" ? "rtl" : "ltr";
 }

 useEffect(() => {
 document.documentElement.lang = locale;
 document.documentElement.dir = locale === "ar" || locale === "ur" ? "rtl" : "ltr";
 }, [locale]);

 const value = useMemo<I18nCtx>(() => ({
 locale,
 setLocale,
 t: (key: string) => DICTS[locale]?.[key] ?? DICTS.en[key] ?? key,
 dir: locale === "ar" || locale === "ur" ? "rtl" : "ltr",
 }), [locale]);

 return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
 const ctx = useContext(Ctx);
 if (!ctx) throw new Error("useI18n must be used within I18nProvider");
 return ctx;
}

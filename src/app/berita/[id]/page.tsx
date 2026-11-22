import { notFound } from "next/navigation";
import { NEWS } from "@/lib/mock-data";
import { ArticleDetail } from "@/components/article-detail";

type Props = {
 params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
 return NEWS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props) {
 const { id } = await params;
 const item = NEWS.find((n) => n.id === id);
 if (!item) return { title: "Artikel tidak ditemukan" };
 return {
 title: `${item.title} — MATRIX`,
 description: item.summary,
 };
}

export default async function BeritaDetailPage({ params }: Props) {
 const { id } = await params;
 const item = NEWS.find((n) => n.id === id);
 if (!item) notFound();

 return <ArticleDetail item={item} />;
}

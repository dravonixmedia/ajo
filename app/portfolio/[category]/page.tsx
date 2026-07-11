import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryGallery from "@/components/CategoryGallery";
import { ALL_CATEGORY_SLUGS } from "@/lib/content/photos";
import { getCategory } from "@/lib/content/photoScanner";

export function generateStaticParams() {
  return ALL_CATEGORY_SLUGS.map((slug) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  const title = `${category.title} Photography | Ajo Abraham — Kerala Photographer`;
  const description = `${category.description} View the full ${category.title.toLowerCase()} portfolio by Kerala photographer Ajo Abraham.`;
  const cover = category.photos[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: cover ? [{ url: cover.src }] : undefined,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return <CategoryGallery category={category} />;
}

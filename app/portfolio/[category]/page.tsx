import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryGallery from "@/components/CategoryGallery";
import { getCategory, portfolioCategories } from "@/lib/content/photos";

export function generateStaticParams() {
  return portfolioCategories.map((c) => ({ category: c.slug }));
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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: category.photos[category.coverIndex].src }],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return <CategoryGallery category={category} />;
}

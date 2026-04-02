import CategoryPageClient from './CategoryPageClient';

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <CategoryPageClient category={category} />;
}

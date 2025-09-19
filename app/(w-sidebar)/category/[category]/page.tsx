import ItemGrid from "@/components/marketplace/item-grid";

type TParams = Promise<{ category: string }>;

export default async function CategoryPage({ params }: { params: TParams }) {
  const { category }: { category: string } = await params;

  const formattedCategory = decodeURIComponent(category).replace(/-/g, " ");

  return (
    <div>
      <h2 className="capitalize font-bold text-2xl">{formattedCategory}</h2>
      <ItemGrid category={formattedCategory} />
    </div>
  );
}

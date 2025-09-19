import ItemGrid from "@/components/marketplace/item-grid";

// allow both runtime object and Promise
type TParams = { category: string } | Promise<{ category: string }>;

export default async function CategoryPage({ params }: { params: TParams }) {
  // normalize whether it's a Promise or not
  const resolvedParams = await Promise.resolve(params);
  const { category } = resolvedParams;

  const formattedCategory = decodeURIComponent(category).replace(/-/g, " ");

  return (
    <div>
      <h2 className="capitalize font-bold text-2xl">{formattedCategory}</h2>
      <ItemGrid category={formattedCategory} />
    </div>
  );
}

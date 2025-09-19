import { use } from "react";
import ItemGrid from "@/components/marketplace/item-grid";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);

  const formattedCategory = decodeURIComponent(category).replace(/-/g, " ");

  return (
    <div>
      <h2 className="capitalize font-bold text-2xl">{formattedCategory}</h2>
      <ItemGrid category={formattedCategory} />
    </div>
  );
}

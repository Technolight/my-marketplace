import { use } from "react";
import ItemGrid from "@/components/marketplace/item-grid";

type TParams = Promise<{ category: string }>;

export default function CategoryPage(props: { params: TParams }) {
  const { category } = use(props.params);

  const formattedCategory = decodeURIComponent(category).replace(/-/g, " ");

  return (
    <div>
      <h2 className="capitalize font-bold text-2xl">{formattedCategory}</h2>
      <ItemGrid category={formattedCategory} />
    </div>
  );
}

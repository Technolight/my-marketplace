import { supabase } from "@/lib/supabaseClient";
import ItemGrid from "@/components/marketplace/item-grid";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  const formattedCategory = decodeURIComponent(category).replace(/-/g, " ");

  return (
    <div>
      <h2 className="capitalize font-bold text-2xl">{formattedCategory}</h2>
      <ItemGrid category={formattedCategory} />
    </div>
  );
}

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

  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .eq("category", category);

  if (error) {
    console.error(error);
    return <div>Error loading listings.</div>;
  }

  return (
    <div>
      <h2 className="capitalize font-bold text-2xl mb-2">
        {formattedCategory}
      </h2>
      <ItemGrid category={formattedCategory} />
    </div>
  );
}

import { supabase } from "@/lib/supabaseClient";
import ItemGrid, { Listing } from "@/components/marketplace/item-grid";

interface Props {
  params: { category: string };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = params;
  const formattedCategory = decodeURIComponent(category).replace(/-/g, " ");

  // Correct typing for Supabase v2
  const { data, error } = await supabase.from("listings").select("*"); // no <Listing> here

  if (error) {
    console.error(error);
    return <div>Error loading listings.</div>;
  }

  // TypeScript cast the returned data
  const listings = data as Listing[] | null;

  return (
    <div>
      <h2 className="capitalize font-bold text-2xl mb-2">
        {formattedCategory}
      </h2>
      {/* ItemGrid handles fetching itself */}
      <ItemGrid category={formattedCategory} />
    </div>
  );
}

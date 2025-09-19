import { supabase } from "@/lib/supabaseClient";
import ItemGrid, { Listing } from "@/components/marketplace/item-grid";

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;
  const formattedCategory = decodeURIComponent(category).replace(/-/g, " ");

  // Optional: fetch listings server-side for logging/debugging
  // ItemGrid will still fetch listings client-side
  try {
    const { data, error } = await supabase.from("listings").select("*");
    if (error) {
      console.error("Supabase error:", error);
    } else {
      const listings = data as Listing[];
      console.log(
        `Fetched ${listings.length} listings for category "${formattedCategory}"`
      );
    }
  } catch (err) {
    console.error("Unexpected error fetching listings:", err);
  }

  return (
    <div>
      <h2 className="capitalize font-bold text-2xl mb-2">
        {formattedCategory}
      </h2>
      {/* ItemGrid handles client-side fetching & filtering */}
      <ItemGrid category={formattedCategory} />
    </div>
  );
}

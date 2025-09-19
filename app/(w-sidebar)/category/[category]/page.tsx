import { supabase } from "@/lib/supabaseClient";
import ItemGrid from "@/components/marketplace/item-grid";
import React, { JSX } from "react";

interface Props {
  params: { category: string };
}

// Mark return type explicitly as JSX.Element
export default async function CategoryPage({
  params,
}: Props): Promise<JSX.Element> {
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

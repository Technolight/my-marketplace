import { supabase } from "@/lib/supabaseClient";
import Item from "@/components/marketplace/item";
import { notFound } from "next/navigation";

export default async function ItemPage({ params }: { params: { id: string } }) {
  const { data: listingData, error: listingError } = await supabase
    .from("listings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (listingError || !listingData) {
    notFound();
  }

  let vehicleData = null;
  if (listingData.category?.toLowerCase() === "vehicles") {
    const { data: vData, error: vError } = await supabase
      .from("vehicles")
      .select("year, make, model, mileage")
      .eq("listing_id", params.id)
      .single();

    if (!vError && vData) {
      vehicleData = vData;
    }
  }

  const listing = {
    id: listingData.id,
    title: listingData.title,
    price: listingData.price,
    location: listingData.location,
    description: listingData.description,
    email: listingData.seller_email,
    folderPath: listingData.image_url || null,
    created_at: listingData.created_at,

    year: vehicleData?.year,
    make: vehicleData?.make,
    model: vehicleData?.model,
    mileage: vehicleData?.mileage,
  };

  return <Item {...listing} />;
}

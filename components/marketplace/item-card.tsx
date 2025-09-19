"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { formatPrice, formatMileage } from "@/components/formatter";

type ItemProps = {
  id?: string;
  image_url: string | null;
  title: string;
  price: number;
  location: string;
};

const ItemCard = ({ id, image_url, title, price, location }: ItemProps) => {
  const [firstPhotoUrl, setFirstPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchFirstPhoto = async () => {
      if (!image_url) return;

      const { data, error } = await supabase.storage
        .from("listing-images")
        .list(image_url, {
          limit: 1,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) {
        console.error("Error fetching image:", error);
        return;
      }

      if (data && data.length > 0) {
        const { data: publicUrlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(`${image_url}/${data[0].name}`);
        setFirstPhotoUrl(publicUrlData.publicUrl);
      }
    };

    fetchFirstPhoto();
  }, [image_url]);

  return (
    <Link href={`/item/${id}`}>
      <div className="rounded-lg overflow-hidden transition-transform duration-300 hover:scale-103">
        <div className="relative aspect-square w-full">
          <Image
            src={firstPhotoUrl || "/placeholder.png"}
            alt={title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="mt-2">
          <h2 className="text-lg font-semibold">{formatPrice(price)}</h2>
          <h3 className="truncate">{title}</h3>
          <span className="text-sm text-muted-foreground">{location}</span>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;

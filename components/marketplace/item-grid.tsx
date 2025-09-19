"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ItemCard from "./item-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type Listing = {
  id: string;
  title: string;
  price: number;
  location: string;
  image_url: string | null;
};

type Props = {
  category?: string;
};

export const unslug = (slug: string) => {
  const decoded = decodeURIComponent(slug);

  return decoded
    .split("-")
    .map((word) =>
      word
        .split(/(&|and)/i)
        .map((w) => w.trim())
        .map((w) =>
          w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1) : ""
        )
        .join(" ")
    )
    .join(" ");
};

const ItemGrid = ({ category }: Props) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchListings = async () => {
    setLoading(true);

    let query = supabase
      .from("listings")
      .select("id, title, price, location, image_url")
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", unslug(category));
    }

    if (search.trim()) {
      query = query.ilike("title", `%${search.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching listings:", error);
    } else {
      setListings(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, [category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4 w-full">
        <Input
          type="text"
          className="flex-1"
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          type="submit"
          className="bg-[#1877F2] hover:bg-[rgb(50,136,255)] active:bg-[rgb(13,77,165)]"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <ItemCard
              key={listing.id}
              id={listing.id}
              image_url={listing.image_url}
              title={listing.title}
              price={listing.price}
              location={listing.location}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            {loading ? "Loading..." : "No listings found."}
          </p>
        )}
      </div>
    </div>
  );
};

export default ItemGrid;

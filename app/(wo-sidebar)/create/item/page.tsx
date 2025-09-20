"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import Item from "@/components/marketplace/item";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // 👈 router

const categories = [
  "Property Rentals",
  "Apparel",
  "Classifieds",
  "Electronics",
  "Entertainment",
  "Family",
  "Free Stuff",
  "Garden & Outdoor",
  "Hobbies",
  "Home Goods",
  "Home Improvement",
  "Home Sales",
  "Musical Instrument",
  "Office Supplies",
  "Pet Supplies",
  "Sporting Goods",
  "Toys & Games",
];

const ItemPage = () => {
  const router = useRouter(); // 👈 init router

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setPhotos((prev) => [...prev, ...acceptedFiles]);
      if (photos.length === 0 && acceptedFiles.length > 0) {
        setSelectedIndex(0);
      }
    },
    [photos]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: 5 * 1024 * 1024,
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let folderPath: string | null = null;

      if (photos.length > 0) {
        folderPath = `${Date.now()}-${title.replace(/\s+/g, "-")}`;

        for (const file of photos) {
          const filePath = `${folderPath}/${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("listing-images")
            .upload(filePath, file);

          if (uploadError) throw uploadError;
        }
      }

      const { data: listingData, error: insertError } = await supabase
        .from("listings")
        .insert({
          title,
          description,
          price: parseFloat(price),
          category,
          seller_email: email,
          image_url: folderPath,
          location: location || "Palo Alto, CA",
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      if (listingData?.id) {
        toast.success("Listing created successfully!", { duration: 3000 });

        // ✅ Redirect after 1.5s so toast shows
        setTimeout(() => {
          router.push(`/item/${listingData.id}`);
        }, 1500);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        toast.error("Error creating listing: " + err.message, {
          duration: 5000,
        });
      } else {
        console.error(err);
        toast.error("An unexpected error occurred", { duration: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div>
          <h2 className="font-semibold mb-2">Information</h2>
          <div
            {...getRootProps()}
            className="flex h-40 w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-gray-500 text-sm">Drop the files here...</p>
            ) : (
              <div className="text-center text-sm text-gray-500">
                <p className="mb-1">📷 Drag & drop or click to add photos</p>
                <p className="text-xs">JPEG, PNG, or WebP (max 5MB)</p>
              </div>
            )}
          </div>
        </div>

        <Input
          placeholder="Title * — What are you selling?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Select onValueChange={(val) => setCategory(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Category * — Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Price * — 0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <Input
          placeholder="Location — Palo Alto, CA"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Input
          type="email"
          placeholder="Contact Email * — your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Textarea
          placeholder="Description — Describe your item..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#1877F2] hover:bg-[rgb(50,136,255)] active:bg-[rgb(13,77,165)]"
        >
          {loading ? "Creating..." : "Create Listing"}
        </Button>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Preview</h2>
        <Item
          photos={photos}
          title={title}
          price={parseFloat(price) || undefined}
          location={location}
          description={description}
          email={email}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default ItemPage;

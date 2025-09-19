"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  formatPrice,
  formatMileage,
  formatTimeAgo,
} from "@/components/formatter";

export type ItemProps = {
  photos?: (File | string)[];
  folderPath?: string;
  title?: string;
  price?: number;
  location?: string;
  description?: string;
  email?: string;
  className?: string;
  created_at?: string;

  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  id?: string; // 👈 needed to link messages to a listing
};

const Item = ({
  photos = [],
  folderPath,
  title = "Title",
  price,
  location,
  description,
  email = "seller@email.com",
  className,
  created_at,
  year,
  make,
  model,
  mileage,
  id,
}: ItemProps) => {
  const pathname = usePathname();
  const isCreatePage = pathname.startsWith("/create");
  const [loading, setLoading] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("I'm interested in your item!");
  const [fetchedPhotos, setFetchedPhotos] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const getImageSrc = (photo: File | string) =>
    typeof photo === "string" ? photo : URL.createObjectURL(photo);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!folderPath || isCreatePage) return;

      const { data, error } = await supabase.storage
        .from("listing-images")
        .list(folderPath);

      if (error) {
        console.error("Error fetching photos:", error);
        return;
      }

      const urls = data.map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(`${folderPath}/${file.name}`);
        return publicUrlData.publicUrl;
      });

      setFetchedPhotos(urls);
      setSelectedIndex(0);
    };

    fetchPhotos();
  }, [folderPath, isCreatePage]);

  const displayPhotos = isCreatePage ? photos : fetchedPhotos;

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? displayPhotos.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === displayPhotos.length - 1 ? 0 : prev + 1
    );
  };

  const handleSendMessage = async () => {
    if (!buyerEmail || !message.trim()) {
      alert("Please provide your email and a message.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("messages").insert({
      listing_id: id,
      buyer_email: buyerEmail,
      seller_email: email,
      message: message,
    });

    setLoading(false);

    if (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } else {
      alert("Message sent successfully!");
      setMessage("I'm interested in your item!");
      setBuyerEmail("");
    }
  };

  return (
    <Card className={cn("block", className)}>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="relative h-96 md:h-auto rounded-md md:aspect-square flex items-center justify-center mb-4 overflow-hidden">
              {displayPhotos.length > 0 ? (
                <>
                  <Image
                    src={getImageSrc(displayPhotos[selectedIndex])}
                    alt="Blurred background"
                    fill
                    className="object-cover blur-lg scale-110"
                  />

                  <Image
                    src={getImageSrc(displayPhotos[selectedIndex])}
                    alt={`Preview ${selectedIndex + 1}`}
                    fill
                    className="object-contain relative z-10"
                  />

                  {displayPhotos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-1 rounded-full z-20"
                      >
                        ‹
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-1 rounded-full z-20"
                      >
                        ›
                      </button>
                    </>
                  )}
                </>
              ) : (
                "Image Preview"
              )}
            </div>

            {displayPhotos.length > 1 && (
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {displayPhotos.map((file, index) => (
                  <button
                    key={index}
                    className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                      selectedIndex === index
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <Image
                      src={getImageSrc(file)}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <h3 className="text-2xl font-bold">{title || "Title"}</h3>
              <p className="text-2xl font-semibold">{formatPrice(price)}</p>
            </div>

            {year && make && model && (
              <p className="text-sm text-gray-600">{`${year} ${make} ${model}`}</p>
            )}
            {mileage && (
              <p className="text-sm text-gray-600">{formatMileage(mileage)}</p>
            )}

            <p className="text-sm text-gray-500">
              Listed {formatTimeAgo(created_at)}{" "}
              {location ? `in ${location}` : "in [Location]"}
            </p>

            {description && (
              <div>
                <p className="font-semibold mt-4">Description</p>
                <p className="text-sm text-gray-700">{description}</p>
              </div>
            )}

            <div>
              <p className="mt-4 font-semibold">Seller Information</p>
              <p className="text-sm text-gray-500">
                {email || "[Seller Email]"}
              </p>
            </div>

            {!isCreatePage && (
              <div className="space-y-2">
                <p className="mt-4 font-semibold">Contact Seller</p>
                <Input
                  type="email"
                  placeholder="Your email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                />
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-32"
                />
                <Button
                  disabled={loading}
                  onClick={handleSendMessage}
                  className="w-full bg-[#1877F2] hover:bg-[rgb(50,136,255)] active:bg-[rgb(13,77,165)]"
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Item;

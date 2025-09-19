"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { formatPrice } from "@/components/formatter";

type ChatWindowProps = {
  listingId: string;
  buyerEmail: string;
  sellerEmail: string;
  onClose: () => void;
};

type Message = {
  id: string;
  message: string;
  buyer_email: string;
  seller_email: string;
  created_at: string;
  listings?: {
    title: string;
    price: number;
    location: string;
    image_url: string;
  };
};

const ChatWindow = ({
  listingId,
  buyerEmail,
  sellerEmail,
  onClose,
}: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [listingData, setListingData] = useState<{
    title: string;
    price: number;
    location: string;
    image_url: string | null;
  } | null>(null);
  const [firstPhotoUrl, setFirstPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          listings ( title, price, location, image_url )
        `
        )
        .eq("listing_id", listingId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data as Message[]);
        if (data.length > 0 && (data[0] as any).listings) {
          const listing = (data[0] as any).listings;
          setListingData(listing);

          if (listing.image_url) {
            const { data: files } = await supabase.storage
              .from("listing-images")
              .list(listing.image_url, {
                limit: 1,
                sortBy: { column: "name", order: "asc" },
              });

            if (files && files.length > 0) {
              const { data: publicUrlData } = supabase.storage
                .from("listing-images")
                .getPublicUrl(`${listing.image_url}/${files[0].name}`);
              setFirstPhotoUrl(publicUrlData.publicUrl);
            }
          }
        }
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages:listing_id=eq.${listingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `listing_id=eq.${listingId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listingId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from("messages").insert({
      listing_id: listingId,
      buyer_email: buyerEmail,
      seller_email: sellerEmail,
      message: newMessage,
    });

    if (!error) {
      setNewMessage("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            {listingData ? listingData.title : `Chat with ${sellerEmail}`}
          </CardTitle>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X size={16} />
          </button>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto border p-2 rounded-md mb-2 bg-gray-50">
            {listingData && (
              <Link
                href={`/item/${listingId}`}
                className="flex items-center gap-2 mb-4 border rounded-md bg-white hover:bg-gray-50 p-2 transition"
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={firstPhotoUrl || "/placeholder.png"}
                    alt={listingData.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <h2 className="text-sm font-medium truncate">
                    {listingData.title}
                  </h2>
                  <span className="text-xs text-gray-500 truncate">
                    {listingData.location}
                  </span>
                  <span className="text-xs font-semibold text-blue-600">
                    {formatPrice(listingData.price)}
                  </span>
                </div>
              </Link>
            )}

            {/* Actual chat messages */}
            {messages.length === 0 ? (
              <p className="text-sm text-gray-500">No messages yet.</p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`mb-2 ${
                    m.buyer_email === buyerEmail ? "text-right" : "text-left"
                  }`}
                >
                  <p
                    className={`inline-block px-3 py-1 rounded-lg text-sm ${
                      m.buyer_email === buyerEmail
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {m.message}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button
              onClick={handleSend}
              className="bg-[#1877F2] hover:bg-[rgb(50,136,255)] active:bg-[rgb(13,77,165)]"
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatWindow;

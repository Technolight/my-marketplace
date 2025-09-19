"use client";

import { Bell, Mail, User } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import SideBar, { Selling } from "@/components/layout/sidebar";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import ChatWindow from "@/components/chatwindow";

type Conversation = {
  listing_id: string;
  seller_email: string;
  title: string;
};

const Header = () => {
  const [openCategories, setOpenCategories] = useState(false);
  const [openSelling, setOpenSelling] = useState(false);
  const [openConvos, setOpenConvos] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);

  const userEmail = "gabstorres21@gmail.com";

  useEffect(() => {
    if (!userEmail) return;

    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          listing_id,
          seller_email,
          listings ( title )
        `
        )
        .eq("buyer_email", userEmail);

      console.log("userEmail:", userEmail);
      console.log("messages data:", data);
      console.log("messages error:", error);

      if (!error && data) {
        const unique = Array.from(
          new Map(
            data.map((msg) => {
              let title = "Untitled Listing";

              if (msg.listings) {
                if (Array.isArray(msg.listings)) {
                  title = msg.listings[0]?.title ?? title;
                } else {
                  title = (msg.listings as { title: string }).title ?? title;
                }
              }

              return [
                msg.listing_id,
                {
                  listing_id: msg.listing_id,
                  seller_email: msg.seller_email,
                  title,
                },
              ];
            })
          ).values()
        ) as Conversation[];

        setConversations(unique);
      }
    };

    fetchConversations();
  }, [userEmail]);

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-[#1877F2] text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h2 className="font-bold text-2xl">
            <Link href="/">Marketplace</Link>
          </h2>
          <div className="flex flex-row space-x-4">
            <Dialog open={openConvos} onOpenChange={setOpenConvos}>
              <DialogTrigger asChild>
                <button className="hover:opacity-80">
                  <Mail strokeWidth={1} />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <h3 className="font-semibold text-lg mb-2">Your Messages</h3>
                {conversations.length === 0 ? (
                  <p className="text-sm text-gray-500">No conversations yet.</p>
                ) : (
                  <ul className="divide-y">
                    {conversations.map((c) => (
                      <li
                        key={c.listing_id}
                        className="p-2 cursor-pointer hover:bg-gray-100 rounded"
                        onClick={() => {
                          setActiveChat(c);
                          setOpenConvos(false);
                        }}
                      >
                        <p className="font-medium">{c.title}</p>
                        <p className="text-xs text-gray-500">
                          Seller: {c.seller_email}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </DialogContent>
            </Dialog>

            <button>
              <Bell strokeWidth={1} />
            </button>
            <button>
              <User strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div className="block md:hidden bg-zinc-100">
        <Dialog open={openCategories} onOpenChange={setOpenCategories}>
          <DialogTrigger asChild>
            <button className="ml-4 my-2 px-3 py-1 rounded-md border bg-gray-50 hover:bg-gray-100">
              Categories
            </button>
          </DialogTrigger>
          <DialogContent className="p-0 m-0 w-full">
            <SideBar onLinkClick={() => setOpenCategories(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={openSelling} onOpenChange={setOpenSelling}>
          <DialogTrigger asChild>
            <button className="ml-4 px-3 my-2 py-1 rounded-md border bg-gray-50 hover:bg-gray-100">
              Sell
            </button>
          </DialogTrigger>
          <DialogContent className="p-6 w-full sm:w-[600px]">
            <Selling onLinkClick={() => setOpenSelling(false)} />
          </DialogContent>
        </Dialog>
        <Separator orientation="horizontal" />
      </div>

      {activeChat && userEmail && (
        <ChatWindow
          listingId={activeChat.listing_id}
          buyerEmail={userEmail}
          sellerEmail={activeChat.seller_email}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default Header;

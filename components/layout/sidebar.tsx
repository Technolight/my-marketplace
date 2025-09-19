// sidebar.tsx
import React from "react";
import Link from "next/link";

const Selling = ({ onLinkClick }: { onLinkClick?: () => void }) => (
  <div>
    <h2 className="font-bold mb-4 text-lg">Create New Listing</h2>
    <ul className="space-y-4 text-sm ml-4">
      <li>
        <Link href="/create" onClick={onLinkClick}>
          Choose Listing Type
        </Link>
      </li>
      <li>Your listings</li>
      <li>Seller help</li>
    </ul>
  </div>
);

const Categories = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const items = [
    "Vehicles",
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
    "Buy and Sell groups",
  ];

  return (
    <div>
      <h2 className="font-bold mb-4 text-lg">Categories</h2>
      <ul className="space-y-4 text-sm ml-4">
        {items.map((category, index) => (
          <li key={index}>
            <Link
              href={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`} // generate slug
              onClick={onLinkClick}
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SideBar = ({ onLinkClick }: { onLinkClick?: () => void }) => (
  <div className="md:h-auto overflow-y-auto max-h-dvh w-full md:w-64 p-4 bg-white rounded-lg border border-gray-200 space-y-6">
    <div className="hidden sm:block">
      <Selling />
    </div>
    <Categories onLinkClick={onLinkClick} />
  </div>
);

export default SideBar;
export { Categories, Selling };

import ItemGrid from "@/components/marketplace/item-grid";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2 className="font-bold text-2xl mb-2">Today&apos;s picks</h2>
      <ItemGrid />
    </div>
  );
}

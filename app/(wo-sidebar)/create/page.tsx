import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, Package } from "lucide-react";
import Link from "next/link";
import React from "react";

const Create = () => {
  return (
    <div className="flex justify-center items-center flex-col">
      <h2 className="font-bold text-2xl mb-8">Choose listing type</h2>
      <div className="flex lg:flex-row flex-col space-y-4 space-x-4">
        <Link href="/create/item">
          <Card className="w-72 h-96">
            <CardHeader>
              <CardTitle>
                <Package strokeWidth={1} />
                <h3>Item For Sale</h3>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Create a single listing for one or more items to sell</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/create/vehicle">
          <Card className="w-72 h-96">
            <CardHeader>
              <CardTitle>
                <Car strokeWidth={1} />
                <h3>Vehicle For Sale</h3>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Sell a car, truck, or other type of vehicle</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Create;

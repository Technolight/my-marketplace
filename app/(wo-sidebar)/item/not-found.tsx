"use client";

import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold mb-4">Listing Not Found</h1>
      <p className="text-gray-600 mb-6">
        Oops! The listing you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-blue-600"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;

const formatPrice = (price?: number) => {
  if (price == null) return "Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatMileage = (mileage?: number) => {
  if (mileage == null) return null;
  return `${new Intl.NumberFormat("en-US").format(mileage)} miles`;
};

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return "some time ago";

  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600)
    return `${Math.floor(seconds / 60)} minute${
      Math.floor(seconds / 60) > 1 ? "s" : ""
    } ago`;
  if (seconds < 86400)
    return `${Math.floor(seconds / 3600)} hour${
      Math.floor(seconds / 3600) > 1 ? "s" : ""
    } ago`;
  if (seconds < 604800)
    return `${Math.floor(seconds / 86400)} day${
      Math.floor(seconds / 86400) > 1 ? "s" : ""
    } ago`;
  if (seconds < 2629800)
    return `${Math.floor(seconds / 604800)} week${
      Math.floor(seconds / 604800) > 1 ? "s" : ""
    } ago`;
  if (seconds < 31557600)
    return `${Math.floor(seconds / 2629800)} month${
      Math.floor(seconds / 2629800) > 1 ? "s" : ""
    } ago`;

  return `${Math.floor(seconds / 31557600)} year${
    Math.floor(seconds / 31557600) > 1 ? "s" : ""
  } ago`;
};

export { formatPrice, formatMileage, formatTimeAgo };

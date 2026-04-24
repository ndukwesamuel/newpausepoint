// ─── SHARED MARKETPLACE HELPERS ──────────────────────────────────────────────

export const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

export const fmtDate = (d) => {
  if (!d) return "";
  const now = new Date();
  const date = new Date(d);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

export const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

export const categoryColor = (c) =>
  ({
    Food: { bg: "#FAEEDA", color: "#BA7517" },
    Electronics: { bg: "#EEEDFE", color: "#534AB7" },
    Services: { bg: "#E1F5EE", color: "#1D9E75" },
    Furniture: { bg: "#FAECE7", color: "#D85A30" },
    Clothing: { bg: "#FBEAF0", color: "#D4537E" },
    Other: { bg: "#F3F4F6", color: "#374151" },
  })[c] || { bg: "#F3F4F6", color: "#374151" };

export const CATEGORIES = [
  "All",
  "Food",
  "Electronics",
  "Services",
  "Furniture",
  "Clothing",
  "Other",
];

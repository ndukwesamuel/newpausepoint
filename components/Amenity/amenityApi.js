import axios from "axios";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_CONFIG } from "../../hooks/api";

// Shared bits for the resident and estate-admin amenity screens.
// Backend: /api/v1/amenity (pausepointbackend/src/modules/amenity).

export const AMENITY_PATH = "api/v1/amenity";
export const AMENITY_KEYS = ["amenities", "amenity-reports-mine", "admin-amenities", "admin-amenity-reports"];

export const GREEN = "#10B981";

export const AMENITY_STATUS_CONFIG = {
  open: { label: "Open", bg: "#D1FAE5", text: "#065F46", dot: "#10B981" },
  closed: { label: "Closed", bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
  under_maintenance: { label: "Maintenance", bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
};

export const REPORT_STATUS_CONFIG = {
  open: { label: "Open", bg: "#FEE2E2", text: "#991B1B", icon: "alert-circle-outline" },
  in_progress: { label: "In Progress", bg: "#DBEAFE", text: "#1E40AF", icon: "progress-wrench" },
  resolved: { label: "Resolved", bg: "#D1FAE5", text: "#065F46", icon: "check-circle-outline" },
};

// Icons an admin can pick for an amenity (MaterialCommunityIcons names).
export const AMENITY_ICONS = [
  "pool", "dumbbell", "tennis", "basketball", "soccer", "ferris-wheel",
  "run-fast", "party-popper", "silverware-fork-knife", "car", "tree", "office-building",
];

export const formatDate = (value, long = false) =>
  value
    ? new Date(value).toLocaleDateString("en-NG", long
        ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
        : { day: "numeric", month: "short", year: "numeric" })
    : "";

export const money = (amount) => `₦${Number(amount || 0).toLocaleString("en-NG")}`;

// One mutation for every amenity write: { path, method?, body?, formData? }.
// Refreshes every amenity list afterwards.
export const useAmenityAction = () => {
  const { userDatav2 } = useSelector((state) => state?.authSlice);
  const token = userDatav2?.data?.token || "";
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ path = "", method = "POST", body, formData }) => {
      try {
        const response = await axios({
          url: `${API_CONFIG.BASE_URL}${AMENITY_PATH}${path}`,
          method,
          data: formData || body,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": formData ? "multipart/form-data" : "application/json",
          },
          timeout: 60000,
        });
        return response.data;
      } catch (error) {
        const data = error?.response?.data;
        const err = new Error(data?.message || error?.message || "Something went wrong. Please try again.");
        err.data = data;
        throw err;
      }
    },
    onSettled: () => {
      AMENITY_KEYS.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    },
  });
};

export const imageFile = (asset, fallbackName) => ({
  uri: asset.uri,
  name: asset.fileName || fallbackName,
  type: asset.mimeType || "image/jpeg",
});

import axios from "axios";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_CONFIG } from "../../hooks/api";

// Shared bits for the customer and runner errand screens.

export const GREEN = "#079669";
export const INK = "#14221D";
export const MUTED = "#738079";
export const SURFACE = "#F5F8F6";
export const money = (amount) => `₦${Number(amount || 0).toLocaleString("en-NG")}`;
export const kobo = (value) => Number(value || 0) / 100;

export const ERRAND_KEYS = ["customer-errands", "runner-errands", "runner-available", "runner-earnings", "errand-context"];

export const STATUS_LABELS = {
  pending: "Finding a runner",
  assigned: "Runner assigned",
  en_route: "On the way",
  picked_up: "Items collected",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_COLORS = {
  pending: { bg: "#FFF7E8", fg: "#A45D00" },
  assigned: { bg: "#EAF1FF", fg: "#2457C5" },
  en_route: { bg: "#EAF1FF", fg: "#2457C5" },
  picked_up: { bg: "#EAF1FF", fg: "#2457C5" },
  delivered: { bg: "#EAF7F1", fg: GREEN },
  completed: { bg: "#EAF7F1", fg: GREEN },
  cancelled: { bg: "#F3F4F6", fg: "#6B7280" },
};

export const EVENT_LABELS = {
  created: "Errand placed",
  accept: "Runner accepted",
  release: "Runner handed it back",
  start: "Runner on the way",
  purchase_submitted: "Receipt submitted",
  purchase_approved: "Extra cost approved",
  purchase_rejected: "Extra cost declined",
  pickup: "Items collected",
  deliver: "Delivered",
  complete: "Completed",
  cancel: "Cancelled",
  adminCancel: "Cancelled by PausePoint",
  adminComplete: "Completed by PausePoint",
};

export const errandItems = (errand) =>
  (errand?.pickupLocations || []).flatMap((location) => location.items || []);

export const formatDate = (value, withTime = false) =>
  value
    ? new Date(value).toLocaleString("en-NG", {
        day: "numeric",
        month: "short",
        ...(withTime ? { hour: "numeric", minute: "2-digit" } : { year: "numeric" }),
      })
    : "";

// One mutation for every errand action: { path, method?, body?, formData? }.
// The backend owns every rule; this just sends the request and refreshes
// the errand lists afterwards.
export const useErrandAction = () => {
  const { userDatav2 } = useSelector((state) => state?.authSlice);
  const token = userDatav2?.data?.token || "";
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ path, method = "POST", body, formData }) => {
      try {
        const response = await axios({
          url: `${API_CONFIG.BASE_URL}api/v1/errand${path}`,
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
    onSettled: (_data, _error, variables) => {
      if (variables?.path === "/quote") return;
      ERRAND_KEYS.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    },
  });
};

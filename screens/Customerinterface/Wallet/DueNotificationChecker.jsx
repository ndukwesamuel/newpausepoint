

import { useEffect } from "react";
import { Alert } from "react-native";
import { useFetchData_v2 } from "../../../hooks/Requestv2";

// ─── Due analysis ─────────────────────────────────────────────────────────────

const analyzeDue = (due) => {
  const now = Date.now();
  const dueDate = new Date(due.dueDate).getTime();
  const assignedAt = new Date(due.assignedAt).getTime();

  // startDate if available, otherwise use assignedAt as period start
  const startDate = due.startDate
    ? new Date(due.startDate).getTime()
    : assignedAt;

  const totalDuration = dueDate - startDate;
  const timeLeft = dueDate - now;
  const elapsed = now - startDate;

  const elapsedPercent =
    totalDuration > 0 ? (elapsed / totalDuration) * 100 : 100;

  const hoursLeft = timeLeft / (1000 * 60 * 60);

  // New due: assigned within last 24 hours — show every mount within this window
  const isNewDue = now - assignedAt < 24 * 60 * 60 * 1000;

  const isUnpaid = due.status === "unpaid" || due.status === "overdue";
  const isOverdue = due.isOverdue || timeLeft < 0;

  return { elapsedPercent, hoursLeft, isNewDue, isUnpaid, isOverdue };
};

// ─── Formatters ───────────────────────────────────────────────────────────────

const formatAmount = (amount) =>
  `₦${(amount || 0).toLocaleString("en-NG")}`;

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// ─── Alert builders ───────────────────────────────────────────────────────────

const showNewDueAlert = (due, onNavigate) => {
  Alert.alert(
    "📋 New Due Assigned",
    `"${due.title}" has been assigned to your household.\n\nAmount: ${formatAmount(due.amountDue)}\nDue: ${formatDate(due.dueDate)}`,
    [
      { text: "Dismiss", style: "cancel" },
      { text: "View Due", onPress: () => onNavigate(due) },
    ],
  );
};

const showHalfwayAlert = (due, onNavigate) => {
  Alert.alert(
    "⏳ Due Reminder",
    `"${due.title}" is halfway to its deadline and you haven't paid yet.\n\nAmount: ${formatAmount(due.amountDue)}\nDue: ${formatDate(due.dueDate)}`,
    [
      { text: "Dismiss", style: "cancel" },
      { text: "Pay Now " , onPress: () => onNavigate(due) },
    ],
  );
};

const showUrgentAlert = (due, hoursLeft, onNavigate) => {
  const daysLeft = Math.ceil(hoursLeft / 24);
  const timeLeftText =
    hoursLeft < 24 ? `${Math.ceil(hoursLeft)} hours` : `${daysLeft} days`;

  Alert.alert(
    "⚠️ Due Very Soon",
    `"${due.title}" is due in ${timeLeftText}. Please pay as soon as possible.\n\nAmount: ${formatAmount(due.amountDue)}`,
    [
      { text: "Dismiss", style: "cancel" },
      { text: "Pay Now", style: "destructive", onPress: () => onNavigate(due) },
    ],
  );
};

// Critical — NO dismiss, NO back button, must pay
const showCriticalAlert = (due, hoursLeft, onNavigate) => {
  const isAlreadyPast = hoursLeft < 0;
  const timeText = isAlreadyPast
    ? "This due is overdue!"
    : `Due in less than ${Math.ceil(Math.abs(hoursLeft))} hours!`;

  Alert.alert(
    "🚨 Payment Required",
    `"${due.title}" — ${timeText}\n\nAmount: ${formatAmount(due.amountDue)}\n\nYou must pay now to clear this due.`,
    [
      {
        text: "Pay Now",
        style: "destructive",
        onPress: () => onNavigate(due),
      },
    ],
    {
      cancelable: false, // Android back button won't close it
    },
  );
};

// ─── Core check logic ─────────────────────────────────────────────────────────
// No AsyncStorage — every mount checks fresh and shows if condition is true.
// One alert at a time — most critical tier wins.

const checkAndNotify = (dues, navigation) => {
  const onNavigate = (due) => {
    navigation.navigate("Due", { due });
  };

  for (const due of dues) {
    try {
      const { elapsedPercent, hoursLeft, isNewDue, isUnpaid, isOverdue } =
        analyzeDue(due);

      // ── Tier 1: Critical — overdue OR less than 24hrs left, unpaid ────────
      // No dismiss. Shows every mount until paid.
      if (isUnpaid && (isOverdue || hoursLeft < 24)) {
        showCriticalAlert(due, hoursLeft, onNavigate);
        return; // one alert at a time
      }

      // ── Tier 2: Urgent — 75%+ time elapsed (25% left), unpaid ─────────────
      // Dismissable. Shows every mount while condition is true.
      if (isUnpaid && elapsedPercent >= 75) {
        showUrgentAlert(due, hoursLeft, onNavigate);
        return;
      }

      // ── Tier 3: Halfway — 50%+ elapsed, unpaid ────────────────────────────
      // Dismissable. Shows every mount while condition is true.
 
    
      if (isUnpaid && elapsedPercent >= 50 && elapsedPercent < 75) {
        showHalfwayAlert(due, onNavigate);
        return;
      }

      // ── Tier 4: New due — assigned within last 24hrs ──────────────────────
      // Shows every mount within the 24hr window after assignedAt.
      // After 24hrs from assignedAt it stops showing automatically.
      if (isUnpaid && isNewDue) {
        showNewDueAlert(due, onNavigate);
        return;
      }
    } catch {
      continue; // skip this due silently, never crash
    }
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

const DueNotificationChecker = ({ navigation }) => {
  const { data: duesResponse } = useFetchData_v2(
    "api/v1/householdDue/user",
    "getUserHouseholdDues",
  );
  console.log({yyyy:duesResponse?.households?.dues?.unpaid});


  useEffect(() => {
    if (!duesResponse) return;

    const householdsRaw = duesResponse?.households;
    const householdEntry = Array.isArray(householdsRaw)
      ? householdsRaw[0]
      : householdsRaw;
    const allDues = householdEntry?.dues?.all || [];

    if (allDues.length === 0) return;

    // Small delay — let screen finish mounting before alert appears
    const timer = setTimeout(() => {
      checkAndNotify(allDues, navigation);
    }, 1500);

    return () => clearTimeout(timer);
  }, [duesResponse]);

  return null;
};

export default DueNotificationChecker;
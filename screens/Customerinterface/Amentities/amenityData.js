// amenityData.js — Mock data, replace with useFetchData_v2 calls when API is ready

export const AMENITY_STATUS = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
  UNDER_MAINTENANCE: "UNDER_MAINTENANCE",
};

export const REPORT_STATUS = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
};

export const MOCK_AMENITIES = [
  {
    _id: "a1",
    name: "Swimming Pool",
    description:
      "Olympic-size swimming pool with dedicated lanes for lap swimming and a shallow end for leisure.",
    location: "Block A — Near Main Gate",
    operatingHours: "6:00 AM – 9:00 PM",
    status: AMENITY_STATUS.OPEN,
    estimatedReopenDate: null,
    image:
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80",
    rules: [
      "No running on pool deck",
      "Shower before entering pool",
      "Children under 12 must be supervised",
      "No food or drinks in the pool area",
      "Swim caps required in lap lanes",
    ],
    iconName: "pool",
  },
  {
    _id: "a2",
    name: "Gymnasium",
    description:
      "Fully equipped gym with cardio machines, free weights, and a dedicated stretching zone.",
    location: "Block B — Ground Floor",
    operatingHours: "5:00 AM – 10:00 PM",
    status: AMENITY_STATUS.OPEN,
    estimatedReopenDate: null,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    rules: [
      "Wipe equipment after use",
      "Return weights to rack",
      "No sleeveless tops without inner shirt",
      "Closed shoes mandatory",
      "Max 1 hour on cardio machines during peak hours",
    ],
    iconName: "dumbbell",
  },
  {
    _id: "a3",
    name: "Tennis Court",
    description:
      "Two hard-surface tennis courts with floodlights for evening play.",
    location: "East Wing — Behind Clubhouse",
    operatingHours: "7:00 AM – 10:00 PM",
    status: AMENITY_STATUS.CLOSED,

    estimatedReopenDate: "2025-06-15",
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80",
    rules: [
      "Proper tennis attire required",
      "Book in advance during weekends",
      "Max 1.5 hour session if others are waiting",
      "No pets on court",
    ],
    iconName: "tennis",
  },
  {
    _id: "a4",
    name: "Clubhouse Hall",
    description:
      "Multi-purpose hall available for private events, community gatherings, and estate meetings.",
    location: "Central — Main Estate Road",
    operatingHours: "8:00 AM – 11:00 PM",

    status: AMENITY_STATUS.CLOSED,

    estimatedReopenDate: null,
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
    rules: [
      "Advance booking required for private events",
      "Clean up after use",
      "No smoking inside",
      "Noise curfew at 10:00 PM on weekdays",
    ],
    iconName: "office-building",
  },
  {
    _id: "a5",
    name: "Children's Playground",
    description:
      "Safe, fenced playground with swings, slides, and a sandpit for young residents.",
    location: "Block C — Green Area",
    operatingHours: "7:00 AM – 7:00 PM",
    status: AMENITY_STATUS.CLOSED,
    estimatedReopenDate: null,
    image:
      "https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=600&q=80",
    rules: [
      "Children must be supervised at all times",
      "No bikes or scooters inside playground",
      "Age limit: 12 years and below",
    ],
    iconName: "ferris-wheel",
  },
  {
    _id: "a6",
    name: "Jogging Track",
    description:
      "400m rubberised jogging track encircling the estate garden. Well-lit for early morning and evening runs.",
    location: "Perimeter — Full Estate Loop",
    operatingHours: "5:00 AM – 10:00 PM",

    status: AMENITY_STATUS.CLOSED,

    estimatedReopenDate: null,
    image:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80",
    rules: [
      "Run anti-clockwise only",
      "No cycling on track",
      "Earphones must allow ambient awareness",
    ],
    iconName: "run-fast",
  },
];

export const MOCK_MY_REPORTS = [
  {
    _id: "r1",
    amenity: { _id: "a2", name: "Gymnasium", iconName: "dumbbell" },
    description:
      "The treadmill on the far left has a broken safety clip and makes a grinding sound when running above 8 km/h.",
    photo: null,
    status: REPORT_STATUS.IN_PROGRESS,

    createdAt: "2025-05-10T09:23:00Z",
    resolvedAt: null,
  },
  {
    _id: "r2",
    amenity: { _id: "a1", name: "Swimming Pool", iconName: "pool" },
    description:
      "Pool lights on the deep end are not working. Very dark at evening hours.",
    photo: null,
    status: REPORT_STATUS.RESOLVED,
    createdAt: "2025-04-28T17:45:00Z",
    resolvedAt: "2025-05-02T14:00:00Z",
  },
  {
    _id: "r3",
    amenity: {
      _id: "a5",
      name: "Children's Playground",
      iconName: "ferris-wheel",
    },
    description:
      "One of the swings has a broken chain link. Could be dangerous for children.",
    photo: null,
    status: REPORT_STATUS.OPEN,
    createdAt: "2025-05-12T11:10:00Z",
    resolvedAt: null,
  },
];

// Status config — colors and labels
export const STATUS_CONFIG = {
  [AMENITY_STATUS.OPEN]: {
    // label: "Open",
    label: "Closed",

    bg: "#D1FAE5",
    text: "#065F46",
    dot: "#10B981",
  },
  [AMENITY_STATUS.CLOSED]: {
    label: "Closed",
    bg: "#FEE2E2",
    text: "#991B1B",
    dot: "#EF4444",
  },
  [AMENITY_STATUS.UNDER_MAINTENANCE]: {
    // label: "Maintenance",
    label: "Closed",

    bg: "#FEF3C7",
    text: "#92400E",
    dot: "#F59E0B",
  },
};

export const REPORT_STATUS_CONFIG = {
  [REPORT_STATUS.OPEN]: {
    // label: "Open",
    label: "Closed",

    bg: "#FEE2E2",
    text: "#991B1B",
    icon: "alert-circle-outline",
  },
  [REPORT_STATUS.IN_PROGRESS]: {
    // label: "In Progress",
    label: "Closed",

    bg: "#DBEAFE",
    text: "#1E40AF",
    icon: "progress-wrench",
  },
  [REPORT_STATUS.RESOLVED]: {
    // label: "Resolved",
    label: "Closed",

    bg: "#D1FAE5",
    text: "#065F46",
    icon: "check-circle-outline",
  },
};

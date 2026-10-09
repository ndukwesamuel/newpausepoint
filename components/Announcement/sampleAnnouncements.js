// Sample announcements in the shape we expect from the backend.
// Remove once the announcements endpoint is live.
//
// Fields:
//   id      unique id; each announcement is shown once per device
//   layout  "card" | "sheet" | "fullscreen"
//   media   { type: "lottie" | "image" | "video", source: url or require(...) }
//   cta     { text, route?, params? }; with a route, the button opens that screen

export const SAMPLE_ANNOUNCEMENTS = [
  {
    id: "sample-card-lottie",
    layout: "card",
    title: "Something new is here",
    body: "This is a centred card with a Lottie animation. Use it for quick feature highlights.",
    media: {
      type: "lottie",
      source: require("../../assets/Lottie/commingSoon.json"),
    },
    cta: { text: "Got it" },
  },
  {
    id: "sample-sheet-image",
    layout: "sheet",
    title: "Emergency alerts",
    body: "This is a bottom sheet with a transparent image. Tap outside or press back to close.",
    media: {
      type: "image",
      source: require("../../assets/images/emergency.png"),
    },
    cta: { text: "Got it" },
  },
  {
    id: "sample-fullscreen-video",
    layout: "fullscreen",
    title: "See it in action",
    body: "This is a full-screen splash with a video. Use it for walkthroughs of bigger features.",
    media: {
      type: "video",
      source:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    cta: { text: "Got it" },
  },
];

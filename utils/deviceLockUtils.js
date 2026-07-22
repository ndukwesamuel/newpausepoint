// Detects whether a given error message is one of our device-lock messages
// (from /signin-v2), and if so, which flavor: temporary pause vs permanent
// freeze. Returns null if the message isn't a device-lock error at all.
//
// Kept dependency-free (no React/RN imports) so both the Redux slice (.ts)
// and the modal component (.jsx) can use it without pulling anything extra in.

export const parseDeviceLockError = (message) => {
  if (!message || typeof message !== "string") return null;

  const isPause = message.includes("temporarily paused");
  const isFreeze = message.includes("frozen due to multiple device changes");

  if (!isPause && !isFreeze) return null;

  let minutesLeft = null;
  const match = message.match(/Try again in (\d+) minute/);
  if (match) {
    minutesLeft = parseInt(match[1], 10);
  }

  return {
    type: isFreeze ? "frozen" : "paused",
    minutesLeft,
  };
};
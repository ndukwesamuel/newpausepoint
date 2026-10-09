import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SAMPLE_ANNOUNCEMENTS } from "./sampleAnnouncements";

const SEEN_KEY = "seenAnnouncementIds";

// TODO: replace with the announcements API call once the backend is ready.
// Targeting (estate, role, app version) is decided by the backend.
const fetchAnnouncements = async () => SAMPLE_ANNOUNCEMENTS;

const getSeenIds = async () => {
  try {
    return JSON.parse(await AsyncStorage.getItem(SEEN_KEY)) || [];
  } catch {
    return [];
  }
};

// Handy while testing: clears the "already seen" list so samples show again
export const resetSeenAnnouncements = () => AsyncStorage.removeItem(SEEN_KEY);

// Returns the next unseen announcement and a function to mark it seen
export const useAnnouncements = () => {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [list, seen] = await Promise.all([
          fetchAnnouncements(),
          getSeenIds(),
        ]);
        if (active) setQueue(list.filter((a) => !seen.includes(a.id)));
      } catch (error) {
        console.log("Failed to load announcements", error);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const dismissCurrent = useCallback(async () => {
    const current = queue[0];
    if (!current) return;

    setQueue((q) => q.slice(1));
    const seen = await getSeenIds();
    await AsyncStorage.setItem(SEEN_KEY, JSON.stringify([...seen, current.id]));
  }, [queue]);

  return { current: queue[0], dismissCurrent };
};

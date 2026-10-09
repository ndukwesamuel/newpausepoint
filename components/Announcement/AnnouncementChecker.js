import React, { useEffect, useState } from "react";
import AnnouncementModal from "./AnnouncementModal";
import { useAnnouncements } from "./useAnnouncements";

// Delay before showing, so the screen behind has loaded and the previous
// pop-up has finished closing
const SHOW_DELAY_MS = 800;

// Shows unseen announcements one after another. Mount once on Home.
const AnnouncementChecker = ({ navigation }) => {
  const { current, dismissCurrent } = useAnnouncements();
  const [shown, setShown] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!current) return;

    const timer = setTimeout(() => {
      setShown(current);
      setVisible(true);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [current]);

  const handleClose = () => {
    setVisible(false);
    dismissCurrent();
  };

  const handleCtaPress = () => {
    handleClose();
    if (shown?.cta?.route) {
      navigation.navigate(shown.cta.route, shown.cta.params);
    }
  };

  return (
    <AnnouncementModal
      announcement={shown}
      visible={visible}
      onClose={handleClose}
      onCtaPress={handleCtaPress}
    />
  );
};

export default AnnouncementChecker;

import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Linking, Modal, Pressable, Text, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./errandStyles";
import { EVENT_LABELS, GREEN, INK, MUTED, STATUS_COLORS, STATUS_LABELS, errandItems, formatDate, kobo, money } from "./errandApi";

// Header for errand sub-screens, styled like the app's stack headers
// (BackArrow in Usernaviagetion.js): plain arrow left, centred title, and
// pushed below the status bar.
export const ScreenHeader = ({ title, onBack }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.stackHeader, { paddingTop: insets.top }]}>
      <View style={styles.stackHeaderBar}>
        <Pressable onPress={onBack} style={styles.stackBack} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} accessibilityRole="button" accessibilityLabel="Go back">
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </Pressable>
        <Text style={styles.stackTitle} numberOfLines={1}>{title}</Text>
        <View style={styles.stackSide} />
      </View>
    </View>
  );
};

export const Field = ({ label, value, onChangeText, placeholder, multiline, keyboardType }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#A1ADA6"
      style={[styles.input, multiline && styles.multiline]}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
      keyboardType={keyboardType || "default"}
      autoCapitalize="sentences"
    />
  </View>
);

export const StatusPill = ({ status }) => {
  const color = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <View style={[styles.statusPill, { backgroundColor: color.bg }]}>
      <View style={[styles.statusDot, { backgroundColor: color.fg }]} />
      <Text style={[styles.statusText, { color: color.fg }]}>{STATUS_LABELS[status] || status}</Text>
    </View>
  );
};

// The five stages a customer sees, in order. Completed shares the last dot.
export const PROGRESS_STEPS = [
  { status: "pending", label: "Placed" },
  { status: "assigned", label: "Runner" },
  { status: "en_route", label: "On the way" },
  { status: "picked_up", label: "Collected" },
  { status: "delivered", label: "Delivered" },
];

const progressIndex = (status) =>
  status === "completed" ? PROGRESS_STEPS.length - 1 : PROGRESS_STEPS.findIndex((s) => s.status === status);

// A row of dots joined by a line: filled up to the current stage, with the
// current one ringed. Cancelled or unknown statuses render nothing.
export const ProgressDots = ({ status, showLabels = false }) => {
  const current = progressIndex(status);
  if (current < 0) return null;
  return (
    <View accessibilityLabel={`Step ${current + 1} of ${PROGRESS_STEPS.length}: ${PROGRESS_STEPS[current].label}`}>
      <View style={styles.progressRow}>
        {PROGRESS_STEPS.map((step, i) => (
          <React.Fragment key={step.status}>
            {i > 0 ? <View style={[styles.progressLine, i <= current && styles.progressLineDone]} /> : null}
            <View style={[styles.progressDot, i <= current && styles.progressDotDone, i === current && styles.progressDotCurrent]} />
          </React.Fragment>
        ))}
      </View>
      {showLabels ? (
        <View style={styles.progressLabels}>
          {PROGRESS_STEPS.map((step, i) => (
            <Text key={step.status} style={[styles.progressLabel, i === current && styles.progressLabelCurrent]} numberOfLines={1}>{step.label}</Text>
          ))}
        </View>
      ) : (
        <Text style={styles.progressCaption}>Step {current + 1} of {PROGRESS_STEPS.length} · <Text style={styles.progressLabelCurrent}>{STATUS_LABELS[status]}</Text></Text>
      )}
    </View>
  );
};

export const Segment = ({ options, value, onChange }) => (
  <View style={styles.segment}>
    {options.map((option) => {
      const active = option.value === value;
      return (
        <Pressable key={option.value} style={[styles.segmentItem, active && styles.segmentItemActive]} onPress={() => onChange(option.value)} accessibilityRole="button" accessibilityState={{ selected: active }}>
          {option.icon ? <MaterialCommunityIcons name={option.icon} size={16} color={active ? INK : "#89958E"} /> : null}
          <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{option.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

export const PrimaryButton = ({ label, icon = "arrow-right", onPress, loading, disabled }) => (
  <Pressable style={[styles.primaryButton, (loading || disabled) && styles.disabledButton]} onPress={onPress} disabled={loading || disabled}>
    {loading ? <ActivityIndicator color="#fff" /> : <><Text style={styles.primaryButtonText}>{label}</Text>{icon ? <MaterialCommunityIcons name={icon} size={19} color="#fff" /> : null}</>}
  </Pressable>
);

export const SecondaryButton = ({ label, icon, onPress, danger, disabled }) => (
  <Pressable style={[styles.secondaryButton, disabled && styles.disabledButton, { flex: 1 }]} onPress={onPress} disabled={disabled}>
    {icon ? <MaterialCommunityIcons name={icon} size={17} color={danger ? "#B42318" : INK} /> : null}
    <Text style={danger ? styles.dangerButtonText : styles.secondaryButtonText}>{label}</Text>
  </Pressable>
);

export const PersonCard = ({ title, name, phone, subtitle }) => (
  <View style={styles.detailCard}>
    <Text style={styles.detailSectionTitle}>{title}</Text>
    <View style={styles.personRow}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{(name || "?").charAt(0).toUpperCase()}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.errandTitle}>{name || "Unknown"}</Text>
        {subtitle ? <Text style={styles.bodyCopy}>{subtitle}</Text> : null}
        {phone ? <Text style={styles.bodyCopy}>{phone}</Text> : null}
      </View>
      {phone ? (
        <Pressable style={styles.callButton} onPress={() => Linking.openURL(`tel:${phone}`)} accessibilityLabel={`Call ${name}`}>
          <MaterialCommunityIcons name="phone" size={19} color={GREEN} />
        </Pressable>
      ) : null}
    </View>
  </View>
);

// Asks camera or gallery, handles permission, and resolves to the picked
// image asset (or null if the user backs out).
export const pickPhoto = () =>
  new Promise((resolve) => {
    const open = async (camera) => {
      const permission = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) { Alert.alert("Permission needed", `Allow access to your ${camera ? "camera" : "photos"} to add a picture.`); resolve(null); return; }
      const options = { mediaTypes: ["images"], quality: 0.6 };
      const result = camera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
      resolve(!result.canceled && result.assets?.[0] ? result.assets[0] : null);
    };
    Alert.alert("Add a photo", "Show the runner exactly what you need.", [
      { text: "Take photo", onPress: () => open(true) },
      { text: "Choose from gallery", onPress: () => open(false) },
      { text: "Cancel", style: "cancel", onPress: () => resolve(null) },
    ], { cancelable: true, onDismiss: () => resolve(null) });
  });

// Full-screen view of one photo; `uri` null hides it.
export const PhotoViewer = ({ uri, onClose }) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={!!uri} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.viewerBackdrop} onPress={onClose}>
        {uri ? <Image source={{ uri }} style={styles.viewerImage} resizeMode="contain" accessibilityLabel="Errand photo" /> : null}
        <Pressable style={[styles.viewerClose, { top: insets.top + 12 }]} onPress={onClose} accessibilityLabel="Close photo"><MaterialCommunityIcons name="close" size={22} color="#FFFFFF" /></Pressable>
      </Pressable>
    </Modal>
  );
};

export const PHOTO_SIDES = [{ side: "front", label: "Front" }, { side: "back", label: "Back" }];
export const SIDE_LABELS = { front: "Front", back: "Back" };

// Two labelled tiles, Front and Back, used in the create form. `value` is
// { front, back } of picked assets (either may be null); tapping a filled
// tile opens it full screen via onView.
export const SidePhotoPicker = ({ value, onChange, onView }) => {
  const pick = async (side) => {
    const asset = await pickPhoto();
    if (asset) onChange({ ...value, [side]: asset });
  };
  return (
    <View style={styles.photoRow}>
      {PHOTO_SIDES.map(({ side, label }) => {
        const photo = value?.[side];
        return (
          <View key={side} style={styles.sideTile}>
            {photo ? (
              <View>
                <Pressable onPress={() => onView?.(photo.uri)} accessibilityLabel={`View ${label.toLowerCase()} photo`}><Image source={{ uri: photo.uri }} style={styles.photoThumb} /></Pressable>
                <Pressable style={styles.photoRemove} onPress={() => onChange({ ...value, [side]: null })} hitSlop={8} accessibilityLabel={`Remove ${label.toLowerCase()} photo`}><MaterialCommunityIcons name="close-circle" size={22} color="#B42318" /></Pressable>
              </View>
            ) : (
              <Pressable style={styles.photoAdd} onPress={() => pick(side)} accessibilityRole="button" accessibilityLabel={`Add ${label.toLowerCase()} photo`}>
                <MaterialCommunityIcons name="camera-plus-outline" size={22} color={MUTED} />
                <Text style={styles.photoAddText}>Add</Text>
              </Pressable>
            )}
            <Text style={styles.sideLabel}>{label.toUpperCase()}</Text>
          </View>
        );
      })}
    </View>
  );
};

// A shopping item's photos as [{ url, side? }]: `photos` on newer errands,
// plain `images` URLs (no side) on older ones.
const itemPhotos = (item) =>
  item.photos?.length ? item.photos : (item.images || []).filter(Boolean).map((url) => ({ url }));

// Row of saved photos, each captioned Front/Back when the side is known.
const SavedPhotos = ({ photos, onView, small }) => (
  <View style={[styles.photoRow, { marginBottom: 4 }]}>
    {photos.map((photo) => (
      <View key={photo.url} style={styles.sideTile}>
        <Pressable onPress={() => onView(photo.url)} accessibilityLabel={`View ${photo.side ? `${photo.side} ` : ""}photo`}><Image source={{ uri: photo.url }} style={small ? styles.itemPhotoThumb : styles.photoThumb} /></Pressable>
        {photo.side ? <Text style={styles.sideLabel}>{SIDE_LABELS[photo.side].toUpperCase()}</Text> : null}
      </View>
    ))}
  </View>
);

export const ItemsCard = ({ errand, showActual = true }) => {
  const [viewing, setViewing] = useState(null);
  const items = errandItems(errand);
  const amounts = errand.amounts || {};
  const actual = amounts.actualItemsKobo;
  const errandPhotos = (errand.images || []).filter((img) => img?.url).map((img) => ({ url: img.url, side: img.side }));
  return (
    <View style={styles.detailCard}>
      <PhotoViewer uri={viewing} onClose={() => setViewing(null)} />
      <Text style={styles.detailSectionTitle}>{errand.type === "pickup" ? "Pickup" : "Shopping list"}</Text>
      {(errand.pickupLocations || []).map((location, i) => (
        <Text key={`loc-${i}`} style={[styles.bodyCopy, { marginTop: 0, marginBottom: 10 }]}>
          <MaterialCommunityIcons name="store-marker-outline" size={13} /> {location.name} · {location.address}
        </Text>
      ))}
      {items.map((item, index) => {
        const photos = itemPhotos(item);
        return (
          <View key={`${item.name}-${index}`}>
            <View style={styles.detailItem}>
              <Text style={styles.detailItemName}>{item.quantity} × {item.name}</Text>
              <Text style={styles.detailItemPrice}>{money(item.quantity * item.price)}</Text>
            </View>
            {photos.length ? <View style={{ marginTop: -6, marginBottom: 8 }}><SavedPhotos photos={photos} onView={setViewing} small /></View> : null}
          </View>
        );
      })}
      {errand.type === "pickup" && errand.description ? <Text style={styles.detailAddress}>{errand.description}</Text> : null}
      {errandPhotos.length ? <SavedPhotos photos={errandPhotos} onView={setViewing} /> : null}
      <View style={styles.summaryDivider} />
      {errand.type === "shopping" ? (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{showActual && actual != null ? "Items (actual)" : "Items (estimate)"}</Text>
          <Text style={styles.summaryValue}>{money(showActual && actual != null ? kobo(actual) : kobo(amounts.itemsEstimateKobo ?? errand.totalPrice * 100))}</Text>
        </View>
      ) : null}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Delivery</Text>
        {errand.isFreeErrand ? <Text style={styles.freeTag}>FREE</Text> : <Text style={styles.summaryValue}>{money(errand.deliveryFee)}</Text>}
      </View>
    </View>
  );
};

export const ReceiptCard = ({ purchase }) => {
  if (!purchase?.receiptUrl) return null;
  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailSectionTitle}>Receipt · {money(kobo(purchase.actualItemsKobo))}</Text>
      <Image source={{ uri: purchase.receiptUrl }} style={styles.receiptImage} resizeMode="cover" accessibilityLabel="Receipt photo" />
      {purchase.note ? <Text style={styles.detailDescription}>{purchase.note}</Text> : null}
    </View>
  );
};

export const Timeline = ({ events }) => {
  if (!events?.length) return null;
  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailSectionTitle}>Timeline</Text>
      {events.map((event, index) => (
        <View key={`${event.type}-${index}`} style={styles.timelineRow}>
          <View style={styles.timelineRail}>
            <View style={styles.timelineDot} />
            {index < events.length - 1 ? <View style={styles.timelineLine} /> : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.timelineTitle}>{EVENT_LABELS[event.type] || event.type}</Text>
            <Text style={styles.timelineMeta}>{formatDate(event.at, true)}{event.note ? ` · ${event.note}` : ""}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export const LoadingState = ({ label }) => (
  <View style={styles.centerState}><ActivityIndicator color={GREEN} size="large" /><Text style={[styles.stateCopy, { marginTop: 10 }]}>{label}</Text></View>
);

export const ErrorState = ({ message, onRetry }) => (
  <View style={styles.stateCard}>
    <View style={styles.stateIcon}><MaterialCommunityIcons name="wifi-alert" size={25} color="#D97706" /></View>
    <Text style={styles.stateTitle}>Couldn't load errands</Text>
    <Text style={styles.stateCopy}>{message || "Check your connection and try again."}</Text>
    <Pressable onPress={onRetry} style={styles.retryButton}><Text style={styles.retryText}>Try again</Text></Pressable>
  </View>
);

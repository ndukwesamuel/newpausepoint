import React from "react";
import { ActivityIndicator, Image, Linking, Pressable, Text, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./errandStyles";
import { EVENT_LABELS, GREEN, INK, STATUS_COLORS, STATUS_LABELS, errandItems, formatDate, kobo, money } from "./errandApi";

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

export const ItemsCard = ({ errand, showActual = true }) => {
  const items = errandItems(errand);
  const amounts = errand.amounts || {};
  const actual = amounts.actualItemsKobo;
  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailSectionTitle}>{errand.type === "pickup" ? "Pickup" : "Shopping list"}</Text>
      {(errand.pickupLocations || []).map((location, i) => (
        <Text key={`loc-${i}`} style={[styles.bodyCopy, { marginTop: 0, marginBottom: 10 }]}>
          <MaterialCommunityIcons name="store-marker-outline" size={13} /> {location.name} · {location.address}
        </Text>
      ))}
      {items.map((item, index) => (
        <View key={`${item.name}-${index}`} style={styles.detailItem}>
          <Text style={styles.detailItemName}>{item.quantity} × {item.name}</Text>
          <Text style={styles.detailItemPrice}>{money(item.quantity * item.price)}</Text>
        </View>
      ))}
      {errand.type === "pickup" && errand.description ? <Text style={styles.detailAddress}>{errand.description}</Text> : null}
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

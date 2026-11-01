import React, { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, RefreshControl, ScrollView, StatusBar, Text, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFetchData_v2 } from "../../hooks/Requestv2";
import { GREEN, INK, errandItems, formatDate, kobo, money, useErrandAction } from "./errandApi";
import { styles } from "./errandStyles";
import { ErrorState, ItemsCard, LoadingState, PersonCard, PrimaryButton, ReceiptCard, SecondaryButton, StatusPill } from "./errandParts";

const earning = (errand) => money(kobo(errand.amounts?.runnerEarningKobo));

// The runner's steps, in order. Shopping has an extra receipt step.
const stepsFor = (errand) =>
  errand.type === "shopping"
    ? ["Accepted", "Head to the shop", "Buy items and submit receipt", "Items collected", "Delivered"]
    : ["Accepted", "Head to pickup", "Item collected", "Delivered"];

const stepIndex = (errand) => {
  const purchased = ["not_required", "approved"].includes(errand.purchase?.approvalStatus);
  const order = { assigned: 1, en_route: 2, picked_up: errand.type === "shopping" ? 4 : 3, delivered: 99, completed: 99 };
  if (errand.type === "shopping" && errand.status === "en_route" && purchased) return 3;
  return order[errand.status] ?? 0;
};

const ErrandCard = ({ errand, onPress, right }) => (
  <Pressable style={styles.errandCard} onPress={onPress}>
    <View style={styles.errandIcon}><MaterialCommunityIcons name={errand.type === "pickup" ? "package-variant-closed" : "shopping-outline"} size={21} color={GREEN} /></View>
    <View style={styles.errandMain}>
      <Text style={styles.errandTitle} numberOfLines={1}>{errand.title}</Text>
      <Text style={styles.errandMeta} numberOfLines={1}>{errand.clan?.name ? `${errand.clan.name} · ` : ""}{errandItems(errand).length ? `${errandItems(errand).length} item(s) · ` : ""}{formatDate(errand.createdAt, true)}</Text>
      {right}
    </View>
    <MaterialCommunityIcons name="chevron-right" size={22} color="#A1ADA6" />
  </Pressable>
);

const PurchaseForm = ({ errand, onDone }) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(null);
  const action = useErrandAction();
  const estimate = kobo(errand.amounts?.itemsEstimateKobo);

  const pick = async (camera) => {
    const options = { mediaTypes: ["images"], quality: 0.6 };
    const permission = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert("Permission needed", "Allow access so you can attach the receipt."); return; }
    const result = camera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled && result.assets?.[0]) setPhoto(result.assets[0]);
  };

  const submit = () => {
    const value = Number(amount);
    if (!amount || Number.isNaN(value) || value < 0) { Alert.alert("Enter the total", "Type the total you paid for the items."); return; }
    if (!photo) { Alert.alert("Add the receipt", "Take a photo of the receipt."); return; }
    const form = new FormData();
    form.append("actualItemsCost", String(value));
    if (note.trim()) form.append("note", note.trim());
    form.append("receipt", { uri: photo.uri, name: photo.fileName || "receipt.jpg", type: photo.mimeType || "image/jpeg" });
    action.mutate({ path: `/${errand._id}/purchase`, formData: form }, {
      onSuccess: () => {
        onDone?.();
        Alert.alert(value > estimate ? "Waiting for the customer" : "Receipt submitted", value > estimate ? `That's ${money(value - estimate)} over the estimate. The customer has to approve it before you continue.` : "You can now mark the items as collected.");
      },
      onError: (err) => Alert.alert("Couldn't submit receipt", err.message),
    });
  };

  return (
    <View style={styles.attentionCard}>
      <Text style={styles.detailSectionTitle}>Submit purchase</Text>
      <Text style={[styles.bodyCopy, { marginTop: 0, marginBottom: 12 }]}>Customer's estimate: {money(estimate)}. If you spend more, they must approve the difference. Never go over without approval.</Text>
      <Text style={styles.fieldLabel}>TOTAL PAID FOR ITEMS (₦)</Text>
      <TextInput value={amount} onChangeText={(v) => setAmount(v.replace(/[^0-9.]/g, ""))} keyboardType="decimal-pad" style={[styles.input, { marginBottom: 12 }]} placeholder={String(estimate)} placeholderTextColor="#A1ADA6" />
      <Text style={styles.fieldLabel}>NOTE (OPTIONAL)</Text>
      <TextInput value={note} onChangeText={setNote} style={[styles.input, { marginBottom: 12 }]} placeholder="e.g. Brand X was out, bought Brand Y" placeholderTextColor="#A1ADA6" />
      {photo ? <Image source={{ uri: photo.uri }} style={[styles.receiptImage, { marginBottom: 12 }]} /> : null}
      <View style={[styles.buttonRow, { marginBottom: 12 }]}>
        <SecondaryButton label="Take photo" icon="camera-outline" onPress={() => pick(true)} />
        <SecondaryButton label="From gallery" icon="image-outline" onPress={() => pick(false)} />
      </View>
      <PrimaryButton label="Submit receipt" icon="upload" onPress={submit} loading={action.isPending} />
    </View>
  );
};

const RunnerDetail = ({ errand, mode, onBack }) => {
  const action = useErrandAction();
  const [showPurchase, setShowPurchase] = useState(false);
  const isMine = mode === "mine";
  const purchaseStatus = errand.purchase?.approvalStatus;

  const run = (path, onSuccess) =>
    action.mutate({ path: `/${errand._id}${path}` }, {
      onSuccess: (res) => onSuccess?.(res),
      onError: (err) => Alert.alert("Couldn't update errand", err.message),
    });

  const accept = () =>
    Alert.alert("Accept this errand?", errand.type === "shopping" ? `You'll buy the items with your own money (about ${money(kobo(errand.amounts?.itemsEstimateKobo))}). PausePoint pays you back plus ${earning(errand)} once it's completed.` : `You'll earn ${earning(errand)} once it's completed.`, [
      { text: "Not now", style: "cancel" },
      { text: "Accept", onPress: () => run("/accept", () => { Alert.alert("Errand accepted", "It's now in My errand."); onBack("mine"); }) },
    ]);

  let primary = null;
  if (!isMine && errand.status === "pending") primary = <PrimaryButton label={`Accept · earn ${earning(errand)}`} icon="check" onPress={accept} loading={action.isPending} />;
  if (isMine && errand.status === "assigned") primary = <PrimaryButton label={errand.type === "shopping" ? "Start: heading to the shop" : "Start: heading to pickup"} onPress={() => run("/start")} loading={action.isPending} />;
  if (isMine && errand.status === "en_route") {
    if (errand.type === "pickup") primary = <PrimaryButton label="I've collected the item" icon="package-variant" onPress={() => run("/pickup")} loading={action.isPending} />;
    else if (["not_required", "approved"].includes(purchaseStatus)) primary = <PrimaryButton label="I have the items" icon="package-variant" onPress={() => run("/pickup")} loading={action.isPending} />;
    else if (!purchaseStatus && !showPurchase) primary = <PrimaryButton label="Submit receipt & total" icon="receipt" onPress={() => setShowPurchase(true)} />;
  }
  if (isMine && errand.status === "picked_up") primary = <PrimaryButton label="Mark as delivered" icon="home-import-outline" onPress={() => Alert.alert("Delivered?", "Only mark delivered once the customer has the items.", [{ text: "Not yet", style: "cancel" }, { text: "Delivered", onPress: () => run("/deliver") }])} loading={action.isPending} />;

  const steps = stepsFor(errand);
  const current = stepIndex(errand);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => onBack()} accessibilityLabel="Back"><MaterialCommunityIcons name="arrow-left" size={22} color={INK} /></Pressable>
        <View style={{ flex: 1 }}><Text style={styles.topTitle} numberOfLines={1}>{errand.title}</Text><Text style={styles.topSubtitle}>{errand.clan?.name || "Outside estate"}</Text></View>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.detailContent} keyboardShouldPersistTaps="handled">
          <View style={styles.detailHero}>
            <StatusPill status={errand.status} />
            <Text style={[styles.detailTitle, { marginTop: 12, marginBottom: 6 }]}>You earn {earning(errand)}</Text>
            {errand.type === "shopping" ? <Text style={styles.bodyCopy}>+ the item cost paid back to you</Text> : null}
          </View>

          {isMine && errand.status !== "completed" && errand.status !== "cancelled" ? (
            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Steps</Text>
              {steps.map((label, i) => (
                <View key={label} style={styles.stepRow}>
                  <View style={[styles.stepNumber, i < current && styles.stepNumberDone]}>
                    {i < current ? <MaterialCommunityIcons name="check" size={14} color="#fff" /> : <Text style={styles.stepNumberText}>{i + 1}</Text>}
                  </View>
                  <Text style={[styles.stepText, i === current && { fontWeight: "800" }]}>{label}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {purchaseStatus === "pending" ? <View style={styles.attentionCard}><Text style={styles.detailSectionTitle}>Waiting for the customer</Text><Text style={styles.detailAddress}>You spent {money(kobo(errand.purchase.actualItemsKobo))}. The customer must approve the extra before you continue.</Text></View> : null}
          {purchaseStatus === "rejected" && errand.status === "en_route" ? <View style={styles.attentionCard}><Text style={styles.detailSectionTitle}>Extra cost declined</Text><Text style={styles.detailAddress}>Buy within {money(kobo(errand.amounts?.itemsEstimateKobo))} and submit the receipt again.</Text></View> : null}
          {showPurchase || (isMine && errand.status === "en_route" && errand.type === "shopping" && purchaseStatus === "rejected") ? <PurchaseForm errand={errand} onDone={() => setShowPurchase(false)} /> : null}

          {isMine ? <PersonCard title="Customer" name={errand.user?.name} phone={errand.phoneNumber} /> : null}
          <ItemsCard errand={errand} />
          <ReceiptCard purchase={errand.purchase} />
          <View style={styles.detailCard}>
            <Text style={styles.detailSectionTitle}>Deliver to</Text>
            <Text style={styles.detailAddress}>{isMine ? errand.deliveryAddress : errand.isWithinEstate ? `Inside ${errand.clan?.name || "the estate"}. Full address shown after you accept.` : "Full address shown after you accept."}</Text>
            {isMine && errand.type === "shopping" && errand.description ? <Text style={styles.detailDescription}>{errand.description}</Text> : null}
          </View>
          {errand.runnerPayout ? (
            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Payout · {errand.runnerPayout.status === "paid" ? "Paid" : "Owed to you"}</Text>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Items paid back</Text><Text style={styles.summaryValue}>{money(kobo(errand.runnerPayout.reimbursementKobo))}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Your earning</Text><Text style={styles.summaryValue}>{money(kobo(errand.runnerPayout.earningKobo))}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{money(kobo(errand.runnerPayout.totalKobo))}</Text></View>
            </View>
          ) : null}
          {isMine && ["assigned", "en_route"].includes(errand.status) && (!errand.purchase || purchaseStatus === "rejected") ? (
            <SecondaryButton label="Hand back this errand" icon="undo" danger disabled={action.isPending} onPress={() => Alert.alert("Hand it back?", "It goes back to the open list for another runner.", [{ text: "Keep it", style: "cancel" }, { text: "Hand back", style: "destructive", onPress: () => run("/release", () => onBack("available")) }])} />
          ) : null}
        </ScrollView>
        {primary ? <View style={styles.footer}>{primary}</View> : null}
      </KeyboardAvoidingView>
    </View>
  );
};

const RunnerErrands = () => {
  const [tab, setTab] = useState("available");
  const [selected, setSelected] = useState(null); // { id, mode }
  const available = useFetchData_v2("api/v1/errand/runner/available", "runner-available", { refetchInterval: 15000 });
  const mine = useFetchData_v2("api/v1/errand/runner/mine", "runner-errands", { refetchInterval: 15000 });
  const earnings = useFetchData_v2("api/v1/errand/runner/earnings", "runner-earnings");

  const availableList = available.data?.data?.errands || [];
  const myList = mine.data?.data?.errands || [];
  const active = mine.data?.data?.active;
  const e = earnings.data?.data;

  if (selected) {
    const list = selected.mode === "mine" ? myList : availableList;
    const errand = list.find((x) => x._id === selected.id);
    if (errand) {
      return <RunnerDetail errand={errand} mode={selected.mode} onBack={(nextTab) => { setSelected(null); if (nextTab) setTab(nextTab); }} />;
    }
  }

  const refreshing = available.isRefetching || mine.isRefetching || earnings.isRefetching;
  const refresh = () => { available.refetch(); mine.refetch(); earnings.refetch(); };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={[styles.topBar, { borderBottomWidth: 0 }]}>
        <View style={styles.brandMark}><MaterialCommunityIcons name="bike-fast" size={21} color={GREEN} /></View>
        <View style={{ flex: 1 }}><Text style={styles.topTitle}>Runner</Text><Text style={styles.topSubtitle}>{active ? "You have an errand in progress" : `${availableList.length} errand(s) open`}</Text></View>
        <Pressable style={styles.refreshButton} onPress={refresh} accessibilityLabel="Refresh"><MaterialCommunityIcons name="refresh" size={20} color={INK} /></Pressable>
      </View>
      <View style={styles.tabs}>
        {[["available", "Available"], ["mine", "My errands"], ["earnings", "Earnings"]].map(([key, label]) => (
          <Pressable key={key} style={[styles.tab, tab === key && styles.tabActive]} onPress={() => setTab(key)}><Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{label}</Text></Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.listContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={GREEN} colors={[GREEN]} />}>
        {tab === "available" ? (
          available.isLoading ? <LoadingState label="Looking for errands…" /> : available.isError ? <ErrorState message={available.error?.message} onRetry={available.refetch} /> : (
            <>
              {active ? (
                <Pressable style={[styles.attentionCard, { flexDirection: "row", alignItems: "center", gap: 10 }]} onPress={() => setSelected({ id: active._id, mode: "mine" })}>
                  <MaterialCommunityIcons name="progress-clock" size={22} color="#A45D00" />
                  <Text style={[styles.detailAddress, { flex: 1 }]}>Finish "{active.title}" before taking another errand.</Text>
                  <MaterialCommunityIcons name="chevron-right" size={22} color="#A45D00" />
                </Pressable>
              ) : null}
              {availableList.length === 0 ? (
                <View style={styles.stateCard}><View style={styles.stateIcon}><MaterialCommunityIcons name="coffee-outline" size={25} color={GREEN} /></View><Text style={styles.stateTitle}>No open errands</Text><Text style={styles.stateCopy}>New errands in your estates appear here. You'll get a notification too.</Text></View>
              ) : (
                <View style={styles.errandList}>{availableList.map((errand) => (
                  <ErrandCard key={errand._id} errand={errand} onPress={() => setSelected({ id: errand._id, mode: "available" })} right={<View style={styles.earningBadge}><Text style={styles.earningBadgeText}>Earn {earning(errand)}</Text></View>} />
                ))}</View>
              )}
            </>
          )
        ) : null}

        {tab === "mine" ? (
          mine.isLoading ? <LoadingState label="Loading…" /> : mine.isError ? <ErrorState message={mine.error?.message} onRetry={mine.refetch} /> : myList.length === 0 ? (
            <View style={styles.stateCard}><View style={styles.stateIcon}><MaterialCommunityIcons name="clipboard-text-outline" size={25} color={GREEN} /></View><Text style={styles.stateTitle}>No errands yet</Text><Text style={styles.stateCopy}>Errands you accept show up here.</Text></View>
          ) : (
            <View style={styles.errandList}>{myList.map((errand) => (
              <ErrandCard key={errand._id} errand={errand} onPress={() => setSelected({ id: errand._id, mode: "mine" })} right={<StatusPill status={errand.status} />} />
            ))}</View>
          )
        ) : null}

        {tab === "earnings" ? (
          earnings.isLoading ? <LoadingState label="Loading earnings…" /> : earnings.isError ? <ErrorState message={earnings.error?.message} onRetry={earnings.refetch} /> : (
            <>
              <View style={styles.earnHero}>
                <Text style={styles.earnLabel}>OWED TO YOU</Text>
                <Text style={styles.earnValue}>{money(e?.owed)}</Text>
                <Text style={[styles.bodyCopy, { color: "#C5D6CD" }]}>Item costs paid back + your earnings. PausePoint pays this to you directly.</Text>
              </View>
              <View style={styles.earnGrid}>
                <View style={styles.earnTile}><Text style={styles.summaryLabel}>Completed</Text><Text style={styles.earnTileValue}>{e?.completed ?? 0}</Text></View>
                <View style={styles.earnTile}><Text style={styles.summaryLabel}>Total earned</Text><Text style={styles.earnTileValue}>{money(e?.earnings)}</Text></View>
              </View>
              <View style={styles.earnGrid}>
                <View style={styles.earnTile}><Text style={styles.summaryLabel}>Items paid back</Text><Text style={styles.earnTileValue}>{money(e?.reimbursements)}</Text></View>
                <View style={styles.earnTile}><Text style={styles.summaryLabel}>Already paid</Text><Text style={styles.earnTileValue}>{money(e?.paid)}</Text></View>
              </View>
            </>
          )
        ) : null}
        <View style={{ height: 105 }} />
      </ScrollView>
    </View>
  );
};

export default RunnerErrands;

import React, { useEffect, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, RefreshControl, ScrollView, StatusBar, Text, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFetchData_v2 } from "../../hooks/Requestv2";
import { GREEN, INK, MUTED, formatDate, kobo, money, useErrandAction } from "./errandApi";
import { styles } from "./errandStyles";
import { ErrorState, Field, ItemsCard, LoadingState, PersonCard, PrimaryButton, ReceiptCard, SecondaryButton, Segment, StatusPill, Timeline } from "./errandParts";

const blankItem = () => ({ name: "", quantity: "1", price: "" });

const needsCustomer = (errand) => errand.purchase?.approvalStatus === "pending" || errand.status === "delivered";

const CreateErrand = ({ context, onClose }) => {
  const [type, setType] = useState("shopping");
  const [title, setTitle] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [isWithinEstate, setIsWithinEstate] = useState(!!context?.isEstateMember);
  const [items, setItems] = useState([blankItem()]);
  const [quote, setQuote] = useState(null);
  const action = useErrandAction();
  const quoteAction = useErrandAction();

  const cleanItems = items
    .filter((item) => item.name.trim())
    .map((item) => ({ name: item.name.trim(), quantity: Number(item.quantity) || 0, price: Number(item.price) || 0 }));

  const payload = {
    title: title.trim() || (type === "pickup" ? "Pickup" : "Shopping"),
    type,
    deliveryAddress: deliveryAddress.trim() || "-",
    description: description.trim(),
    phoneNumber: phoneNumber.trim() || "0000000",
    isWithinEstate,
    pickupLocations: [{ name: storeName.trim() || "-", address: storeAddress.trim() || "-", items: type === "shopping" ? cleanItems : [] }],
  };
  const quoteKey = JSON.stringify([type, isWithinEstate, cleanItems]);

  // Ask the server for the price whenever what affects it changes, so the
  // total shown is exactly what will be charged.
  useEffect(() => {
    if (type === "shopping" && !cleanItems.length) { setQuote(null); return; }
    const timer = setTimeout(() => {
      quoteAction.mutate({ path: "/quote", body: payload }, { onSuccess: (res) => setQuote(res?.data || null), onError: () => setQuote(null) });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteKey]);

  const updateItem = (index, key, value) => setItems((current) => current.map((item, i) => (i === index ? { ...item, [key]: value } : item)));

  const submit = () => {
    if (!title.trim() || !storeName.trim() || !storeAddress.trim() || !deliveryAddress.trim() || !phoneNumber.trim()) {
      Alert.alert("Complete the details", `Add an errand name, ${type === "pickup" ? "pickup place" : "shop"}, delivery address and contact number.`);
      return;
    }
    if (type === "pickup" && !description.trim()) {
      Alert.alert("What should we collect?", "Describe what the runner is picking up.");
      return;
    }
    if (type === "shopping" && (!cleanItems.length || items.filter((item) => item.name.trim()).some((item) => !item.quantity || Number(item.quantity) < 1 || item.price.trim() === ""))) {
      Alert.alert("Check your shopping list", "Add at least one item with a quantity and estimated price.");
      return;
    }
    const total = quote ? money(quote.total) : "the total";
    Alert.alert("Place errand?", `${total} will be paid from your PausePoint wallet.`, [
      { text: "Not yet", style: "cancel" },
      {
        text: "Place errand",
        onPress: () =>
          action.mutate({ path: "", body: payload }, {
            onSuccess: () => { onClose(); Alert.alert("Errand placed", "We'll let you know as soon as a runner accepts it."); },
            onError: (err) => Alert.alert("Couldn't place errand", err.message),
          }),
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={onClose} accessibilityLabel="Back to errands"><MaterialCommunityIcons name="arrow-left" size={22} color={INK} /></Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.topTitle}>New errand</Text>
          <Text style={styles.topSubtitle}>{type === "pickup" ? "We'll collect it and bring it to you" : "Tell us what to buy"}</Text>
        </View>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
          <Segment value={type} onChange={setType} options={[{ value: "shopping", label: "Shopping", icon: "cart-outline" }, { value: "pickup", label: "Pickup & deliver", icon: "package-variant-closed" }]} />
          <Field label="ERRAND NAME" value={title} onChangeText={setTitle} placeholder={type === "pickup" ? "e.g. Collect my parcel" : "e.g. Weekly groceries"} />

          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{type === "pickup" ? "Where to collect" : "Where to shop"}</Text><Text style={styles.sectionHint}>PICKUP</Text></View>
          <Field label={type === "pickup" ? "PLACE OR PERSON" : "SHOP OR MARKET"} value={storeName} onChangeText={setStoreName} placeholder={type === "pickup" ? "e.g. GIG Logistics, Ikeja" : "e.g. Shoprite Ikeja"} />
          <Field label="ADDRESS" value={storeAddress} onChangeText={setStoreAddress} placeholder="Street, area, landmark" />

          {type === "shopping" ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Shopping list</Text>
                <Pressable style={styles.addItemButton} onPress={() => setItems((current) => [...current, blankItem()])}><MaterialCommunityIcons name="plus" size={17} color={GREEN} /><Text style={styles.addItemText}>Add item</Text></Pressable>
              </View>
              {items.map((item, index) => (
                <View style={styles.itemCard} key={`item-${index}`}>
                  <View style={styles.itemCardHeader}>
                    <Text style={styles.itemIndex}>ITEM {String(index + 1).padStart(2, "0")}</Text>
                    {items.length > 1 && <Pressable onPress={() => setItems((current) => current.filter((_, i) => i !== index))} accessibilityLabel="Remove item"><MaterialCommunityIcons name="close-circle-outline" size={20} color="#89958E" /></Pressable>}
                  </View>
                  <TextInput value={item.name} onChangeText={(value) => updateItem(index, "name", value)} placeholder="What do you need?" placeholderTextColor="#A1ADA6" style={styles.input} />
                  <View style={styles.itemInputs}>
                    <View style={{ flex: 1 }}><Text style={styles.fieldLabel}>QUANTITY</Text><TextInput value={item.quantity} onChangeText={(value) => updateItem(index, "quantity", value.replace(/[^0-9]/g, ""))} keyboardType="number-pad" style={styles.input} placeholder="1" placeholderTextColor="#A1ADA6" /></View>
                    <View style={{ flex: 1 }}><Text style={styles.fieldLabel}>ESTIMATED PRICE (EACH)</Text><TextInput value={item.price} onChangeText={(value) => updateItem(index, "price", value.replace(/[^0-9.]/g, ""))} keyboardType="decimal-pad" style={styles.input} placeholder="₦ 0" placeholderTextColor="#A1ADA6" /></View>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <Field label="WHAT ARE WE COLLECTING?" value={description} onChangeText={setDescription} placeholder="e.g. A medium box under the name Ada. Order #1234." multiline />
          )}

          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Delivery details</Text></View>
          {context?.isEstateMember ? (
            <Segment value={isWithinEstate ? "in" : "out"} onChange={(v) => setIsWithinEstate(v === "in")} options={[{ value: "in", label: `Inside ${context?.estate?.name || "my estate"}` }, { value: "out", label: "Outside estate" }]} />
          ) : null}
          <Field label="DELIVERY ADDRESS" value={deliveryAddress} onChangeText={setDeliveryAddress} placeholder="House number, street, landmark" multiline />
          <Field label="CONTACT NUMBER" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="080 1234 5678" keyboardType="phone-pad" />
          {type === "shopping" ? <Field label="NOTES FOR THE RUNNER (OPTIONAL)" value={description} onChangeText={setDescription} placeholder="Substitutions, brands, directions" multiline /> : null}

          <View style={styles.summaryCard}>
            {type === "shopping" ? <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Estimated items</Text><Text style={styles.summaryValue}>{quote ? money(quote.items) : "—"}</Text></View> : null}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery fee</Text>
              {quote?.isFreeErrand ? <Text><Text style={styles.strike}>{money(quote.deliveryFee)}</Text>  <Text style={styles.freeTag}>FREE</Text></Text> : <Text style={styles.summaryValue}>{quote ? money(quote.deliveryFee) : "—"}</Text>}
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}><Text style={styles.totalLabel}>You pay now</Text><Text style={styles.totalValue}>{quote ? money(quote.total) : "—"}</Text></View>
            {type === "shopping" ? <Text style={styles.summaryNote}>If items cost less, we refund the difference. If they cost more, you'll be asked to approve before anything extra is charged.</Text> : null}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <PrimaryButton label="Place errand" onPress={submit} loading={action.isPending} />
          <Text style={styles.secureNote}><MaterialCommunityIcons name="shield-check-outline" size={14} color={MUTED} /> Paid from your PausePoint wallet</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const ErrandDetail = ({ errand, onBack }) => {
  const action = useErrandAction();
  const purchase = errand.purchase;
  const extra = purchase ? kobo(purchase.actualItemsKobo - (errand.amounts?.itemsEstimateKobo || 0)) : 0;

  const run = (path, success) =>
    action.mutate({ path: `/${errand._id}${path}` }, {
      onSuccess: (res) => success && Alert.alert(success, res?.message || ""),
      onError: (err) => Alert.alert("Couldn't update errand", err.message),
    });

  const confirm = (titleText, message, path, success, destructive) =>
    Alert.alert(titleText, message, [{ text: "Go back", style: "cancel" }, { text: "Yes", style: destructive ? "destructive" : "default", onPress: () => run(path, success) }]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={onBack} accessibilityLabel="Back to errands"><MaterialCommunityIcons name="arrow-left" size={22} color={INK} /></Pressable>
        <View style={{ flex: 1 }}><Text style={styles.topTitle}>Errand details</Text><Text style={styles.topSubtitle}>Placed {formatDate(errand.createdAt)}</Text></View>
      </View>
      <ScrollView contentContainerStyle={styles.detailContent}>
        <View style={styles.detailHero}>
          <View style={styles.detailIcon}><MaterialCommunityIcons name={errand.type === "pickup" ? "package-variant-closed" : "shopping-outline"} size={26} color={GREEN} /></View>
          <Text style={styles.detailTitle}>{errand.title}</Text>
          <StatusPill status={errand.status} />
          <Text style={[styles.totalValue, { marginTop: 12 }]}>{money(kobo((errand.amounts?.chargedKobo ?? errand.totalAmount * 100) - (errand.amounts?.refundedKobo || 0)))} paid</Text>
        </View>

        {purchase?.approvalStatus === "pending" ? (
          <View style={styles.attentionCard}>
            <Text style={styles.detailSectionTitle}>Approve extra cost</Text>
            <Text style={[styles.detailAddress, { marginBottom: 12 }]}>Your items came to {money(kobo(purchase.actualItemsKobo))}, which is {money(extra)} more than your estimate. Approve to pay the difference from your wallet, or decline and the runner will buy within your budget.</Text>
            <View style={styles.buttonRow}>
              <SecondaryButton label="Decline" danger onPress={() => run("/purchase/reject", "Declined")} disabled={action.isPending} />
              <View style={{ flex: 1 }}><PrimaryButton label={`Pay ${money(extra)}`} icon={null} onPress={() => run("/purchase/approve", "Approved")} loading={action.isPending} /></View>
            </View>
          </View>
        ) : null}

        {errand.status === "delivered" ? (
          <View style={styles.attentionCard}>
            <Text style={styles.detailSectionTitle}>Did you receive everything?</Text>
            <Text style={[styles.detailAddress, { marginBottom: 12 }]}>Confirm to close the errand. It closes automatically 24 hours after delivery.</Text>
            <PrimaryButton label="Confirm received" icon="check" onPress={() => run("/confirm", "Thanks!")} loading={action.isPending} />
          </View>
        ) : null}

        {errand.assignedTo ? <PersonCard title="Your runner" name={errand.assignedTo.name} phone={errand.assignedTo.phoneNumber} /> : null}
        <ItemsCard errand={errand} />
        <ReceiptCard purchase={purchase} />
        <View style={styles.detailCard}>
          <Text style={styles.detailSectionTitle}>Delivery</Text>
          <Text style={styles.detailAddress}>{errand.deliveryAddress}</Text>
          {errand.type === "shopping" && errand.description ? <Text style={styles.detailDescription}>{errand.description}</Text> : null}
        </View>
        <Timeline events={errand.events} />

        {errand.status === "pending" ? (
          <SecondaryButton label="Cancel errand" icon="close" danger disabled={action.isPending} onPress={() => confirm("Cancel this errand?", "You'll get a full refund to your wallet.", "/cancel", "Errand cancelled", true)} />
        ) : null}
      </ScrollView>
    </View>
  );
};

const CustomerErrands = ({ context }) => {
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { data, isLoading, isError, error, refetch, isRefetching } = useFetchData_v2("api/v1/errand", "customer-errands", { refetchInterval: 20000 });
  const errands = data?.data?.errands || [];
  const selected = useMemo(() => errands.find((e) => e._id === selectedId), [errands, selectedId]);

  if (creating) return <CreateErrand context={context} onClose={() => setCreating(false)} />;
  if (selected) return <ErrandDetail errand={selected} onBack={() => setSelectedId(null)} />;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.topBar}>
        <View style={styles.brandMark}><MaterialCommunityIcons name="bike-fast" size={21} color={GREEN} /></View>
        <View style={{ flex: 1 }}><Text style={styles.topTitle}>Your errands</Text><Text style={styles.topSubtitle}>Everyday tasks, taken care of</Text></View>
        <Pressable style={styles.refreshButton} onPress={() => refetch()} accessibilityLabel="Refresh errands"><MaterialCommunityIcons name="refresh" size={20} color={INK} /></Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={GREEN} colors={[GREEN]} />}>
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeCopy}><Text style={styles.eyebrow}>PAUSEPOINT ERRANDS</Text><Text style={styles.welcomeTitle}>Your to-do list, handled.</Text><Text style={styles.welcomeText}>Shopping or pickups, brought to your door.</Text></View>
          <View style={styles.welcomeArt}><MaterialCommunityIcons name="shopping-basket" size={38} color="#FFFFFF" /></View>
          <View style={styles.welcomeDecor} />
        </View>
        {context?.freeErrandsRemaining > 0 ? (
          <View style={styles.freeBanner}><MaterialCommunityIcons name="gift-outline" size={20} color="#A45D00" /><Text style={styles.freeBannerText}>Your next errand has free delivery. You only pay for the items.</Text></View>
        ) : null}

        <View style={styles.listHeading}><View><Text style={styles.sectionTitle}>Recent errands</Text><Text style={styles.bodyCopy}>Keep an eye on your requests</Text></View><View style={styles.countBadge}><Text style={styles.countText}>{errands.length}</Text></View></View>

        {isLoading ? <LoadingState label="Loading your errands…" /> : isError ? <ErrorState message={error?.message} onRetry={refetch} /> : errands.length === 0 ? (
          <View style={styles.stateCard}><View style={styles.stateIcon}><MaterialCommunityIcons name="clipboard-text-outline" size={25} color={GREEN} /></View><Text style={styles.stateTitle}>No errands yet</Text><Text style={styles.stateCopy}>Start with a shopping list or a pickup. Updates show up here.</Text><Pressable style={styles.emptyAction} onPress={() => setCreating(true)}><Text style={styles.emptyActionText}>Create your first errand</Text><MaterialCommunityIcons name="arrow-right" size={17} color="#FFFFFF" /></Pressable></View>
        ) : (
          <View style={styles.errandList}>{errands.map((errand) => (
            <Pressable key={errand._id} style={styles.errandCard} onPress={() => setSelectedId(errand._id)}>
              <View style={styles.errandIcon}><MaterialCommunityIcons name={errand.type === "pickup" ? "package-variant-closed" : "shopping-outline"} size={21} color={GREEN} /></View>
              <View style={styles.errandMain}>
                <Text style={styles.errandTitle} numberOfLines={1}>{errand.title}</Text>
                <Text style={styles.errandMeta}>{formatDate(errand.createdAt)} · {money(errand.totalAmount)}</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {needsCustomer(errand) ? <View style={styles.actionDot} /> : null}
                  <StatusPill status={errand.status} />
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#A1ADA6" />
            </Pressable>
          ))}</View>
        )}
        <View style={{ height: 105 }} />
      </ScrollView>
      <View style={styles.fabWrap}><PrimaryButton label="New errand" icon="plus" onPress={() => setCreating(true)} /></View>
    </View>
  );
};

export default CustomerErrands;

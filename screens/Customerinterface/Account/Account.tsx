import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView, // Import ScrollView
  Dimensions, // Import Dimensions for screen height
} from "react-native";
import React, { useEffect, useState } from "react";
// Assuming emergencydata is still used elsewhere, kept for context
// import { emergencydata } from "../../../components/Emergency/emdata";
import AppScreen from "../../../components/shared/AppScreen";
// Assuming EmergencyModal components are still used elsewhere, kept for context
import EmergencyModal, {
  EmergencyModalTwo,
} from "../../../components/Emergency/Modal";
import {
  MediumFontText,
  RegularFontText,
} from "../../../components/shared/Paragrahp";
// Assuming these are still used elsewhere, kept for context
import DarkModeToggle from "../../../components/Account/DarkModeToggle";
import General from "../../../components/Account/General";
import { DeleteAccountModal } from "../../../components/Account/Modal";
import { DeleteLAccount, Logout } from "../../../components/Account/Logout";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/AppNavigation";

import { useDispatch, useSelector } from "react-redux";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";

// Get screen height for proportional sizing
const { height: screenHeight } = Dimensions.get("window");

// --- START: TypeScript Types for Account Component & New Sections ---

// Basic type for user profile data (adjust based on your actual Redux state)
interface UserProfileData {
  photo?: string;
  user?: {
    name?: string;
  };
  phoneNumber?: string;
}

// Type for items in the existing 'data' array
type GeneralData = {
  id: number;
  icon: string;
  label: string;
  icon_type: string;
  link: string;
};

// Type for an individual announcement
interface Announcement {
  id: string;
  title: string;
  content: string; // Could be HTML or Markdown if you want richer content
  date: string; // e.g., "2025-06-12"
  link?: string; // Optional link for 'Read More'
}

// Type for an individual advertisement
interface Advertisement {
  id: string;
  imageUrl: string;
  linkUrl: string;
  altText: string;
}

// --- END: TypeScript Types ---

// --- START: Sample Data for Announcements and Advertisements ---

// Sample Announcement Data
const sampleAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Community Guidelines Refreshed",
    content:
      "We've updated our community guidelines to foster a more positive and respectful environment for everyone.",
    // Please review them.",
    date: "2025-01-01",
    link: "https://yourplatform.com/guidelines",
  },
  // {
  //   id: "1",
  //   title: "New Feature: Resident Chat!",
  //   content:
  //     "Connect with your neighbors instantly. We've rolled out a brand new chat feature within your estate's section.",
  //   date: "2025-06-10",
  //   link: "app://features/chat", // Example deep link or internal screen link
  // },
  {
    id: "2",
    title: "Scheduled Maintenance",
    content:
      "Heads up! We have scheduled system maintenance on June 15th from 2 AM to 4 AM UTC. Expect minor interruptions during this time.",
    date: "2025-06-08",
  },
  {
    id: "3",
    title: "Platform Update: Enhanced Security",
    content:
      "We've implemented stronger encryption protocols to ensure your data is even safer. Read more about our commitment to security.",
    date: "2025-06-05",
    link: "https://yourplatform.com/security-updates", // External link example
  },
  {
    id: "4",
    title: "Community Guidelines Refreshed",
    content:
      "We've updated our community guidelines to foster a more positive and respectful environment for everyone. Please review them.",
    date: "2025-01-01",
    link: "https://yourplatform.com/guidelines",
  },
  {
    id: "5",
    title: "Mobile App Performance Boost",
    content:
      "Experience faster load times and smoother navigation with our latest app update. Download now!",
    date: "2025-05-28",
  },
];

// Sample Advertisement Data
const sampleAdvertisements: Advertisement[] = [
  {
    id: "ad1",
    imageUrl:
      "https://placehold.co/300x100/FF5733/FFFFFF?text=Estate+Services+Ad", // Placeholder image
    linkUrl: "https://www.example.com/ad1",
    altText: "Advertisement for Estate Services",
  },
  {
    id: "ad2",
    imageUrl:
      "https://placehold.co/300x100/33FF57/000000?text=Local+Business+Ad", // Placeholder image
    linkUrl: "https://www.example.com/ad2",
    altText: "Advertisement for Local Business",
  },
  {
    id: "ad3",
    imageUrl:
      "https://placehold.co/300x100/3357FF/FFFFFF?text=Property+Management", // Placeholder image
    linkUrl: "https://www.example.com/ad3",
    altText: "Advertisement for Property Management",
  },
  {
    id: "ad4",
    imageUrl:
      "https://placehold.co/300x100/FF33A1/000000?text=Home+Maintenance", // Placeholder image
    linkUrl: "https://www.example.com/ad4",
    altText: "Advertisement for Home Maintenance",
  },
];

// --- END: Sample Data ---

// Existing general data, now with type annotation
const data: GeneralData[] = [
  {
    id: 1,
    icon: "user",
    label: "Personal Info",
    icon_type: "AntDesign",
    link: "PersonalInfo",
  },
  {
    id: 2,
    icon: "user",
    label: "Edit Personal Info",
    icon_type: "AntDesign",
    link: "editPersonalInfo",
  },
];

// Existing new_item, now with type annotation
let new_item: GeneralData = {
  // Re-using GeneralData for consistency
  id: 4,
  icon: "logout-outline",
  label: "Logout",
  icon_type: "Ionicons",
  link: "Logout",
};

// --- START: Account Component (now typed with React.FC) ---
const Account: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Asserting the type of userProfile_data from Redux state
  const { userProfile_data } = useSelector((state: any) => state?.ProfileSlice); // Adjust 'any' to your actual RootState type

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalformVisible, setModalFormVisible] = useState<boolean>(false);

  const openModal = (): void => {
    setModalVisible(true);
  };

  const closeFormModal = (): void => {
    setModalFormVisible(false);
  };

  const closeModal = (): void => {
    setModalVisible(false);
  };

  const handleDarkModeToggle = (isDarkMode: boolean): void => {
    // Add logic to handle dark mode state in your app
    console.log(`Dark Mode is ${isDarkMode ? "enabled" : "disabled"}`);
    // You can update your app's theme or styles based on the isDarkMode state here.
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(UserProfile_data_Fun());
    return () => {};
  }, [dispatch]);

  console.log({
    s: userProfile_data,
  });

  // Function to handle opening announcement links
  const handleAnnouncementPress = async (link?: string): Promise<void> => {
    if (link) {
      try {
        const supported = await Linking.canOpenURL(link);
        if (supported) {
          await Linking.openURL(link);
        } else {
          Alert.alert(
            "Cannot Open Link",
            `Could not open the link: ${link}. It might not be a valid URL.`
          );
        }
      } catch (error) {
        console.error("Failed to open link:", error);
        Alert.alert(
          "Error",
          "An unexpected error occurred while trying to open the link."
        );
      }
    } else {
      Alert.alert(
        "No Link",
        "No specific link provided for this announcement."
      );
    }
  };

  // Function to handle opening advertisement links
  const handleAdvertPress = async (link: string): Promise<void> => {
    if (!link) {
      Alert.alert("No Advert Link", "This advertisement does not have a link.");
      return;
    }
    try {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
      } else {
        Alert.alert(
          "Cannot Open Advertisement",
          `Could not open the ad link: ${link}. It might not be a valid URL.`
        );
      }
    } catch (error) {
      console.error("Failed to open ad link:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while trying to open the ad."
      );
    }
  };

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView} // Apply flex:1 here
      >
        <View style={styles.headerContainer}>
          <MediumFontText data="Account" textstyle={{ fontSize: 18 }} />
        </View>

        {/* --- Section 1: User Profile --- */}
        <View
          style={[
            styles.sectionContainer,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity
            style={styles.profileSection}
            onPress={() => navigation.navigate("PersonalInfo")}
          >
            <Image
              source={{
                uri:
                  (userProfile_data as UserProfileData)?.photo ||
                  "https://placehold.co/68x68/CCCCCC/000000?text=User", // Provide fallback image
              }}
              style={styles.profileImage}
            />
            <View>
              <MediumFontText
                data={
                  (userProfile_data as UserProfileData)?.user?.name ||
                  "User Name"
                }
                textstyle={styles.userNameText}
              />
              <RegularFontText
                data={
                  (userProfile_data as UserProfileData)?.phoneNumber || "N/A"
                }
                textstyle={styles.phoneNumberText}
              />
              <RegularFontText
                data={"View Profile"}
                textstyle={{
                  backgroundColor: "green",
                  color: "white",
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                  borderRadius: 10,
                }}
              />
            </View>
          </TouchableOpacity>

          <Logout item={new_item} />
        </View>

        {/* --- Section 2: General Options --- */}
        <View style={{}}>
          <View style={styles.sectionHeaderContainer}>
            <MediumFontText
              data="General"
              textstyle={styles.sectionHeaderText}
            />
            <View style={styles.divider} />
          </View>
          <View style={styles.generalOptionsContainer}>
            {data?.map((item: GeneralData, index: number) => (
              <General key={item?.id} item={item} />
            ))}
            <DeleteLAccount item={new_item} />
          </View>
        </View>

        {/* --- Section 3: Announcements --- */}
        {/*
          // Gradual Migration: Uncomment the <View> and its contents
          // when you are ready to introduce and type the Announcements section.
          // Also ensure 'Announcement' interface and 'sampleAnnouncements' data
          // are uncommented at the top of this file.
          */}

        {/* --- END: Advertisements Section --- */}

        {/* Spacer before Logout/Delete Account to push them to bottom if content is short */}
        <View style={{ flex: 1, marginBottom: 20 }} />

        {/* Emergency Modal (if still needed, outside ScrollView for overlay behavior) */}
        <EmergencyModalTwo
          visible={modalformVisible}
          onClose={closeFormModal}
        />
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default Account;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1, // Ensure KeyboardAvoidingView takes full height
  },
  scrollViewContent: {
    flexGrow: 1, // Allows content to grow and push to edges for proper scrolling
    paddingBottom: 20, // Add some padding at the bottom for spacing below actions
  },
  headerContainer: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#CFCDCD",
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 20, // Add padding to header as well
  },
  sectionContainer: {
    marginBottom: 10, // Reduced margin between major sections
    // You can add a background color or border here for visual separation of each major section
    // backgroundColor: '#FFFFFF', // Example: white background for each section
    // borderRadius: 10,
    // marginHorizontal: 20, // Example: Add horizontal margin to separate sections from screen edges
    // paddingVertical: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 10, // Reduced internal margin
    paddingVertical: 10, // Added vertical padding
  },
  profileImage: {
    width: 68,
    height: 68,
    borderRadius: 50,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: "500",
  },
  phoneNumberText: {
    fontSize: 14,
    fontWeight: "400",
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10, // Reduced top margin for sections
    marginBottom: 10, // Added bottom margin for header
    paddingHorizontal: 20,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    borderColor: "#CFCDCD",
    borderWidth: 0.5,
    flex: 1,
  },
  generalOptionsContainer: {
    gap: 20, // Reduced gap between general options items
    marginBottom: 20, // Reduced margin
    paddingHorizontal: 20,
  },
  // Removed bottomDivider as it's now handled by sectionContainer margins or general layout
  // bottomDivider: {
  //   borderBottomColor: "#CFCDCD",
  //   borderBottomWidth: 1,
  //   marginBottom: 20,
  // },
  // --- New Styles for Announcements ---
  announcementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 10, // Reduced margin
    // maxHeight: 200, // Removed maxHeight here to let FlatList content expand if scrollEnabled=false
  },
  announcementItem: {
    backgroundColor: "#e9f7ef",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d0eadb",
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#28a745",
  },
  announcementContent: {
    fontSize: 13,
    color: "#333",
    marginBottom: 5,
  },
  announcementDate: {
    fontSize: 11,
    color: "#666",
    alignSelf: "flex-end",
  },
  announcementSeparator: {
    height: 10,
  },
  readMoreLink: {
    fontSize: 12,
    color: "#007bff",
    marginTop: 5,
    textDecorationLine: "underline",
  },
  noAnnouncementsText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingVertical: 20,
  },
  // --- New Styles for Advertisements ---
  advertisementsContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    // borderWidth: 2,
    height: 200, // Fixed height for horizontal ads container
  },
  advertItem: {
    width: 300,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  advertImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  noAdvertsText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingVertical: 20,
  },
  bottomActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20, // Ensure space from the bottom of the screen
    gap: 10, // Gap between Delete Account and Logout
  },
});

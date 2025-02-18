



import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react'
import { emergencydata } from '../../../components/Emergency/emdata'
import AppScreen from '../../../components/shared/AppScreen'
import EmergencyModal, { EmergencyModalTwo } from '../../../components/Emergency/Modal'
import { LightFontText, MediumFontText, RegularFontText } from "../../../components/shared/Paragrahp"
import DarkModeToggle from '../../../components/Account/DarkModeToggle'
import General from '../../../components/Account/General'
import { DeleteAccountModal } from '../../../components/Account/Modal'
import { Logout } from '../../../components/Account/Logout'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/AppNavigation'

import { FontAwesome5 } from '@expo/vector-icons';
import { CustomTextArea, Formbutton } from '../../../components/shared/InputForm'

type GeneralData = {
    id: number;
    label: string;
    link: string;
    des: string
};

const data: GeneralData[] = [
    {
        id: 1,
        label: 'Email Us',
        des: "Replies within 8hrs",
        link: 'PersonalInfo',

    },
    {
        id: 2,
        label: 'Email Us',
        des: "Replies within 8hrs",
        link: 'PersonalInfo',
    },

    {
        id: 3,
        label: 'Email Us',
        des: "Replies within 8hrs",
        link: 'PersonalInfo',
    },




];


let new_item = {
    id: 4,
    icon: 'logout-outline',
    label: 'Logout',
    icon_type: 'Ionicons',
    link: "Logout"
}



const PrivacyPolicy = () => {












    return (

        <ScrollView style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Privacy Policy for Pausepoint App</Text>

            <Text style={{ marginBottom: 20 }}>
                1. Introduction
                PG Works & Services Ltd in affiliation of Pausepoint app ("we", "our", or "us") operates the Pausepoint mobile application (the "App"). This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our App and the choices you have associated with that data.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                2. Information Collection And Use
                We collect various types of information for different purposes to provide and improve our Service to you.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                How We Collect Information
                We gather information through:
                - Feedback you provide on our service
                - Online forms
                - Surveys
                - Interaction with us via social media platforms
                - Offline communication methods
                - Third-party data collection sources (e.g., Google Analytics)
            </Text>

            <Text style={{ marginBottom: 20 }}>
                Types of Data Collected
                - Personal Data: This includes information like email address, first and last name, phone number, address, etc.
                - Usage Data: Automatically collected information includes device type, IP address, operating system, etc.
                - Tracking & Cookies Data: We use cookies and similar technologies to track activity and hold certain information.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                3. Use of Data
                We utilize collected data for various purposes, including but not limited to providing, maintaining, and improving the Service, notifying you about changes, providing customer support, and monitoring usage.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                4. Sharing Personal Information
                We do not sell, trade, or rent personal identification information. However, we may share generic aggregated demographic information with trusted affiliates and advertisers. Personal information may be disclosed in specific cases outlined in our policy.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                5. Security Of Data
                We employ appropriate measures to safeguard and secure the information we collect, including encryption and secure payment gateways.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                6. Children's Privacy
                Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from children without parental consent.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                7. Dispute Resolution Or Filing A Complaint
                If you have any complaints regarding our compliance with this Privacy Policy, please contact our Data Protection Officer. We will investigate and attempt to resolve complaints and disputes within thirty (30) days.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                8. Changes To This Privacy Policy
                We may update our Privacy Policy periodically, and we will notify you of any changes. You are advised to review this Privacy Policy periodically for any updates.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                9. NDPR and GDPR Compliance
                Our privacy policy complies with both NDPR and GDPR rules and regulations.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                10. Contact Us
                If you have any questions about this Privacy Policy, please contact us using the provided contact information.
                Lekki Palm City Addo Road Ajah, Lagos, Nigeria.
                By email: support@pausepoint.net
                By visiting this page on our website: www.pausepoint.net
                By phone number: +234 703 984 5638
            </Text>
        </ScrollView>
    )
}

export default PrivacyPolicy

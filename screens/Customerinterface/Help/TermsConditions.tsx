


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



const TermsConditions = () => {












    return (

        <ScrollView style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Terms and Conditions for Pausepoint App</Text>

            <Text style={{ marginBottom: 20 }}>
                The use of Pausepoint mobile application (the "App"), operated by PG works & Services Ltd ("us," "we," or "our"), is governed by these Terms and Conditions. By accessing or using the App, you agree to adhere to these Terms and Conditions, including our Privacy Policy, which outlines the collection, use, and disclosure of personal data. The App, its content, features, and functionality are owned by Pausepoint Ltd and are protected by various intellectual property laws. Users may need to create an account to access certain features and are responsible for maintaining the confidentiality of their account information. Engaging in activities that disrupt the App or its connected servers or networks is prohibited. We reserve the right to terminate or suspend access to the App without prior notice if these Terms and Conditions are breached. These Terms and Conditions are governed by the laws of Nigeria. We may modify or replace these Terms and Conditions at any time, and continued use of the App constitutes acceptance of any revised terms.
            </Text>
        </ScrollView>
    )
}

export default TermsConditions

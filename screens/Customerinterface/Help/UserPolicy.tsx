


import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, Linking, ScrollView } from 'react-native'
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



const UserPolicy = () => {












    return (

        <ScrollView style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>User Policy</Text>

            <Text style={{ marginBottom: 20 }}>
                1. Welcome to the Pausepoint App Gated Community; before engaging, please review and understand our user policy.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                2. Users must adhere to applicable laws and regulations and refrain from engaging in unlawful, harmful, or objectionable behavior.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                3. We value your privacy and handle your personal information according to our Privacy Policy, to which you consent by using the app.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                4. Users are accountable for their actions, including content creation, sharing, and compliance with community guidelines.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                5. Our community guidelines foster a positive and inclusive environment, outlining expected behavior, content standards, and engagement rules.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                6. Respect intellectual property rights and refrain from infringing upon the rights of others.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                7. We reserve the right to moderate user-generated content to maintain compliance with our policies and guidelines.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                8. Users are encouraged to report policy violations for prompt investigation and appropriate action.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                9. Disputes should be resolved through open communication and may involve contacting support for assistance.
            </Text>

            <Text style={{ marginBottom: 20 }}>
                10. Policy updates will be communicated to users, who agree to continued adherence by using the app.
            </Text>
        </ScrollView>
    )
}

export default UserPolicy

const styles = StyleSheet.create({})
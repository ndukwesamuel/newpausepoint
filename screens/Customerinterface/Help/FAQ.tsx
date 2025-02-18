



import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';

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



const FAQ = () => {







    const handleContactUs = () => {
        // Implement your logic to handle contact us action
        // For example, opening an email client or navigating to a contact form screen
    };





    return (

        <ScrollView style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>FAQS</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.pausepoint.net')}>
                <Text style={{ fontSize: 16, color: 'blue', marginBottom: 20 }}>Visit our website</Text>
            </TouchableOpacity>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>1. How does Pausepoint gather information?</Text>
                <Text>Pausepoint collects information through various channels, including feedback, online forms, surveys, social media interactions, and third-party data sources like Google Analytics.</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>2. What types of data does Pausepoint collect?</Text>
                <Text>Pausepoint collects Personal Data such as email addresses, names, phone numbers, and Usage Data like device information and IP addresses. We also utilize cookies for tracking purposes.</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>3. How does Pausepoint utilize collected data?</Text>
                <Text>Pausepoint employs collected data for maintaining the Service, providing customer support, analyzing usage patterns, and enhancing the user experience.</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>4. Is my personal information secure with Pausepoint?</Text>
                <Text>Yes, Pausepoint implements various security measures, including encryption and secure payment gateways, to safeguard collected information.</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>5. Does Pausepoint adhere to privacy regulations?</Text>
                <Text>Yes, Pausepoint's privacy policy aligns with both NDPR and GDPR regulations to uphold user privacy and data rights.</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>6. Contact Us</Text>
                <Text>If you have any inquiries about this Privacy Policy, please reach out to us using the provided contact information:</Text>
                <Text>Lekki Palm City Addo Road Ajah, Lagos, Nigeria.</Text>
                <TouchableOpacity onPress={() => Linking.openURL('mailto:support@pausepoint.net')}>
                    <Text style={{ color: 'blue' }}>support@pausepoint.net</Text>
                </TouchableOpacity>
                <Text>Phone number: +234 703 984 5638</Text>
            </View>

            <TouchableOpacity onPress={handleContactUs}>
                <Text style={{ fontSize: 16, color: 'blue', marginBottom: 20 }}>Contact Us</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default FAQ

// const styles = StyleSheet.create({})
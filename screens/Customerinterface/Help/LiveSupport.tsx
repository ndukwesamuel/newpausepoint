


import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, Linking } from 'react-native'
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



const LiveSupport = ({ navigation }: { navigation: any }) => {



    const [modalVisible, setModalVisible] = useState(false);
    const [modalformVisible, setModalFormVisible] = useState(false);


    const openModal = () => {
        setModalVisible(true);
    };

    const closeFormModal = () => {
        setModalFormVisible(false);
    };



    const closeModal = () => {
        setModalVisible(false);
    };


    const handleDarkModeToggle = (isDarkMode: boolean) => {
        // Add logic to handle dark mode state in your app
        console.log(`Dark Mode is ${isDarkMode ? 'enabled' : 'disabled'}`);
        // You can update your app's theme or styles based on the isDarkMode state here.
    };




    const makePhoneCall = () => {
        Linking.openURL('tel:+1234567890');
    };







    return (

        <AppScreen>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>


                <View style={{ flex: 1, paddingHorizontal: 20 }}>

                    <View style={{ alignItems: 'center', gap: 10 }}>
                        <FontAwesome5 name="question" size={70} color="black" />

                        <View>

                            <MediumFontText data="Got a problem? Let’s fix it" textstyle={{ fontSize: 18, fontWeight: '500' }} />

                        </View>
                    </View>





                    <View style={{ gap: 20, marginBottom: 40 }}>
                        {/* {data?.map((item, index) => ( */}
                        <TouchableOpacity
                            // onPress={() => Linking.openURL('mailto:support@example.com?subject=SendMail&body=Description')}
                            onPress={() => Linking.openURL('mailto:pausepoint2023@gmail.com')}

                            style={{ backgroundColor: "#F6F8FA", paddingHorizontal: 20, paddingVertical: 20 }}>
                            <MediumFontText data="Email Us" textstyle={{ fontSize: 14, fontWeight: '500' }} />
                            {/* <General key={item?.id} item={item} /> */}

                            <LightFontText data="Replies within 8hrs" textstyle={{ fontSize: 12 }} />

                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => navigation.navigate('ComplaintsFeedback')}

                            style={{ backgroundColor: "#F6F8FA", paddingHorizontal: 20, paddingVertical: 20 }}>
                            <MediumFontText data="Complaint and Feedback" textstyle={{ fontSize: 14, fontWeight: '500' }} />
                            {/* <General key={item?.id} item={item} /> */}

                            <LightFontText data="Replies ASAP" textstyle={{ fontSize: 12 }} />

                        </TouchableOpacity>

                        <TouchableOpacity
                            // onPress={() => Linking.openURL('mailto:support@example.com?subject=SendMail&body=Description')}
                            onPress={() => Linking.openURL('tel:+2349019269787')}

                            style={{ backgroundColor: "#F6F8FA", paddingHorizontal: 20, paddingVertical: 20 }}>
                            <MediumFontText data="Call Us" textstyle={{ fontSize: 14, fontWeight: '500' }} />
                            {/* <General key={item?.id} item={item} /> */}

                            <LightFontText data="Replies ASAP" textstyle={{ fontSize: 12 }} />

                        </TouchableOpacity>
                        {/* ))} */}
                    </View>












                </View>






            </KeyboardAvoidingView>

        </AppScreen>
    )
}

export default LiveSupport

const styles = StyleSheet.create({})



import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { emergencydata } from '../../../components/Emergency/emdata'
import AppScreen from '../../../components/shared/AppScreen'
import EmergencyModal, { EmergencyModalTwo } from '../../../components/Emergency/Modal'
import { MediumFontText, RegularFontText } from "../../../components/shared/Paragrahp"
import DarkModeToggle from '../../../components/Account/DarkModeToggle'
import General from '../../../components/Account/General'
import { DeleteAccountModal } from '../../../components/Account/Modal'
import { Logout } from '../../../components/Account/Logout'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/AppNavigation'



type GeneralData = {
    id: number;
    icon: string;
    label: string;
    icon_type: string
    link: string
};

const data: GeneralData[] = [
    {
        id: 1,
        icon: '',
        label: 'Live Support',
        icon_type: 'AntDesign',
        link: 'LiveSupport',

    },
    {
        id: 2,
        icon: '',
        label: 'FAQ’s',
        icon_type: 'Ionicons',
        link: 'FAQ',
    },

    {
        id: 3,
        icon: '',
        label: 'User policy',
        icon_type: 'Ionicons',
        link: 'UserPolicy',
    },


    {
        id: 4,
        icon: '',
        label: 'Terms and Conditions',
        icon_type: 'Ionicons',
        link: 'Terms&Conditions',
    },
    {
        id: 5,
        icon: '',
        label: 'Privacy Policy',
        icon_type: 'Ionicons',
        link: 'PrivacyPolicy',
    },
    {
        id: 6,
        icon: '',
        label: 'Share this app with friends ',
        icon_type: 'Ionicons',
        link: 'button',

    },


    // Add more objects as needed
];


let new_item = {
    id: 4,
    icon: 'logout-outline',
    label: 'Logout',
    icon_type: 'Ionicons',
    link: "Logout"
}



const HelpSupport = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


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








    const RenderItem = ({ item }: { item: any }) => {


        return (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CFCDCD', borderRadius: 6, paddingHorizontal: 10, gap: 10, paddingVertical: 20, marginBottom: 20 }}

                onPress={() => setModalVisible(true)
                }
            >

                <View style={{ borderWidth: 1, borderColor: '#CFCDCD', borderRadius: 6, justifyContent: 'center', alignItems: 'center', }}>

                    <Image source={item.image} style={{ width: 38, height: 40 }} />
                </View>

                <View style={{ width: '90%' }}>
                    <Text style={{ fontWeight: '500', fontSize: 14, fontFamily: 'RobotoSlab-Medium', marginBottom: 10 }}>{item.name}</Text>

                    <Text>{item.description}</Text>



                </View>

            </TouchableOpacity>
        )
    }


    return (

        <AppScreen>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>


                <View style={{ flex: 1, paddingHorizontal: 20, }}>

                    <View style={{ alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <Image source={require('../../../assets/uses.png')}
                            style={{ width: 68, height: 68, borderRadius: 50 }}

                        />

                        {/* <View>

                            <MediumFontText data="John Doe" textstyle={{ fontSize: 18, fontWeight: '500' }} />

                        </View> */}
                    </View>





                    <View style={{ gap: 20, marginBottom: 40 }}>
                        {data?.map((item, index) => (
                            <View key={item?.id}>
                                <General key={item?.id} item={item} />
                                <View style={{ borderBottomColor: '#CFCDCD', borderBottomWidth: 1, marginBottom: 10, marginTop: 10 }} />

                            </View>
                        ))}
                    </View>










                </View>






            </KeyboardAvoidingView>

        </AppScreen>
    )
}

export default HelpSupport

const styles = StyleSheet.create({})
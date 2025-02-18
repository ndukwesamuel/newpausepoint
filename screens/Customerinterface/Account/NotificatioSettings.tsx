




import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { emergencydata } from '../../../components/Emergency/emdata'
import AppScreen from '../../../components/shared/AppScreen'
import EmergencyModal, { EmergencyModalTwo } from '../../../components/Emergency/Modal'
import { MediumFontText, RegularFontText } from "../../../components/shared/Paragrahp"
import DarkModeToggle from '../../../components/Account/DarkModeToggle'
import General from '../../../components/Account/General'
import { DeleteAccountModal } from '../../../components/Account/Modal'
import SmsToggle from '../../../components/Account/SmsToggle'
import { AntDesign } from '@expo/vector-icons';
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
        icon: 'user',
        label: 'Edit Personal Info',
        icon_type: 'AntDesign',
        link: 'PersonalInfo',

    },
    {
        id: 2,
        icon: 'notifications-outline',
        label: 'Notification',
        icon_type: 'Ionicons',
        link: 'notificationsettings',
    },

    {
        id: 3,
        icon: 'setting',
        label: 'Change Password',
        icon_type: 'Ionicons',
        link: 'EditPersonalInformation',
    },


    // Add more objects as needed
];


let new_item = {
    id: 4,
    icon: 'logout-outline',
    label: 'Logout',
    icon_type: 'Ionicons',
    link: ""
}



const NotificatioSettings = () => {

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

    const handleSMSToggle = (isDarkMode: boolean) => {
        // Add logic to handle dark mode state in your app
        console.log(`SMS Mode is ${isDarkMode ? 'enabled' : 'disabled'}`);
        // You can update your app's theme or styles based on the isDarkMode state here.
    };








    const RenderItem = ({ item, navigation }: { item: any, navigation: any }) => {


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


                <View style={{ marginBottom: 20, flexDirection: "row", alignItems: "center", borderBottomColor: '#CFCDCD', borderBottomWidth: 1, paddingBottom: 10, paddingHorizontal: 20 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </TouchableOpacity>

                    <MediumFontText data="Notification Settings " textstyle={{ fontSize: 18, width: '80%', textAlign: 'center' }} />
                </View>



                <View style={{ flex: 1, paddingHorizontal: 20 }}>






                    {/* <View style={{ gap: 40, marginBottom: 40 }}>
                        {data?.map((item, index) => (
                            <General key={item?.id} item={item} />
                        ))}
                    </View> */}


                    <SmsToggle onDarkModeToggle={handleSMSToggle} />
                    <SmsToggle onDarkModeToggle={handleSMSToggle} />
                    <SmsToggle onDarkModeToggle={handleSMSToggle} />











                </View>




                <DeleteAccountModal visible={modalVisible} onClose={closeModal} setModalFormVisible={setModalFormVisible} />
                <EmergencyModalTwo visible={modalformVisible} onClose={closeFormModal} />


            </KeyboardAvoidingView>

        </AppScreen>
    )
}

export default NotificatioSettings

const styles = StyleSheet.create({})
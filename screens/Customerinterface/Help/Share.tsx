


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



const Share = () => {












    return (

        <AppScreen>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>


                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    <RegularFontText data="Lörem ipsum bodolingar biläfaliga lesongen mysokyfån på lar. Kroligen plasa. Trengen får, även om multis, i nodorade och saheten. Frimester vinde por. 
Pseudossa hyporen, sade. Nedir åde att påsäras, terrastik. Denes ol, bikygisk. Vafålingar runera lasm rer. Toska nipp kakyngen. Dobel säpojogg treskapet atina: kameratelefon eftersom diledes. Trin semitode. Vaskap tidade men der. 
Lesahet össa, neren. Anadade dektig pon spen, ösm degt. Rede förlåtandeintervall realing osade. Makrott euronde. 
Säbel telengen der killgissa i paltkoma i tiling. Hyponade beskap sod. Polytinok homovis inte fårutiktiga. Presam olig, kasas. 
Decis speda fonotion eftersom nihyrade personlig ana. Gensax monogyn olingar kang och povis emedan kvasin. Bäledes did guldsot när dovis bonol. Tresal hemiret. 
Makronas. Heteroitet oliga även om hynat. Neligt bios säreskade. Sal sonorat krona. 
Farade viligt benotisk, tills ultravagt förutom flygskam i monol. Intrajeliga usade och don, den etnotologi. Jongar or i kolig, liksom nes som kost, doskapet. Våck singen passivhus ifall svennekoloni. Tikyd koligen inklusive rebel i vårelogi att sekyna. Diktiga teled sasade blingbling. Tiska sev. Poren eurobossa jugon i Ter dengar prel ojelingar: grönt körfält. Megan egonening i kakyv. Pad lävåhet bett. Prertad plajofågisk prekynymir EU-migrant, i das ser. 
" textstyle={{ fontSize: 14 }} />
















                </View>





            </KeyboardAvoidingView>

        </AppScreen>
    )
}

export default Share

const styles = StyleSheet.create({})
import { Modal, View, Text, Linking, Pressable, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native'

import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { Children, ReactNode, useState } from 'react'
import { FormLabel, Formbutton, Forminput } from '../shared/InputForm';
import { MediumFontText } from '../shared/Paragrahp';




interface EmergencyModalProps2 {
    visible: boolean;
    onClose: () => void;

}
export const HalfScreenModal = ({ onClose, visible, }: EmergencyModalProps2) => {
    const [homeaddress, setHomeaddress] = useState("")
    const [moreinfo, setMoreinfo] = useState("")

    const phoneNumber = '1234567890'; // Replace with the phone number you want to call

    const makePhoneCall = () => {
        const url = `tel:${phoneNumber}`;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    console.error(`Cannot open phone call: ${url}`);
                }
            })
            .catch((error) => {
                console.error(`Error making phone call: ${error}`);
            });
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>



            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        flex: 1,
                        justifyContent: 'flex-end',


                    }}
                >

                    <View style={{
                        height: '40%',
                        width: '100%',
                        backgroundColor: 'white',
                        borderTopRightRadius: 18,
                        borderTopLeftRadius: 18,

                        paddingHorizontal: 20,

                        borderWidth: 1,
                        borderColor: "green"
                    }}>
                        <View style={{
                            height: '16%',
                            backgroundColor: 'white',
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',


                        }}>

                            <TouchableOpacity onPress={onClose}>
                                <AntDesign name="arrowleft" size={24} color="black" />

                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1, }}>

                            <View style={{ marginBottom: 15 }}>
                                <Forminput
                                    placeholder='House Address'
                                    onChangeText={setHomeaddress}
                                    value={homeaddress}

                                />



                                <TextInput
                                    placeholder="Add more info...."
                                    onChangeText={setMoreinfo}
                                    value={moreinfo}

                                    style={{
                                        // borderWidth: 1,
                                        padding: 10,
                                        borderRadius: 5,
                                        fontSize: 16,
                                        backgroundColor: "#F6F8FAE5",
                                        // opacity: 0.4
                                        minHeight: 100,
                                        marginTop: 20
                                    }}
                                    multiline
                                    numberOfLines={4}


                                />
                            </View>



                            <TouchableOpacity onPress={makePhoneCall} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                                <Ionicons name="call" size={24} color="#04973C" />


                                <MediumFontText textstyle={{ fontSize: 14 }} data="Call for Admin" />
                            </TouchableOpacity>


                            <Formbutton
                                buttonStyle={{ backgroundColor: '#04973C', paddingVertical: 14, alignItems: 'center', borderRadius: 5 }}
                                textStyle={{ color: 'white', fontWeight: "500", fontSize: 14, fontFamily: "RobotoSlab-Medium" }}
                                data='Submit'

                            />



                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>


    )
}













const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: '50%',
    },
    closeButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        color: 'blue', // Customize the close button style
    },
});

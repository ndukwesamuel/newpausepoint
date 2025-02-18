import { Modal, View, Text, Linking, Pressable, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native'

import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { ReactNode, useState } from 'react'
import { FormLabel, Formbutton, Forminput } from '../shared/InputForm';
import { MediumFontText } from '../shared/Paragrahp';



interface EmergencyModalProps {
    visible: boolean;
    onClose: () => void;
    setModalFormVisible: React.Dispatch<React.SetStateAction<boolean>>
    navigation: any
}

export const DeleteAccountModal = ({ navigation, visible, onClose, setModalFormVisible }: EmergencyModalProps) => {
    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>

                    <MediumFontText data="Are you sure you want to delete your account?" textstyle={{ fontSize: 17, fontWeight: '500', color: 'red', textAlign: 'center', marginBottom: 20 }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>

                        <TouchableOpacity style={{}} onPress={onClose}>
                            <Text style={{}}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: "#04973C", paddingHorizontal: 12, paddingVertical: 2, borderRadius: 6 }} onPress={() => {

                            setModalFormVisible(true)
                            console.log("yes");
                            onClose()



                        }}>
                            <Text style={{ color: 'white', fontWeight: '500', fontSize: 14, fontFamily: 'RobotoSlab-Medium' }}>Yes</Text>
                        </TouchableOpacity>


                    </View>


                </View>
            </View>
        </Modal >
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
        width: '70%',
    },
    closeButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        color: 'blue', // Customize the close button style
    },
});

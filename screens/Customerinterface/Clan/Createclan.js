import { View, Text, FlatList, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { CustomTextArea, Forminput, Forminput_Icon, RadioButton } from '../../../components/shared/InputForm'
import { AntDesign } from '@expo/vector-icons';
import { LightFontText, MediumFontText, RegularFontText } from '../../../components/shared/Paragrahp';
import * as ImagePicker from "expo-image-picker";

const Createclan = () => {

    const [activeButton, setActiveButton] = useState('Social'); // Initialize with 'Social' as the active button

    const initialData = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Alice' },
        { id: 3, name: 'Bob' },
        // Add more objects to your initial data
    ];

    const [filteredData, setFilteredData] = useState(initialData);

    const [formData, setFormData] = useState({
        search: '', // Initialize with empty values
    });
    const [name, setName] = useState("")
    const [text, setText] = useState('');


    const handleTextChange = (newText: string) => {
        setText(newText);
    };


    const handleInputChange = (inputName: string, text: string) => {
        setFormData({ ...formData, [inputName]: text });

        // Filter the data based on the search input
        const filtered = initialData.filter((item) =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };



    // this is for image 
    const [profileImage, setProfileImage] = useState('https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'); // Replace with the user's actual data

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        // Handle the saving of user data here (e.g., make API calls).
    };


    const [selectedOption, setSelectedOption] = useState(1);

    const handleRadioSelect = (option: number) => {
        setSelectedOption(option);
    };


    return (
        <View style={{
            paddingHorizontal: 20,
            flex: 1
        }}>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "height" : "height"}
                style={{ flex: 1 }}
            >
                <View style={{ marginVertical: 20, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderWidth: 1, borderColor: "#CFCDCD", borderRadius: 6, padding: 10 }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: activeButton === 'Social' ? 'green' : 'transparent',
                            padding: 10, // Adjust the padding as needed
                            borderRadius: 5, // Add rounded corners if desired
                        }}
                        onPress={() => setActiveButton('Social')}
                    >


                        <MediumFontText
                            data="Social"
                            textstyle={{
                                fontSize: 16, fontWeight: "500",

                                color: activeButton === 'Social' ? 'white' : 'black',

                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: activeButton === 'Residential' ? 'green' : 'transparent',
                            padding: 10, // Adjust the padding as needed
                            borderRadius: 5, // Add rounded corners if desired
                        }}
                        onPress={() => setActiveButton('Residential')}
                    >
                        <MediumFontText
                            data="Residential"
                            textstyle={{
                                fontSize: 16, fontWeight: "500",

                                color: activeButton === 'Residential' ? 'white' : 'black',

                            }}
                        />

                    </TouchableOpacity>
                </View>




                <View>

                    <TouchableOpacity onPress={pickImage}
                        style={{ alignItems: "center", justifyContent: "center" }}>
                        <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, borderRadius: 50 }} />


                        <LightFontText data=" Choose Clan Profile Picture"
                            textstyle={{ fontSize: 12, fontWeight: "300" }}

                        />
                    </TouchableOpacity>
                    <ScrollView>

                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={{ flex: 1 }}
                        >
                            <View>

                                <MediumFontText data="Clan Name" textstyle={{ fontSize: 14, }} />

                                <Forminput placeholder='Clan Name' onChangeText={setName} value={name} />





                                <MediumFontText data="Clan Name" textstyle={{ fontSize: 14, }} />

                                <CustomTextArea
                                    placeholder="Enter text here..."
                                    value={text}
                                    onChangeText={handleTextChange}
                                    style={{ width: '80%', }}
                                    inputStyle={{
                                        backgroundColor: "#F6F8FAE5",
                                        paddingHorizontal: 10,
                                        paddingVertical: 20,
                                        height: 200,
                                        padding: 10,
                                        borderRadius: 6,
                                        fontSize: 16,

                                    }}
                                />
                            </View>




                            <View>
                                {activeButton === 'Residential' && (
                                    <View style={{ gap: 10, marginTop: 20 }}>
                                        <MediumFontText
                                            data="Clan Address "
                                            textstyle={{
                                                fontSize: 14, fontWeight: "500",


                                            }}
                                        />




                                        <View>
                                            <RegularFontText data="Country" textstyle={{ fontSize: 12, }} />

                                            <Forminput placeholder='Country' onChangeText={setName} value={name} />

                                        </View>


                                        <View>
                                            <RegularFontText data="State or Region" textstyle={{ fontSize: 12, }} />

                                            <Forminput placeholder='State or Region' onChangeText={setName} value={name} />

                                        </View>

                                        <View>
                                            <RegularFontText data="City" textstyle={{ fontSize: 12, }} />

                                            <Forminput placeholder='City' onChangeText={setName} value={name} />

                                        </View>

                                    </View>
                                )}
                            </View>


                            <View style={{ marginTop: 20 }}>
                                {activeButton === 'Social' && (

                                    <View>

                                        <MediumFontText
                                            data="Type of Clan Membership        "
                                            textstyle={{
                                                fontSize: 14, fontWeight: "500",

                                            }}
                                        />
                                        <View>
                                            <Text>Choose an option:</Text>
                                            <RadioButton label="Public 
(No restrictions. Everybody is welcome!)" selected={selectedOption === 1} onSelect={() => handleRadioSelect(1)}


                                            />
                                            <RadioButton label="Private
(Only those approved by the Administrator)" selected={selectedOption === 2} onSelect={() => handleRadioSelect(2)}
                                                inputStyle={styles.radioButton}
                                            />
                                            {/* Add more options as needed */}

                                            <RadioButton label="Exclusive 
(Strictly by invitation)" selected={selectedOption === 3} onSelect={() => handleRadioSelect(3)} />
                                        </View>

                                    </View>
                                )}
                            </View>


                        </KeyboardAvoidingView>

                    </ScrollView>


                </View>



            </KeyboardAvoidingView>
        </View>
    )
}

export default Createclan


const styles = StyleSheet.create({
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'lightgray',
        marginRight: 10,
    },

});
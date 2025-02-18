import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { MediumFontText, RegularFontText, SemiBoldFontText } from '../../../components/shared/Paragrahp'

import { MaterialIcons } from '@expo/vector-icons';


let fakedata: any = []
let fakedataResolve: any = [

    {
        name: 'Fire Emergency',
        day: 'Monday',
        time: '10:30 AM',
        sender: 'Fire Department',
    },
    {
        name: 'Medical Emergency',
        day: 'Wednesday',
        time: '2:45 PM',
        sender: '911 Operator',
    },
    {
        name: 'Police Emergency',
        day: 'Saturday',
        time: '8:15 PM',
        sender: 'Police Department',
    },

    {
        name: 'Police Emergency',
        day: 'Saturday',
        time: '8:15 PM',
        sender: 'Police Department',
    },

    {
        name: 'Police Emergency',
        day: 'Saturday',
        time: '8:15 PM',
        sender: 'Police Department',
    },


]





const Notification = ({ navigation }: { navigation: any }) => {


    const RenderItem = ({ item }: { item: any }) => {



        return (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CFCDCD', borderRadius: 6, paddingHorizontal: 10, gap: 10, paddingVertical: 20, marginBottom: 20 }}

                onPress={() => navigation.navigate("EmergencyDetails", { data: "this" })
                }
            >

                <View style={{ borderRadius: 6, justifyContent: 'center', alignItems: 'center', }}>
                    {/* import fireImage from "../../assets/images/fire.png"; */}
                    <Image source={require('../../../assets/images/fire.png')} style={{ width: 38, height: 40 }} />

                </View>

                <View style={{ width: '90%', flexDirection: "row", justifyContent: "space-between", flex: 1, alignItems: "center" }}>
                    <View style={{}}>

                        <MediumFontText data={item.name} textstyle={{ fontSize: 16, }} />
                        <RegularFontText data={`By ${item.sender}`} textstyle={{ fontSize: 11, color: '#696969' }} />
                        <RegularFontText data={`2 Days Ago   |   7:56 PM`} textstyle={{ fontSize: 11, color: '#696969' }} />

                    </View>

                    <View style={{}}>




                        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />


                    </View>

                </View>

            </TouchableOpacity>
        )
    }
    return (


        <View style={{ flex: 1 }}>
            <View style={{}}>

                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <RegularFontText data="Recent" textstyle={{ fontSize: 12 }} />
                    <View style={{ borderWidth: 1, borderColor: "#8C8F9214", width: "100%" }} />
                </View>

                {fakedataResolve && fakedataResolve.length > 0 ? <View>


                    <FlatList data={fakedataResolve} renderItem={({ item }) => <RenderItem item={item} />} />

                </View> :
                    <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 20 }}>
                        <Image

                            source={require('../../../assets/images/Pendingdata.png')}
                            style={{ width: 250, height: 100 }}
                        />

                        <MediumFontText data="No Pending Emergencies" textstyle={{ fontSize: 14, color: "#969696" }} />

                    </View>
                }
            </View>

            <View style={{}}>

                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <RegularFontText data="Previous" textstyle={{ fontSize: 12 }} />
                    <View style={{ borderWidth: 1, borderColor: "#8C8F9214", width: "100%" }} />
                </View>

                {fakedataResolve && fakedataResolve.length > 0 ? <View>


                    <FlatList data={fakedataResolve} renderItem={({ item }) => <RenderItem item={item} />} />

                </View> :
                    <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 20 }}>
                        <Image

                            source={require('../../../assets/images/Pendingdata.png')}
                            style={{ width: 250, height: 100 }}
                        />

                        <MediumFontText data="No Pending Emergencies" textstyle={{ fontSize: 14, color: "#969696" }} />

                    </View>
                }
            </View>
        </View>




    )
}

export default Notification
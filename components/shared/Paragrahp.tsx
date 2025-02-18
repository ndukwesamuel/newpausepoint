import { StyleSheet, Text, TextStyle, View } from 'react-native'
import React from 'react'



interface MediumFontTextProps {
    textstyle: TextStyle
    data: string
}

export const BoldFontText = ({ textstyle, data }: MediumFontTextProps) => {
    return (
        <Text style={[textstyle, { fontFamily: 'RobotoSlab-Medium', fontWeight: "700" }]}>{data} </Text>
    )
}


export const SemiBoldFontText = ({ textstyle, data }: MediumFontTextProps) => {
    return (
        <Text style={[textstyle, { fontFamily: 'RobotoSlab-Medium', fontWeight: "600" }]}>{data} </Text>
    )
}




export const MediumFontText = ({ textstyle, data }: MediumFontTextProps) => {
    return (
        <Text style={[textstyle, { fontFamily: 'RobotoSlab-Medium', fontWeight: "500" }]}>{data} </Text>
    )
}



export const RegularFontText = ({ textstyle, data }: MediumFontTextProps) => {
    return (
        <Text style={[textstyle, { fontFamily: 'RobotoSlab-Regular', fontWeight: "400" }]}>{data} </Text>
    )
}

export const LightFontText = ({ textstyle, data }: MediumFontTextProps) => {
    return (
        <Text style={[textstyle, { fontFamily: 'RobotoSlab-Light', fontWeight: "300" }]}>{data} </Text>
    )
}  
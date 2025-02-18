import { StyleSheet, Text, TextStyle, View } from 'react-native'
import React from 'react'

export const RegistraionHeadersText = ({ data, textStyle }: { data: string, textStyle?: TextStyle; }) => {
    return (
        <Text style={[textStyle, {
            fontWeight: "600",
            fontSize: 28,
            fontFamily: "RobotoSlab-SemiBold",
        }]}>{data}</Text>
    )
}




interface RegistraionParagraphTextProps { data: string, color: string, mainstyle?: TextStyle }

export const RegistraionParagraphText = ({ data, color, mainstyle }: RegistraionParagraphTextProps) => {
    return (
        <Text style={[{
            color: color || "#8E8E8F",
            fontWeight: "400",
            fontSize: 16,
            fontFamily: "RobotoSlab-Medium",
        }]}>{data}</Text>
    )
}





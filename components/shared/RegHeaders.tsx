import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export const RegHeaders = ({ data }: { data: string }) => {
    return (
        <View>
            <Text style={{
                fontWeight: "600",
                fontSize: 28,
                fontFamily: "RobotoSlab-SemiBold",
            }}>{data}</Text>
        </View>
    )
}

export default RegHeaders

const styles = StyleSheet.create({


})
import { Animated, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'

const Pagination = ({ data, scrollX }: any) => {

    console.log(data);

    const { width } = useWindowDimensions()
    return (


        <View style={styles.paginationContainer}>
            {data.map((_: any, index: number) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.2, 1, 0.2],
                    extrapolate: 'clamp'
                })
                const datwidth = scrollX.interpolate({ inputRange, outputRange: [20, 30, 20], extrapolate: 'clamp' })
                return <Animated.View style={[styles.dots, { width: datwidth, opacity }]} key={index.toString()} /> //<Dot index={index} x={x} key={index} />;
            })}
        </View>
    )
}

export default Pagination



const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: "row",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },

    dots: {
        height: 6,

        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: "#005b4f"
    },
});
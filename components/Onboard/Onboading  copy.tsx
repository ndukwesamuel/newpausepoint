import React, { useRef, useState, useCallback } from 'react';
import { FlatList, Image, StyleSheet, Text, View, useWindowDimensions, Animated, Pressable, TouchableOpacity } from 'react-native';
import { mainSlide } from '../../utils/slides';
import Pagination from './Pagination';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppScreen from '../shared/AppScreen';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigation';
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { useDispatch } from 'react-redux';
import { checkOnboarding } from '../../Redux/OnboardingSlice';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// let userAPi = process.env.APIBASEURL + "user/login";
// const postUrl = process.env.BASE_URL



interface ItemProps {
    itemdata: {
        id: number;
        title: string;
        des: string;
        images: any;
    };
}

const Onboarding = ({ }: any) => {

    const dispatch = useDispatch();

    // const navigation = useNavigation();
    const [currentViewableItems, setCurrentViewableItems] = useState(0);
    const { width } = useWindowDimensions();
    const scrollX = useRef(new Animated.Value(0)).current;
    const slideref = useRef(null);

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

    const Item = ({ itemdata }: ItemProps) => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width }}>
            <Image source={itemdata.images} style={[styles.Image, { width: "90%", resizeMode: 'contain' }]} />
            <View style={{}}>
                <Text style={styles.title}>{itemdata?.title}</Text>
                <Text style={styles.des}>{itemdata?.des}</Text>
            </View>
        </View>
    );

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<any> }) => {
        setCurrentViewableItems(viewableItems[0].index);
    }, []); // Empty dependency array ensures this callback has a stable identity
    const showDoneButton = currentViewableItems === mainSlide.length - 1;


    return (
        < AppScreen>
            <View style={{ flex: 1, justifyContent: 'center', }}>
                <View>
                    <View style={{ justifyContent: "flex-end", flexDirection: 'row', paddingRight: 20, paddingTop: 20 }}>
                        {/* <TouchableOpacity onPress={() => navigation.navigate('Registraion')}> */}
                        <TouchableOpacity

                            onPress={() => dispatch(checkOnboarding())}
                        >
                            <Text style={{ fontWeight: '500', fontSize: 16 }}>
                                {showDoneButton ? 'Get Started' : "Skip"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    data={mainSlide}
                    renderItem={({ item }) => <Item itemdata={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        x: scrollX,
                                    },
                                },
                            },
                        ],
                        { useNativeDriver: false }
                    )}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewConfig.current} // Use the ref here
                    ref={slideref}
                />
                <Pagination data={mainSlide} scrollX={scrollX} />
            </View>

        </AppScreen >


    );
};

export default Onboarding;

const styles = StyleSheet.create({
    Image: {
        flex: 0.7,
        justifyContent: 'center',
    },
    title: {
        fontWeight: '500',
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        paddingHorizontal: 14
    },
    des: {
        fontWeight: '500',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 14,
        opacity: 0.4
    },


});

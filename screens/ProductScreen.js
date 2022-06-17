import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import tw from "tailwind-rn";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./Styles";
//import { FlatList } from 'react-native-gesture-handler'
import { Image } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Comments from "./Comments";
import { SharedElement } from "react-navigation-shared-element";

const ProductScreen = ({ route, navigation }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const PAGE_DIM = Dimensions.get("window");
  const ProdImages = route.params.images;
  const Backdrop = ({ scrollX }) => {
    return (
      <View style={tw("flex flex-row items-center")}>
        {ProdImages.map((_, i) => {
          const inputRange = [
            (i - 1) * PAGE_DIM.width,
            i * PAGE_DIM.width,
            (i + 1) * PAGE_DIM.width,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={`bd.${i}.element`}
              style={[
                tw("flex bg-blue-200 border-white h-2 rounded-full mx-1"),
                { width: scale },
              ]}
            ></Animated.View>
          );
        })}
      </View>
    );
  };
  return (
    <SafeAreaView>
      <StatusBar animated barStyle="dark-content" backgroundColor="white" />
      <View style={tw("flex flex-col w-full bg-gray-50 h-full")}>
        <View style={tw("flex flex-col items-center")}>
          <View style={[tw(""), { width: PAGE_DIM.width, overflow: "hidden" }]}>
            <Animated.FlatList
              horizontal
              data={ProdImages}
              keyExtractor={(_, index) => index.toString()}
              snapToInterval={PAGE_DIM.width}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              bounces={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              renderItem={({ item }) => {
                return (
                  <SharedElement id={`item.${item}.img`}>
                    <Image
                      source={{ uri: item }}
                      style={{
                        height: 0.62 * PAGE_DIM.height,
                        width: PAGE_DIM.width,
                        resizeMode: "cover",
                      }}
                    />
                  </SharedElement>
                );
              }}
            />
          </View>
        </View>
        <View
          style={[
            tw("flex flex-row justify-between mx-4 items-center h-8"),
            { marginTop: -32 - 96 },
          ]}
        >
          <View
            style={tw(
              "flex flex-col bg-blue-300 px-2 justify-center h-7 w-16 rounded-2xl"
            )}
          >
            <Text
              style={[
                styles.fontStyle,
                tw("text-blue-800 text-center text-lg"),
              ]}
            >
              30%
            </Text>
          </View>
          <Backdrop scrollX={scrollX} />
          <TouchableOpacity
            style={tw(
              "flex bg-red-600 flex-col items-center px-1 pt-2.5 h-10 w-10 rounded-full"
            )}
          >
            <Icon name="heart" type="antdesign" color="white" size={20} />
          </TouchableOpacity>
        </View>
        <BottomSheet
          snapPoints={[PAGE_DIM.height / 2.3, PAGE_DIM.height]}
          backgroundStyle={tw("rounded-3xl bg-gray-100")}
        >
          <BottomSheetScrollView style={tw("flex flex-col mx-8 mt-3")}>
            <View style={tw("flex flex-row items-center justify-between")}>
              <Text style={[tw("text-3xl text-indigo-900"), styles.fontStyle]}>
                Cloth Mask 11''
              </Text>
              <View style={tw("flex flex-row")}>
                <Icon name="star" type="antdesign" color="#F4E185" size={21} />
                <Text
                  style={[
                    tw("ml-2 text-base text-gray-400"),
                    styles.fontStylelite,
                  ]}
                >
                  (4.5)
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={[tw("text-lg text-indigo-900"), styles.fontStylelite]}
              >
                Built to save from dust, particles etc
              </Text>
            </View>
            <View>
              <Text
                style={[
                  tw("mt-6 text-base text-indigo-900"),
                  styles.fontStyleXlite,
                  { textAlign: "justify" },
                ]}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.
              </Text>
            </View>
            <Comments />
          </BottomSheetScrollView>
        </BottomSheet>
        <View
          style={[
            tw(
              "bg-white absolute bottom-0 flex flex-row justify-between px-6 py-4 w-full rounded-t-3xl"
            ),
            styles.shadow2,
          ]}
        >
          <View style={tw("flex flex-row items-center")}>
            <View style={tw("flex flex-row items-start")}>
              <Text
                style={[tw("text-base text-indigo-900"), styles.fontStylelite]}
              >
                ₹
              </Text>
              <Text style={[tw("text-3xl text-indigo-900"), styles.fontStyle]}>
                150.00
              </Text>
            </View>
          </View>
          <TouchableOpacity style={tw("bg-gray-100 p-3 rounded-2xl")}>
            <Text style={[tw("text-base text-indigo-900"), styles.fontStyle]}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
ProductScreen.sharedElements = (route, otherNavigation, showing) => {
  const items = route.params.images;
  return [
    {
      id: `item.${items[0]}.img`,
      animation: "fade",
      //resize: 'clip',
    },
  ];
};
export default ProductScreen;

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { styles } from "./Styles";
import tw from "tailwind-rn";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/core";
import { SharedElement } from "react-navigation-shared-element";
import * as Animatable from "react-native-animatable";

const ProductCard = ({ data, i }) => {
  const navigation = useNavigation();
  const PAGE_DIM = Dimensions.get("window");
  const Width = 0.43 * PAGE_DIM.width;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Animatable.View
      animation="zoomInDown"
      delay={i * 100}
      style={[
        tw(
          "flex flex-col justify-between bg-white rounded-xl mx-1 my-2 relative overflow-hidden"
        ),
        styles.shadow,
        { width: Width, height: 1.4 * Width },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.push("ProductScreen", { data: data.id })}
      >
        {/* <Text style={[styles.fontStyle,tw('ml-4 text-2xl')]}>
                    All Products
                </Text> */}
        <View
          style={tw("flex flex-row justify-between p-3 absolute z-50 w-full")}
        >
          <View
            style={tw(
              "flex flex-row items-center bg-blue-500 px-2 justify-center h-5 rounded-2xl"
            )}
          >
            <Icon name="place" type="material" color="red" size={15} />
            <Text style={[styles.fontStyle, tw("text-white text-xs")]}>
              {data?.loc?.length > 7 ? data?.loc.slice(0, 8) + ".." : data?.loc}
            </Text>
          </View>
          <TouchableOpacity
            style={tw(
              "flex bg-red-600 flex-col items-center p-1 h-6 w-6 rounded-full"
            )}
          >
            <Icon name="heart" type="antdesign" color="white" size={15} />
          </TouchableOpacity>
        </View>
        <View style={tw("flex items-center ")}>
          <SharedElement id={`item.${data.img}.img`}>
            <Image style={tw("w-48 h-36 ")} source={{ uri: data.img }} />
          </SharedElement>
        </View>
        <View style={tw("flex flex-col justify-center")}>
          <View style={tw("flex flex-row justify-center ")}>
            <Text style={[styles.fontStylelite, tw("text-lg text-blue-800")]}>
              {data.title}
            </Text>
          </View>
          <View style={tw("flex flex-row justify-center -mt-2")}>
            <Text style={[styles.fontStyle, tw("text-base text-blue-800")]}>
              ₹
            </Text>
            <Text style={[styles.fontStyle, tw("text-2xl text-blue-800")]}>
              {data.cost}
            </Text>
          </View>
        </View>
        <View style={tw("flex flex-row justify-center")}>
          <Icon name="star" type="antdesign" color="#F4E185" size={15} />
          <Icon name="star" type="antdesign" color="#F4E185" size={15} />
          <Icon name="star" type="antdesign" color="#F4E185" size={15} />
          <Icon name="star" type="antdesign" color="#F4E185" size={15} />
          <Text
            style={[styles.fontStylelite, tw("ml-2 text-xs text-gray-400")]}
          >
            (4.5)
          </Text>
        </View>
        <View></View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default ProductCard;

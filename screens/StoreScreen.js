import { View, Text, StatusBar, Image, ScrollView } from "react-native";
import React from "react";
import tw from "tailwind-rn";
import { styles } from "./Styles";
import { SharedElement } from "react-native-shared-element";
import { ProdData } from "./Data";
import ProductCard from "./ProductCard";
import { Icon } from "react-native-elements";
const StoreScreen = ({ route }) => {
  const data = route.params.data;
  const i = route.params.index;
  return (
    <View>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <View style={[tw("flex flex-row items-center mt-8")]}>
        <View style={[tw(" px-4 py-4 w-3/4")]}>
          <Text style={[tw("text-3xl"), styles.fontStyle]}>{data.title}</Text>
          <Text style={[tw("text-4xl"), styles.fontStyle]}>
            {data.subtitle}
          </Text>
          <View style={tw("flex flex-row bg-blue-300 px-1 w-12 rounded-full")}>
            <Text style={[tw("mr-1 text-white"), styles.fontStyle]}>4.8</Text>
            <Icon name="star" type="antdesign" color="yellow" size={14} />
          </View>
        </View>
        <SharedElement style={[tw(" w-1/4 -mx-4 mt-4")]} id={`item.${i}.store`}>
          <Image
            style={[tw("w-full h-32"), { resizeMode: "cover" }]}
            source={data.logo}
          />
        </SharedElement>
      </View>
      <ScrollView>
        <View
          style={[tw("px-4 py-4 w-full flex flex-row"), { flexWrap: "wrap" }]}
        >
          {ProdData.map((item, index) => {
            // <ProductCard data={item} i={index}/>
            return (
              <ProductCard
                data={item}
                i={index}
                key={`pdcard.${index}.cd.${data.title}`}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default StoreScreen;

import { View, Text, StatusBar, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-rn";
import { styles } from "./Styles";
import { SharedElement } from "react-native-shared-element";
import { ProdData } from "./Data";
import ProductCard from "./ProductCard";
import { Icon } from "react-native-elements";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
const StoreScreen = ({ route }) => {
  const data = route.params.data;
  const i = route.params.index;
  const [products, setProducts] = useState();
  useEffect(() => {
    //getDocs(query(collection(db, "Products"),where("user","in",["ckYRZEWlaqrlCIWNYAD2"]))).then((dc) =>
    getDocs(
      query(
        collection(db, "Products"),
        where("user", "in", ["ckYRZEWlaqrlCIWNYAD2"])
      )
    ).then((dc) =>
      setProducts(
        dc.docs.map((dic) => ({
          id: dic.id,
          img: dic.data().images
            ? dic.data().images[0]
            : "https://thumbs.dreamstime.com/b/no-entry-entrance-sign-prohibition-restriction-road-signal-stock-vector-illustration-clip-art-graphics-235013463.jpg",
          title: dic.data().name,
          cost: dic.data().price,
          loc: dic.data().loc,
        }))
      )
    );
  }, []);
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
          {products?.map((item, index) => {
            // <ProductCard data={item} i={index}/>
            return (
              <ProductCard data={item} i={index} key={`pdcard.${index}.cd`} />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default StoreScreen;

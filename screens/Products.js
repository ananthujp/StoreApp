import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { styles } from "./Styles";
import tw from "tailwind-rn";
import { ProdData } from "./Data";
import { Icon } from "react-native-elements";
import ProductCard from "./ProductCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Products = () => {
  const PAGE_DIM = Dimensions.get("window");
  const [icon, setIcon] = useState("down");
  const [products, setProducts] = useState();
  const handledown = () => {
    icon == "right" ? setIcon("down") : setIcon("right");
  };
  useEffect(() => {
    getDocs(collection(db, "Products")).then((dc) =>
      setProducts(
        dc.docs.map((dic) => ({
          id: dic.id,
          img: dic.data().images
            ? dic.data().images[0]
            : "https://thumbs.dreamstime.com/b/no-entry-entrance-sign-prohibition-restriction-road-signal-stock-vector-illustration-clip-art-graphics-235013463.jpg",
          title: dic.data().name,
          cost: dic.data().price,
          loc: dic.data().loc,
          rating: dic.data().rating ? dic.data().rating : 0,
        }))
      )
    );
    return () => setProducts(null);
  }, []);
  return (
    <View className="flex flex-col w-full bg-gray-50 rounded-b-2xl">
      <TouchableOpacity
        className="flex flex-row px-6 w-full justify-between"
        onPress={() => handledown()}
      >
        <Text style={[styles.fontStyle, tw("ml-4 text-2xl")]}>
          All Products
        </Text>
        <View>
          <Icon name={icon} type="antdesign" color="gray" />
        </View>
      </TouchableOpacity>
      {icon == "down" ? (
        <View className="px-4 py-4 w-full flex flex-row flex-wrap">
          {products?.map((item, index) => {
            return (
              <ProductCard data={item} i={index} key={`pdcard.${index}.cd`} />
            );
          })}
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default Products;

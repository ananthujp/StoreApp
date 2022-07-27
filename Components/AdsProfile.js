import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Icon } from "react-native-elements";
import tw from "tailwind-rn";
import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/userAuth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ListItemAds from "./ListItemAds";
const AdsProfile = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const PAGE_DIM = Dimensions.get("window");
  const [products, setProducts] = useState();
  useEffect(() => {
    user &&
      onSnapshot(
        query(collection(db, "Products"), where("user", "==", user?.id)),
        (dc) =>
          setProducts(
            dc.docs.map((dic) => ({
              id: dic.id,
              name: dic.data().name,
              img: dic.data().images
                ? dic.data().images[0]
                : "https://thumbs.dreamstime.com/b/no-entry-entrance-sign-prohibition-restriction-road-signal-stock-vector-illustration-clip-art-graphics-235013463.jpg",
              price: dic.data().price,
              loc: dic.data().loc,
            }))
          )
      );
  }, [user]);
  return (
    <View
      style={tw("flex flex-col px-2 mt-2 rounded-md items-center")}
      height={PAGE_DIM.height - 350}
      width={PAGE_DIM.width}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("NewProduct", {
            userid: user.id,
          });
        }}
        style={tw(
          "flex flex-row items-center my-3 bg-indigo-500 flex items-center px-4 py-1 rounded-md "
        )}
      >
        <Icon
          name="plus"
          type="antdesign"
          color={"white"}
          style={tw(" text-gray-400 mr-2")}
          size={20}
        />
        <Text style={tw("ml-2 mr-2 text-white text-center")}>
          Post a new ad
        </Text>
      </TouchableOpacity>
      <ScrollView style={tw("w-full")}>
        {products?.map((dc, i) => (
          <ListItemAds
            id={dc.id}
            item={dc.name}
            key={`profile.ad.${i}`}
            logo={dc.img}
            index={i}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default AdsProfile;

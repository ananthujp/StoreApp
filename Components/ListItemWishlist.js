import React, { useEffect, useState } from "react";
import tw from "tailwind-rn";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { styles } from "../screens/Styles";
import { Image } from "react-native";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/userAuth";
const ListItemWishlist = ({ item, index, category, listID }) => {
  const { user } = useAuth();
  const PAGE_DIM = Dimensions.get("window");
  const [product, setProduct] = useState();
  const navigation = useNavigation();
  const handleDelete = (id) => {
    deleteDoc(doc(db, "Profiles", user.id, "Wishlist", id));
  };
  useEffect(() => {
    getDoc(doc(db, "Products", item)).then((dl) =>
      setProduct({
        name: dl.data().name,
        img: dl.data().images
          ? dl.data().images[0]
          : "https://thumbs.dreamstime.com/b/no-entry-entrance-sign-prohibition-restriction-road-signal-stock-vector-illustration-clip-art-graphics-235013463.jpg",
      })
    );
  }, []);
  //   const rheightstyle = useAnimatedStyle(() => {
  //     return {
  //       height: rheight.value,
  //     };
  //   });
  return (
    <TouchableOpacity
      onPress={() => navigation.push("ProductScreen", { data: item })}
      style={[
        tw(
          " rounded-xl my-1 py-2 px-4 flex flex-col border-b border-purple-400" +
            (index === 0 ? " border-t border-b" : " border-b")
        ),
      ]}
    >
      <View style={tw("flex flex-row justify-between ")}>
        <View style={tw("flex flex-row items-start")}>
          <Image
            style={tw("w-16 h-16 rounded-lg")}
            source={{ uri: product?.img }}
          />
          <View style={tw("flex flex-col items-start ml-2")}>
            <Text
              style={[
                styles.fontStyle,
                tw(" text-center text-gray-200 text-lg"),
              ]}
            >
              {product?.name}
            </Text>
            {category?.map((dc, i) => (
              <Text
                key={`category.${i}.${item}`}
                style={[
                  styles.fontStyleXlite,
                  tw(
                    " text-center text-xs text-purple-600 bg-purple-300 px-2 py-0.5 rounded-full"
                  ),
                ]}
              >
                {dc}
              </Text>
            ))}
          </View>
        </View>
        <View style={tw("flex flex-col items-center justify-around mx-2")}>
          <TouchableOpacity
            onPress={() => handleDelete(listID)}
            style={tw("rounded-full w-9 h-9 flex items-start justify-start")}
          >
            <Icon name={"delete"} type="antdesign" color={"white"} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItemWishlist;

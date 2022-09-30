import React from "react";
import tw from "tailwind-rn";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ref, deleteObject, listAll } from "firebase/storage";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { styles } from "../screens/Styles";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase";
const ListItemAds = ({ item, logo, category, index, id }) => {
  const PAGE_DIM = Dimensions.get("window");
  const [exp, setExp] = React.useState(false);
  const deleteItem = () => {
    deleteDoc(doc(db, "Products", id)).then(() =>
      listAll(ref(storage, `products/${id}/`)).then((res) => {
        res.items.forEach((itemRef) => {
          deleteObject(itemRef);
        });
      })
    );
  };
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.push("ProductScreen", { data: id })}
      style={[
        tw(
          " rounded-xl my-1 py-2 px-4 w-full flex flex-col  border-purple-400" +
            (index === 0 ? " border-t " : " ")
        ),
      ]}
    >
      <View style={tw("flex flex-row justify-between ")}>
        <View style={tw("flex flex-row items-start")}>
          <Image style={tw("w-16 h-16 rounded-lg")} source={{ uri: logo }} />
          <View style={tw("flex flex-col items-start ml-2")}>
            <Text
              style={[
                styles.fontStyle,
                tw(" text-center text-gray-200 text-lg"),
              ]}
            >
              {item}
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
            onPress={deleteItem}
            style={tw(
              "rounded-full w-8 h-8 opacity-75 flex items-center justify-center"
            )}
          >
            <Icon name={"delete"} type="antdesign" color={"white"} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItemAds;

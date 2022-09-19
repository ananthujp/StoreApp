import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import React, { useCallback, useState } from "react";
import tw from "tailwind-rn";
import { Icon } from "react-native-elements";
import { styles } from "./Styles";
// import { StoreData } from "./Data";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import { SharedElement } from "react-native-shared-element";
import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Stores = () => {
  const PAGE_DIM = Dimensions.get("window");
  const navigation = useNavigation();
  const [StoreData, setStores] = useState();
  useEffect(() => {
    getDocs(collection(db, "Stores")).then((dc) =>
      setStores(
        dc.docs.map((dic, i) => ({
          id: i,
          ids: dic.id,
          title: dic.data().title,
          logo: dic.data().logo,
          subtitle: dic.data().subtitle,
          storeID: dic.data().storeID,
          rating: dic.data().rating ? dic.data().rating : 0,
        }))
      )
    );
  }, []);
  const StoreCard = ({ data, i }) => {
    return (
      <TouchableOpacity
        key={`stores.card${i}`}
        onPress={() =>
          navigation.navigate("StoreScreen", { data: data, index: i })
        }
        style={[
          tw("bg-gray-200 w-56 h-32 mx-2 rounded-xl overflow-hidden"),
          styles.shadow,
        ]}
      >
        <SharedElement style={[tw("absolute bottom-0")]} id={`item.${i}.store`}>
          <Image
            style={[tw(" h-32 w-28"), { resizeMode: "cover" }]}
            source={{ uri: data.logo }}
          />
        </SharedElement>
        <View className="absolute flex justify-between items-end h-full right-0 py-2 mr-2">
          <View className="flex flex-row bg-blue-300 px-1 rounded-full">
            <Text style={[tw("mr-1 text-white"), styles.fontStyle]}>
              {data.rating.toFixed(1)}
            </Text>
            <Icon name="star" type="antdesign" color="yellow" size={14} />
          </View>
          <View>
            <Text style={[tw("text-black text-lg"), styles.fontStyle]}>
              {data.title}
            </Text>
            <Text
              style={[tw("text-black text-xs -mt-1"), styles.fontStylelite]}
            >
              {data.subtitle}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderItem = useCallback(
    ({ item, index }) => (
      <StoreCard key={`store.card${index}.main`} data={item} i={index} />
    ),
    []
  );

  return (
    <View className="flex flex-col w-full bg-gray-50">
      <TouchableOpacity className="flex flex-row px-6 w-full justify-between">
        <Text style={[styles.fontStyle, tw("ml-4 text-2xl")]}>All Stores</Text>
        <View>
          <Icon name="down" type="antdesign" color="gray" />
        </View>
      </TouchableOpacity>
      <View style={[tw("flex px-4 py-4 ")]}>
        {StoreData && (
          <FlatList
            horizontal
            data={StoreData}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </View>
  );
};

export default Stores;

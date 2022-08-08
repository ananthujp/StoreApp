import { Text, View, TouchableOpacity, Animated } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Image } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import tw from "tailwind-rn";
import { useNavigation } from "@react-navigation/core";
import { SharedElement } from "react-navigation-shared-element";
//import { Images } from "./Data";
import { styles } from "./Styles";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Actions from "./Actions";
const Stories = () => {
  const [Images, setImages] = useState();
  useEffect(() => {
    getDocs(collection(db, "Stories")).then((dc) =>
      setImages(
        dc.docs.map((dic, i) => ({
          dt: dic.data().dt,
          title: dic.data().title,
          id: i,
          img: dic.data().img,
          txt: dic.data().txt,
        }))
      )
    );
    return () => {
      setImages(null);
    };
  }, []);
  const navigation = useNavigation();
  const renderItem = ({ item, i }) => <Item item={item} />;
  const Item = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("StoryScreen", { item: item.id, items: Images })
      }
      style={tw("mx-2 rounded-full")}
    >
      <View>
        <SharedElement id={`item.${item.id}.img`}>
          <View
            style={tw(
              "rounded-full w-20 h-20 overflow-hidden border-white border-2"
            )}
          >
            <Image
              style={[tw("w-full h-full"), { resizeMode: "cover" }]}
              source={{
                uri: item.img,
              }}
            />
          </View>
        </SharedElement>
      </View>
      <Text style={tw("text-center mt-1")}>{item.txt}</Text>
    </TouchableOpacity>
  );
  return (
    <Animated.View style={tw("w-full px-4 pt-1 pb-6 z-20 bg-gray-50")}>
      <Text style={[styles.fontStyle, tw("ml-4 text-2xl my-3")]}>Popular</Text>
      {Images && (
        <View style={tw("flex flex-row")}>
          <Actions />
          <FlatList
            horizontal
            data={Images}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </Animated.View>
  );
};

export default Stories;

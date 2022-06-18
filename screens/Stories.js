import { Text, View, TouchableOpacity, Animated } from "react-native";
import React from "react";
import { Avatar, Image } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import tw from "tailwind-rn";
import { useNavigation } from "@react-navigation/core";
import { SharedElement } from "react-navigation-shared-element";
import { Images } from "./Data";
import { styles } from "./Styles";
const Stories = () => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => <Item item={Images[item]} />;
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
      <Text style={tw("text-center mt-1")}>{`Ad ${item.id}`}</Text>
    </TouchableOpacity>
  );
  return (
    <Animated.View style={tw("w-full px-4 pt-1 pb-6 z-20 bg-gray-50")}>
      <Text style={[styles.fontStyle, tw("ml-4 text-2xl my-3")]}>Popular</Text>
      <FlatList
        horizontal
        data={Object.keys(Images)}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => Images[item].id}
      />
    </Animated.View>
  );
};

export default Stories;

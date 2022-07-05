import React from "react";
import tw from "tailwind-rn";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { Icon } from "react-native-elements/dist/icons/Icon";
import { styles } from "./Styles";
import { Image } from "react-native";
const ListItem = ({ item, icon }) => {
  const PAGE_DIM = Dimensions.get("window");
  const [exp, setExp] = React.useState(false);

  //   const rheightstyle = useAnimatedStyle(() => {
  //     return {
  //       height: rheight.value,
  //     };
  //   });
  return (
    <View
      style={[
        tw(
          " rounded-xl my-1 py-2 px-4 flex flex-col border-b border-purple-400"
        ),
      ]}
    >
      <View style={tw("flex flex-row justify-between ")}>
        <View style={tw("flex flex-row items-start")}>
          <Image style={tw("w-16 h-16 rounded-lg")} source={{ uri: icon }} />
          <View style={tw("flex flex-col items-start ml-2")}>
            <Text
              style={[
                styles.fontStyle,
                tw(" text-center text-gray-200 text-lg"),
              ]}
            >
              {item}
            </Text>
          </View>
        </View>
        <View style={tw("flex flex-col items-center justify-around mx-2")}>
          <TouchableOpacity style={tw("bg-white rounded-full opacity-75")}>
            <Icon name={"plus"} type="antdesign" color={"gray"} size={32} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ListItem;

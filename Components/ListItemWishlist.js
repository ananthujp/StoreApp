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
import { styles } from "../screens/Styles";
import { Image } from "react-native";
const ListItemWishlist = ({ item, moreInfo, logo, category }) => {
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
          <Image style={tw("w-24 h-24 rounded-lg")} source={{ uri: logo }} />
          <View style={tw("flex flex-col items-start ml-2")}>
            <Text
              style={[
                styles.fontStyle,
                tw(" text-center text-gray-200 text-lg"),
              ]}
            >
              {item}
            </Text>
            {category.map((dc, i) => (
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
            style={tw("rounded-full w-9 h-9 flex items-start justify-start")}
          >
            <Icon name={"delete"} type="antdesign" color={"white"} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ListItemWishlist;

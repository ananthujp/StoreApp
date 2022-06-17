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
const ListItem = ({ item, moreInfo, logo, category }) => {
  const PAGE_DIM = Dimensions.get("window");
  const [exp, setExp] = React.useState(false);

  //   const rheightstyle = useAnimatedStyle(() => {
  //     return {
  //       height: rheight.value,
  //     };
  //   });
  return (
    <TouchableOpacity activeOpactity={1} onPress={() => setExp(!exp)}>
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
                  tw(" text-center text-white text-lg"),
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

              {exp && (
                <View style={tw("flex flex-row items-start mt-2")}>
                  {moreInfo.map((dc, i) => (
                    <TouchableOpacity
                      key={`info.${item}.icon.${i}`}
                      onPress={() => dc.function(item)}
                    >
                      <Icon
                        name={dc.icon}
                        type="antdesign"
                        color={"gray"}
                        size={24}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
          <View style={tw("flex w-8 h-8 bg-black")}></View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;

import { View, Text } from "react-native";
import { styles } from "./Styles";
import React from "react";
import tw from "tailwind-rn";
import { Icon } from "react-native-elements/dist/icons/Icon";
const Counter = ({ icon, text, count }) => {
  return (
    <View
      style={tw(
        "flex flex-row items-center overflow-hidden py-2 px-2 justify-start"
        //+(selection && " bg-white")
      )}
    >
      <Icon name={icon} type="font-awesome-5" color={"#8D3AED"} size={28} />

      <Text
        style={[styles.fontStylelite, { color: "#8D3AED" }, tw("text-xs mx-2")]}
      >
        {text}
      </Text>
      <Text style={[styles.fontStyle, { color: "#8D3AED" }, tw("text-sm")]}>
        {count}
      </Text>
    </View>
  );
};

export default Counter;

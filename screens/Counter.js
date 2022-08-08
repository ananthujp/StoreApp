import { View, Text } from "react-native";
import { styles } from "./Styles";
import React from "react";
import tw from "tailwind-rn";
import { Icon } from "react-native-elements/dist/icons/Icon";
const Counter = ({ icon, text }) => {
  return (
    <View
      style={tw(
        "flex flex-row items-center overflow-hidden py-2 px-2 justify-start"
        //+(selection && " bg-white")
      )}
    >
      <Icon name={icon} type="font-awesome-5" color={"#4338ca"} size={28} />

      <Text
        style={[styles.fontStylelite, { color: "#4338ca" }, tw("text-xs mx-2")]}
      >
        {text}
      </Text>
      {/* <Text style={[styles.fontStyle, { color: "#4338ca" }, tw("text-sm")]}>
        {count}
      </Text> */}
    </View>
  );
};

export default Counter;

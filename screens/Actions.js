import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import tw from "tailwind-rn";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/userAuth";
const Actions = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("NewProduct", {
            userid: user.id,
          });
        }}
        className="flex flex-col w-20 h-20 items-center bg-gray-300 p-4 rounded-full"
      >
        <Icon
          name="plus"
          type="antdesign"
          color={"gray"}
          style={tw(" text-gray-400 mr-2")}
          size={20}
        />
        <Text>Sell</Text>
      </TouchableOpacity>
      <Text>Used product</Text>
    </View>
  );
};

export default Actions;

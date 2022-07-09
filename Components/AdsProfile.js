import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { Icon } from "react-native-elements";
import tw from "tailwind-rn";
import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/userAuth";
const AdsProfile = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const PAGE_DIM = Dimensions.get("window");
  return (
    <View
      style={tw("flex flex-col px-2 mt-2 rounded-md items-center")}
      height={PAGE_DIM.height - 350}
      width={PAGE_DIM.width}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("NewProduct", {
            userid: user.id,
          });
        }}
        style={tw(
          "flex flex-row items-center my-3 bg-indigo-500 flex items-center px-4 py-1 rounded-md "
        )}
      >
        <Icon
          name="plus"
          type="antdesign"
          color={"white"}
          style={tw(" text-gray-400 mr-2")}
          size={20}
        />
        <Text style={tw("ml-2 mr-2 text-white text-center")}>New Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdsProfile;

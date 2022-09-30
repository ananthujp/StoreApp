import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import tw from "tailwind-rn";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/userAuth";
const Actions = ({ ad }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  return (
    <View>
      <TouchableOpacity
        onPress={
          ad
            ? () => {
                navigation.navigate("NewAd", {
                  userid: user.store,
                });
              }
            : () => {
                navigation.navigate("NewProduct", {
                  userid: user.id,
                });
              }
        }
        className={
          "flex  p-5  items-center  mx-2 my-auto rounded-full " +
          (ad ? "bg-orange-200" : "bg-indigo-200")
        }
      >
        <Icon
          name="plus"
          type="antdesign"
          color={"gray"}
          className=" text-gray-400 mx-auto "
          size={35}
        />
      </TouchableOpacity>
      <Text className="mx-auto">{ad ? "New Ad" : "New item"}</Text>
    </View>
  );
};

export default Actions;

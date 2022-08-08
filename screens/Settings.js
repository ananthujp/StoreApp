import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import useAuth from "../hooks/userAuth";
import tw from "tailwind-rn";
import { useNavigation } from "@react-navigation/core";
import { Avatar, Icon } from "react-native-elements";
import { styles } from "./Styles";
import storage from "../storage";
const Settings = () => {
  const navigation = useNavigation();
  const { setStatusBar } = useAuth();
  const { user, setUser } = useAuth();
  useEffect(() => {
    setStatusBar({
      color: "#f3f4f6",
      content: "dark-content",
    });
    return () =>
      setStatusBar({
        color: "#4338ca",
        content: "light-content",
      });
  }, []);
  return (
    <View style={tw("flex flex-col")}>
      <View style={tw("flex flex-row justify-between items-center mx-4 my-4")}>
        <Icon
          name="back"
          type="antdesign"
          color="black"
          onPress={() => {
            navigation.navigate("Home");
            // setUser(null);
            // storage.remove({
            //   key: "userState",
            // });
          }}
        />
        <Text style={[styles.fontStyle, tw("text-xl")]}>Settings</Text>
        <TouchableOpacity
          onPress={() => {
            setUser(null);
            storage.remove({
              key: "userState",
            });
          }}
        >
          <Text style={[styles.fontStyle, tw("text-sm text-blue-400")]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      <View style={tw("w-full flex items-center justify-center mt-12")}>
        <Avatar
          rounded
          size={120}
          source={{
            uri: user
              ? user.dp
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
          }}
        />
        <Text style={[styles.fontStyle, tw(" text-lg text-gray-800 mt-2")]}>
          {user?.name}
        </Text>
      </View>
      <Text style={[tw(" text-xs text-gray-400 mt-8 ml-4")]}>ACCOUNT</Text>
      <View
        style={tw("px-2 flex justify-center mt-2 bg-gray-50 mx-2 rounded-xl")}
      >
        <View
          style={tw(
            "flex flex-row items-center justify-start mt-2 ml-2 border-b  py-4 border-gray-200"
          )}
        >
          <Icon name="person" type="material" color="blue" />
          <Text style={[tw(" text-base text-gray-800 ml-4")]}>
            Edit Profile
          </Text>
        </View>
        <View
          style={tw(
            "flex flex-row items-center justify-start mt-2 ml-2 border-b  py-4 border-gray-200"
          )}
        >
          <Icon name="place" type="material" color="green" />
          <Text style={[tw(" text-base text-gray-800 ml-4")]}>Location</Text>
        </View>

        <View
          style={tw(
            "flex flex-row items-center justify-start mt-2 ml-2 border-b  py-4 border-gray-200"
          )}
        >
          <Icon name="notifications" type="material" color="#fbbf24" />
          <Text style={[tw(" text-base text-gray-800 ml-4")]}>
            Notification
          </Text>
        </View>
        <View
          style={tw(
            "flex flex-row items-center justify-start mt-2 ml-2  py-4 "
          )}
        >
          <Icon name="lock" type="material" color="#ec4899" />
          <Text style={[tw(" text-base text-gray-800 ml-4")]}>Privacy</Text>
        </View>
      </View>
    </View>
  );
};

export default Settings;

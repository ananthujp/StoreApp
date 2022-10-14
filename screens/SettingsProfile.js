import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import { Avatar, Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import tw from "tailwind-rn";
import * as Progress from "react-native-progress";
import useAuth from "../hooks/userAuth";
import { styles } from "./Styles";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
const SettingsProfile = () => {
  const navigation = useNavigation();
  const { user, setStatusBar } = useAuth();
  const [usernameState, setUserstate] = useState(0);
  const [username, setUsername] = useState(user.username);
  const [showPass, setshowPass] = useState(false);
  const [password, setPass] = useState(user.pass);
  const [loading, setloading] = useState(false);
  const isFocused = useIsFocused();
  const checkUser = (value) => {
    setUserstate(0);
    getDocs(
      query(collection(db, "Profiles"), where("username", "==", value))
    ).then((doc) =>
      doc.docs.map((dc) => value !== user.username && setUserstate(1))
    );
    setUsername(value);
  };
  const updateUser = () => {
    usernameState !== 1 &&
      updateDoc(
        doc(db, "Profiles", user.id),
        { username: username, pass: password },
        { merge: true }
      ).then(() => navigation.goBack());
  };
  useEffect(() => {
    isFocused &&
      setStatusBar({
        color: "#4338ca",
        content: "light-content",
      });
    return () =>
      setStatusBar({
        color: "#f3f4f6",
        content: "dark-content",
      });
  }, [isFocused]);
  return (
    <View className="h-full flex items-center">
      <View className="flex flex-row items-center justify-around w-full h-1/5 bg-indigo-700">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" type="antdesign" color="white" size={28} />
        </TouchableOpacity>
        <View style={tailwind("flex flex-row items-center justify-center")}>
          <Icon name="user" type="antdesign" color="white" size={40} />
          <View className="flex flex-col">
            <Text className="text-white text-xl">PROFILE</Text>
            <Text className="text-white text-xs">Edit your profile</Text>
          </View>
          <View className="mr-2">
            <Icon name="back" type="antdesign" color="#4338ca" size={32} />
          </View>
        </View>
        <View>
          <Icon name="back" type="antdesign" color="#4338ca" size={32} />
        </View>
      </View>

      <View className="w-full">
        <View className="w-full flex items-center justify-center mt-12">
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
        <View className="w-full">
          <Text
            className={
              "mt-6 mx-auto " +
              (usernameState === 1 ? " text-red-600" : " text-green-600")
            }
          >
            {usernameState === 1 && "Username has been already taken"}
          </Text>
        </View>
        <View className="my-4">
          <View className="flex mx-4 my-1 border py-2 border-gray-200 flex-row justify-start items-center">
            <Icon
              name="user"
              type="antdesign"
              color={usernameState === 1 ? "#dc2626" : "black"}
              style={tw(" text-gray-400 mr-2")}
              size={20}
            />
            <TextInput
              onChangeText={(value) => checkUser(value)}
              placeholder="Enter your username"
              keyboardType="default"
              value={username}
              //editable={status === 1 ? false : true}
              style={tw(usernameState === 1 ? " text-red-400" : " text-black")}
              className="w-full"
            />
          </View>
          <View className="flex mx-4 my-1 border py-2 border-gray-200 flex-row justify-start items-center">
            <View className="flex flex-row w-4/5">
              <Icon
                name="lock"
                type="antdesign"
                //color={usernameState === 1 ? "#dc2626" : "black"}
                style={tw(" text-gray-400 mr-2")}
                size={20}
              />
              <TextInput
                onChangeText={(value) => setPass(value)}
                //placeholder="Enter your username"
                keyboardType="default"
                value={password}
                secureTextEntry={showPass ? false : true}
                //editable={status === 1 ? false : true}
                //style={tw(usernameState === 1 ? " text-red-400" : " text-black")}
                className="w-4/5"
              />
            </View>
            <TouchableOpacity onPress={() => setshowPass(!showPass)}>
              <Icon
                name="eye"
                type="antdesign"
                //color={usernameState === 1 ? "#dc2626" : "black"}
                style={tw(" text-gray-400 mr-2")}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          disabled={usernameState === 1 ? true : false}
          onPress={() => updateUser()}
          className="flex flex-row items-center my-3 mx-auto bg-indigo-600 w-24  px-4 py-2 rounded-md "
        >
          <Text style={tw("ml-2 mr-2 text-white text-center")}>Update</Text>
          {loading && <Progress.CircleSnail size={20} color={["red"]} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsProfile;

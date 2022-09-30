import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/userAuth";
import tw from "tailwind-rn";
import { useNavigation } from "@react-navigation/core";
import { Avatar, Button, Icon, Slider } from "react-native-elements";
import { styles } from "./Styles";
import storage from "../storage";
import { TextInput } from "react-native";
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
  const [modalVisible, setModalVisible] = useState({
    vis: false,
    data: null,
    title: null,
  });
  return (
    <View className="flex flex-col w-full">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible.vis}
        onRequestClose={() => {
          setModalVisible({ ...modalVisible, vis: !modalVisible });
        }}
      >
        <View className="ml-[5%] amy-auto flex justify-between absolute top-1/4 w-[90%] bg-white border shadow-md border-gray-400 rounded-lg">
          <View className="flex flex-row items-center justify-between mt-2 mx-2">
            <View></View>
            <Text className="text-base font-semibold">
              {modalVisible.title}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible({ ...modalVisible, vis: false })}
            >
              <Icon name="close" type="material" color="black" size={16} />
            </TouchableOpacity>
          </View>
          <View>{modalVisible.data}</View>
          <TouchableOpacity
            className="w-full flex items-center bg-indigo-500 py-1 rounded-b-md"
            onPress={() => setModalVisible({ ...modalVisible, vis: false })}
          >
            <Text className="text-base font-semibold text-white">OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View className="flex flex-row justify-between items-center mx-4 my-4">
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
            navigation.navigate("Home");
          }}
        >
          <Text style={[styles.fontStyle, tw("text-sm text-blue-400")]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
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
      <Text style={[tw(" text-xs text-gray-400 mt-8 ml-4")]}>ACCOUNT</Text>
      <View className="px-2 flex justify-center mt-2 bg-gray-50 mx-2 rounded-xl">
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsProfile")}
          className="flex flex-row items-center justify-start mt-2 ml-2 border-b  py-4 border-gray-200"
        >
          <Icon name="person" type="material" color="blue" />
          <Text style={[tw(" text-base text-gray-800 ml-4")]}>
            Edit Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setModalVisible({
              data: (
                <View className="flex flex-row border border-gray-300 rounded-md p-2 my-2 mx-2">
                  <Icon name="place" type="material" color="black" size={16} />
                  <TextInput />
                </View>
              ),
              vis: true,
              title: "Location",
            })
          }
          className="flex flex-row items-center justify-start mt-2 ml-2 border-b  py-4 border-gray-200"
        >
          <Icon name="place" type="material" color="green" />
          <Text style={[tw(" text-base text-gray-800 ml-4")]}>Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setModalVisible({
              data: (
                <Slider
                  maxValue={1}
                  minValue={0}
                  step={2}
                  width="50%"
                  thumbStyle={{
                    backgroundColor: "#6366f1",
                    height: 16,
                    width: 32,
                  }}
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                />
              ),
              vis: true,
              title: "Notification",
            })
          }
          className="flex flex-row items-center justify-start mt-2 ml-2 border-b  py-4 border-gray-200"
        >
          <Icon name="notifications" type="material" color="#fbbf24" />
          <Text style={[tw(" text-base text-gray-800 ml-4")]}>
            Notification
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setModalVisible({
              data: (
                <Slider
                  maxValue={1}
                  minValue={0}
                  step={2}
                  width="50%"
                  thumbStyle={{
                    backgroundColor: "#6366f1",
                    height: 16,
                    width: 32,
                  }}
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                />
              ),
              vis: true,
              title: "Privacy",
            })
          }
          className="flex flex-row items-center justify-start mt-2 ml-2 border-b  py-4 border-gray-200"
        >
          <Icon name="lock" type="material" color="#ec4899" />
          <Text style={[tw(" text-base text-gray-800 ml-4")]}>Privacy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;

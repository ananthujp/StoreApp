import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  Vibration,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/userAuth";
import tw from "tailwind-rn";
import { useNavigation } from "@react-navigation/core";
import { Avatar, Button, Icon, Overlay, Slider } from "react-native-elements";
import { styles } from "./Styles";
import storage from "../storage";
import { TextInput } from "react-native";
import { FlatList } from "react-native";
import { ScrollView } from "react-native";
const Settings = () => {
  const navigation = useNavigation();

  const {
    user,
    setUser,
    defSettings,
    setStatusBar,
    setdefSettings,
    setPrompt,
  } = useAuth();

  const [settings, setSettings] = useState(defSettings);

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
  const handleOK = (state_case) => {
    // switch (state_case) {
    //   case "place":
    //     setdefSettings({ ...defSettings, location: loc });
    //   default:
    // }.
    setdefSettings(settings);
  };
  return (
    <KeyboardAvoidingView
      enabled={true}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={20}
      className="flex flex-col w-full h-full justify-between"
    >
      <Overlay
        onBackdropPress={() => setModalVisible({ ...modalVisible, vis: false })}
        windowBackgroundColor="rgba(255, 255, 255, 1)"
        className="ml-[1%] mb-1 flex justify-between bottom-0 sm:h-[60%] h-[40%] w-[98%] bg-white border shadow-md border-gray-400 rounded-3xl"
        overlayStyle={{
          marginTop: "auto",
          marginBottom: 4,
          borderRadius: 35,
          borderWidth: 1,

          borderColor: "gray",
          width: "98%",
        }}
        animationType="slide"
        transparent={true}
        isVisible={modalVisible.vis}
        onRequestClose={() => {
          setModalVisible({ ...modalVisible, vis: !modalVisible });
        }}
      >
        <View className="flex flex-row items-center justify-between mt-2 mx-2">
          <View></View>
          <View></View>
          <TouchableOpacity
            onPress={() => setModalVisible({ ...modalVisible, vis: false })}
          >
            <Icon name="close" type="material" color="black" size={24} />
          </TouchableOpacity>
        </View>
        <Icon
          name={modalVisible.icon}
          type="material"
          color={"#dc2626"}
          size={100}
        />
        <View className="flex flex-row items-center justify-between mx-2">
          <Text className="text-lg font-semibold mx-auto">
            {modalVisible.title}
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between mx-2">
          <Text className="text-sm font-light mx-auto">
            {modalVisible.subtitle}
          </Text>
        </View>
        <View className="my-2">{modalVisible.data}</View>
        <TouchableOpacity
          className="w-4/5 mb-6 mx-auto flex items-center bg-indigo-500 py-1 rounded-lg"
          onPress={() => {
            handleOK(modalVisible.icon);
            setModalVisible({ ...modalVisible, vis: false });
          }}
        >
          <Text className="text-base font-semibold text-white">OK</Text>
        </TouchableOpacity>
      </Overlay>
      <View className="flex flex-row justify-between items-center mx-4 my-4">
        <Icon
          name="arrowleft"
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
        {user ? (
          <TouchableOpacity
            onPress={() => {
              setPrompt({
                show: true,
                icon: "login",
                title: "Logout",
                subtitle: "Do you want to logout?",
                function: () => {
                  setUser(null);
                  storage.remove({
                    key: "userState",
                  });
                  navigation.navigate("Home");
                },
              });
              // Alert.alert("Logout", "Do you want to logout?", [
              //   {
              //     text: "Cancel",
              //     //onPress: () => console.log("Cancel Pressed"),
              //     style: "cancel",
              //   },
              //   {
              //     text: "OK",
              //     onPress: () => {
              //       setUser(null);
              //       storage.remove({
              //         key: "userState",
              //       });
              //       navigation.navigate("Home");
              //     },
              //   },
              // ]);
            }}
          >
            <Text style={[styles.fontStyle, tw("text-sm text-blue-400")]}>
              Logout
            </Text>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
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
      <ScrollView className="h-auto">
        <Text style={[tw(" text-xs text-gray-400 mt-8 ml-4")]}>ACCOUNT</Text>
        <View className="px-2 flex justify-center mt-2 bg-gray-50 mx-2 rounded-xl">
          {user && (
            <TouchableOpacity
              onPress={() => navigation.navigate("SettingsProfile")}
              className="flex flex-row items-center justify-start mt-2 ml-2 border-b  py-4 border-gray-200"
            >
              <Icon name="person" type="material" color="blue" />
              <Text style={[tw(" text-sm text-gray-800 ml-4")]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() =>
              setModalVisible({
                data: (
                  <View className="flex flex-row border border-gray-300 rounded-md p-2 my-2 mx-2">
                    <Icon
                      name="place"
                      type="material"
                      color="black"
                      size={16}
                    />
                    <TextInput
                      className="w-full"
                      defaultValue={settings.location}
                      onChangeText={(value) =>
                        setSettings({ ...settings, location: value })
                      }
                    />
                  </View>
                ),
                vis: true,
                title: "Location",
                icon: "place",
                subtitle: "Enter your location",
              })
            }
            className="flex flex-row items-center justify-start mt-2 ml-2 border-b  py-4 border-gray-200"
          >
            <Icon name="place" type="material" color="green" />
            <Text
              className="my-auto"
              style={[tw(" text-sm text-gray-800 ml-4")]}
            >
              Location
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
                    width="20%"
                    value={settings.notifications ? 1 : 0}
                    onSlidingComplete={(value) =>
                      value === 0
                        ? setSettings({ ...settings, notifications: false })
                        : setSettings({ ...settings, notifications: true })
                    }
                    thumbStyle={{
                      backgroundColor: "#6366f1",
                      height: 32,
                      width: 32,
                    }}
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  />
                ),
                vis: true,
                icon: "notifications",
                title: "Notification",
                subtitle: "Allow app to send you notifications",
              })
            }
            className="flex flex-row items-center justify-start mt-2 ml-2 border-b  py-4 border-gray-200"
          >
            <Icon name="notifications" type="material" color="#fbbf24" />
            <Text style={[tw(" text-sm text-gray-800 ml-4")]}>
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
                    width="20%"
                    value={settings.privacy ? 1 : 0}
                    onSlidingComplete={(value) =>
                      value === 0
                        ? setSettings({ ...settings, privacy: false })
                        : setSettings({ ...settings, privacy: true })
                    }
                    thumbStyle={{
                      backgroundColor: "#6366f1",
                      height: 32,
                      width: 32,
                    }}
                    style={{
                      height: 32,
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  />
                ),
                vis: true,
                icon: "lock",
                title: "Privacy",
                subtitle:
                  "Allow app to use your personal information to personalize your content and to analyze web traffic.",
              })
            }
            className="flex flex-row items-center justify-start mt-2 ml-2 border-b  py-4 border-gray-200"
          >
            <Icon name="lock" type="material" color="#ec4899" />
            <Text style={[tw(" text-sm text-gray-800 ml-4")]}>Privacy</Text>
          </TouchableOpacity>
        </View>
        <Text style={[tw(" text-xs text-gray-400 mt-8 ml-4")]}>ABOUT</Text>
        <View className="px-2 flex justify-center mt-2 bg-gray-50 mx-2 rounded-xl pb-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("AboutScreen")}
            className="flex flex-row items-center justify-start mt-2 ml-2 border-b  py-4 border-gray-200"
          >
            <Icon name="info" type="material" color="blue" />
            <Text style={[tw(" text-sm text-gray-800 ml-4")]}>About App</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setModalVisible({
                data: (
                  <View className="flex flex-col mx-8 my-4">
                    <TouchableOpacity
                      onPress={() =>
                        Linking.canOpenURL("mailto:greenclub@iitgn.ac.in").then(
                          (dc) =>
                            dc &&
                            Linking.openURL("mailto:greenclub@iitgn.ac.in")
                        )
                      }
                    >
                      <Text className="text-xs">
                        Email : Green (greenclub@iitgn.ac.in)
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.canOpenURL(
                          "mailto:ananthu.jp@iitgn.ac.in"
                        ).then(
                          (dc) =>
                            dc &&
                            Linking.openURL("mailto:ananthu.jp@iitgn.ac.in")
                        )
                      }
                    >
                      <Text className="text-xs">
                        Developer: Ananthu J P (ananthu.jp@iitgn.ac.in)
                      </Text>
                    </TouchableOpacity>
                  </View>
                ),
                vis: true,
                title: "Contact",
                subtitle: "Have any questions? We'd love to hear from you",
                icon: "phone",
              })
            }
            className="flex flex-row items-center justify-start mt-2 ml-2 border-b  py-4 border-gray-200"
          >
            <Icon name="phone" type="material" color="#ec4899" />
            <Text style={[tw(" text-sm text-gray-800 ml-4")]}>Contact US</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Settings;

import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { enableScreens } from "react-native-screens";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import ProductScreen from "./screens/ProductScreen";
import StoryScreen from "./screens/StoryScreen";
import Login from "./screens/Login";
import useAuth from "./hooks/userAuth";
import { NavigationContainer } from "@react-navigation/native";
import StoreScreen from "./screens/StoreScreen";
import MessageScreen from "./screens/MessageScreen";
import NewProduct from "./screens/NewProduct";
import Settings from "./screens/Settings";
import NewAd from "./screens/NewAd";
import SettingsProfile from "./screens/SettingsProfile";
//import NotifApp from "./screens/Notif";
import About from "./screens/About";
import { Button, Icon, Overlay } from "react-native-elements";

const Stack = createSharedElementStackNavigator();
enableScreens();
const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[{ backgroundColor }]}>
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight,
        //marginTop: StatusBar.currentHeight,
      }}
    >
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const StackNavigator = () => {
  const { user, statusBar, prompt, setPrompt } = useAuth();

  return (
    //    <NavigationContainer independent={true}>
    <>
      <MyStatusBar
        backgroundColor={statusBar.color}
        barStyle={statusBar.content}
      />
      <Overlay
        animationType="slide"
        onBackdropPress={() => setPrompt({ ...prompt, show: false })}
        isVisible={prompt.show}
      >
        <View className="flex flex-col px-8 pb-4 pt-8 rounded-lg">
          <View className="bg-indigo-600 h-16 w-16 mx-auto rounded-full flex flex-row items-center justify-center -mt-20 border-4 border-white">
            <Icon name={prompt.icon} type="material" color="white" size={32} />
          </View>
          <Text mul className="font-bold my-1 text-lg mx-6 text-center">
            {prompt.title}
          </Text>
          <Text className="mt-1 mb-4 text-sm mx-6 text-justify">
            {prompt.subtitle}
          </Text>
          <Button
            className="my-1"
            title="OK"
            containerStyle={{
              backgroundColor: "rgb(79,70,229)",
            }}
            buttonStyle={{ borderColor: "white" }}
            titleStyle={{ color: "white" }}
            type="outline"
            onPress={() => {
              prompt.function(), setPrompt({ ...prompt, show: false });
            }}
          />
          <Button
            containerStyle={{ marginTop: 6 }}
            buttonStyle={{ borderColor: "rgb(79,70,229)" }}
            titleStyle={{ color: "rgb(79,70,229)" }}
            title="Cancel"
            type="outline"
            onPress={() => setPrompt({ ...prompt, show: false })}
          />
        </View>
      </Overlay>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="SettingsProfile" component={SettingsProfile} />
          <Stack.Screen
            name="ProductScreen"
            component={ProductScreen}
            options={({ route }) => ({ title: route.params.name })}
          />

          <Stack.Screen name="StoryScreen" component={StoryScreen} />
          <Stack.Screen name="StoreScreen" component={StoreScreen} />
          <Stack.Screen name="NewProduct" component={NewProduct} />
          <Stack.Screen name="NewAd" component={NewAd} />
          <Stack.Screen name="MessageScreen" component={MessageScreen} />
          <Stack.Screen name="AboutScreen" component={About} />
        </>
      </Stack.Navigator>
    </>
  );
};

export default StackNavigator;

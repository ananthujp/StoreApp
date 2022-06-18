import { View, Text } from "react-native";
import React from "react";
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
const Stack = createSharedElementStackNavigator();
enableScreens();
const StackNavigator = () => {
  const { user } = useAuth();
  return (
    //    <NavigationContainer independent={true}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </>
      ) : (
        //<Stack.Screen name="Login" component={Login} />}
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="ProductScreen"
            component={ProductScreen}
            options={({ route }) => ({ title: route.params.name })}
          />
          <Stack.Screen
            name="StoryScreen"
            component={StoryScreen}
            // options={({ route }) => ({
            //   image: route.params.image,
            //   text: route.params.text,
            //   id: route.params.id,
            // })}
          />
          <Stack.Screen
            name="StoreScreen"
            component={StoreScreen}
            // options={({ route }) => ({
            //   image: route.params.image,
            //   text: route.params.text,
            //   id: route.params.id,
            // })}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;

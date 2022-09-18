import { View, Text, SafeAreaView, StatusBar } from "react-native";
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
import MessageScreen from "./screens/MessageScreen";
import NewProduct from "./screens/NewProduct";
import Settings from "./screens/Settings";

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
  const { user, statusBar } = useAuth();
  return (
    //    <NavigationContainer independent={true}>
    <>
      <MyStatusBar
        backgroundColor={statusBar.color}
        barStyle={statusBar.content}
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Settings" component={Settings} />
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
          <Stack.Screen name="StoreScreen" component={StoreScreen} />
          <Stack.Screen name="NewProduct" component={NewProduct} />
          <Stack.Screen name="MessageScreen" component={MessageScreen} />
        </>
      </Stack.Navigator>
    </>
  );
};

export default StackNavigator;

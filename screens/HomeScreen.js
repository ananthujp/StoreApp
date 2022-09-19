import {
  View,
  Text,
  Button,
  ImageBackground,
  StatusBar,
  Dimensions,
  //StyleSheet,
} from "react-native";
import React, { useLayoutEffect, useRef, useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import tw from "tailwind-rn";
import useAuth from "../hooks/userAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "react-native-elements";
import { Icon } from "react-native-elements";
import Stories from "./Stories";
import Products from "./Products";
import { styles } from "./Styles";
import Profile from "./Profile";
import BottomSheet, {
  BottomSheetScrollView,
  useBottomSheetSpringConfigs,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import Stores from "./Stores";
import Constants from "expo-constants";
import Actions from "./Actions";
const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[{ backgroundColor }]}>
    <SafeAreaView style={{ marginTop: Platform.OS === "ios" ? -44 : 0 }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);
const HomeScreen = () => {
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const PAGE_DIM = Dimensions.get("window");
  const navigation = useNavigation();
  const { heightAvatar, setStatusBar } = useAuth();
  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    isFocused &&
      setStatusBar({
        color: "#4338ca",
        content: "light-content",
      });
  }, [isFocused]);

  // useEffect(() => {
  //   setStatusBar({
  //     color: "#4338ca",
  //     content: "light-content",
  //   });
  // }, []);
  return (
    <>
      {/* <StatusBar barStyle="light-content" backgroundColor="#4338ca" /> */}

      <View className="flex flex-col h-full w-full bg-indigo-700">
        <Profile />

        <BottomSheet
          index={1}
          handleComponent={() => (
            <View className="flex items-center rounded-t-2xl bg-gray-50 -mb-1">
              <Icon
                name="up"
                spin={true}
                type="antdesign"
                color="gray"
                size={20}
              />
            </View>
          )}
          className="absolute bg-transparent"
          animationConfigs={animationConfigs}
          overDragResistanceFactor={2000}
          children={() => {
            return (
              <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                {/* <Actions /> */}
                <Stories />
                <Stores />
                <Products />
              </BottomSheetScrollView>
            );
          }}
          snapPoints={[
            185,
            PAGE_DIM.height - heightAvatar - (Platform.OS === "ios" ? 44 : 0),
            // + StatusBar.currentHeight,
          ]}
        />
      </View>
    </>
  );
};
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;
// const styless = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   // statusBar: {
//   //   height: STATUSBAR_HEIGHT,
//   // },
//   // appBar: {
//   //   backgroundColor: "#79B45D",
//   //   height: APPBAR_HEIGHT,
//   // },
//   content: {
//     flex: 1,
//     backgroundColor: "#33373B",
//   },
// });
export default HomeScreen;

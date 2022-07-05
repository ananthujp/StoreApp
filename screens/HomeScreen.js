import {
  View,
  Text,
  Button,
  StatusBar,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useLayoutEffect, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
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

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styless.statusBar, { backgroundColor }]}>
    <SafeAreaView>
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
  const { signInWithGoogle } = useAuth();
  const { user } = useAuth();
  const { logout } = useAuth();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#4338ca" />
      {/* <MyStatusBar backgroundColor="#7C3AED" barStyle="light-content" /> */}
      <View style={tw("flex flex-col h-full w-full bg-indigo-700")}>
        <Profile />

        <BottomSheet
          // ref={bottomSheetRef}
          index={1}
          handleComponent={() => (
            <View
              style={tw("flex items-center rounded-t-2xl bg-gray-50 -mb-1")}
            >
              <Icon
                name="up"
                spin={true}
                type="antdesign"
                color="gray"
                size={20}
              />
            </View>
          )}
          style={tw("absolute bg-transparent")}
          animationConfigs={animationConfigs}
          overDragResistanceFactor={2000}
          children={() => {
            return (
              <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                <Stories />
                {/* <View style={tw('w-full bg-gray-50 h-16 flex rounded-t-2xl -mt-20')}></View> */}
                <Stores />
                <Products />
              </BottomSheetScrollView>
            );
          }}
          snapPoints={[185, PAGE_DIM.height - 64]}
        />
      </View>
    </SafeAreaView>
  );
};
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;

const styless = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: "#79B45D",
    height: APPBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: "#33373B",
  },
});
export default HomeScreen;

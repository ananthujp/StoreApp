import {
  View,
  Text,
  Button,
  StatusBar,
  ImageBackground,
  Dimensions,
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
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      <View style={tw("flex flex-col h-full w-full bg-purple-600")}>
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

export default HomeScreen;

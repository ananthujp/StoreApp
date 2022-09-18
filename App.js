import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { AuthProvider } from "./hooks/userAuth";
import { AppLoading } from "expo";
import * as Font from "expo-font";

import { useFonts } from "@use-expo/font";
const customFonts = {
  GilroySm: require("./assets/fonts/Gilroy-Thin.ttf"),
  GilroyR: require("./assets/fonts/Gilroy-Regular.ttf"),
  GilroyMd: require("./assets/fonts/Gilroy-SemiBold.ttf"),
  GilroyLg: require("./assets/fonts/Gilroy-Bold.ttf"),
  GilroyXl: require("./assets/fonts/Gilroy-Black.ttf"),
};
export default function App() {
  const [isLoaded] = useFonts(customFonts);
  if (!isLoaded) {
    return <></>;
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

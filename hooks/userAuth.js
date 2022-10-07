import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import storage from "../storage";
//import { View, Text } from 'react-native'
//import * as Google from "expo-google-app-auth";
import { auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "@firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRef } from "react";

const AuthContext = createContext({});
const config = {
  iosClientId:
    "534218395389-tf4iumr5bljsf609vqgv3285fasct5iq.apps.googleusercontent.com",
  androidClientId:
    "534218395389-70iijoi5soin9g1u6i9c60u0g53bu7d9.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification(notifData) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: notifData.title,
      body: notifData.body,
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [statusBar, setStatusBar] = useState({
    color: "#4338ca",
    content: "light-content",
  });
  const [heightAvatar, setHavatar] = useState(0);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notifIDs, setNoifIDs] = useState([]);
  useEffect(() => {
    storage
      .load({
        key: "userState",
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          extraFetchOptions: {},
          someFlag: true,
        },
      })
      .then((ret) => {
        setUser(ret);
      })
      .catch((err) => {
        console.warn(err.message);
        switch (err.name) {
          case "NotFoundError":
            break;
          case "ExpiredError":
            break;
        }
      });
    async function fetchData() {
      registerForPushNotificationsAsync();
      notificationListener.current =
        Notifications.addNotificationReceivedListener();

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener();
    }
    fetchData();
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    user &&
      storage.save({
        key: "userState", // Note: Do not use underscore("_") in key!
        data: user,
        expires: null,
      });
  }, [user]);

  const pushNotif = async (notifData) => {
    !notifIDs.includes(notifData.id) &&
      schedulePushNotification(notifData) &&
      setNoifIDs((arr) => [...arr, notifData.id]);
  };
  const memoedValue = useMemo(
    () => ({
      user,
      setUser,
      heightAvatar,
      setHavatar,
      statusBar,
      setStatusBar,
      pushNotif,
      setNoifIDs,
    }),
    [user, heightAvatar, statusBar]
  );
  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}

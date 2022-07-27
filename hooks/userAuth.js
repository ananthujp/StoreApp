import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import storage from "../storage";
//import { View, Text } from 'react-native'
import * as Google from "expo-google-app-auth";
import { auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "@firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext({});
const config = {
  iosClientId:
    "534218395389-tf4iumr5bljsf609vqgv3285fasct5iq.apps.googleusercontent.com",
  androidClientId:
    "534218395389-70iijoi5soin9g1u6i9c60u0g53bu7d9.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [statusBar, setStatusBar] = useState({
    color: "#4338ca",
    content: "light-content",
  });
  const [heightAvatar, setHavatar] = useState(0);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);
  const profID = "7BKEh2pdbk4GBfnE5hFx";
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
  }, []);
  useEffect(() => {
    user &&
      storage.save({
        key: "userState", // Note: Do not use underscore("_") in key!
        data: user,
        expires: null,
      });
  }, [user]);
  const memoedValue = useMemo(
    () => ({
      user,
      setUser,
      heightAvatar,
      setHavatar,
      statusBar,
      setStatusBar,
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

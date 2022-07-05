import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
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
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);
  const profID = "7BKEh2pdbk4GBfnE5hFx";
  useEffect(() => {
    getDoc(doc(db, "Profiles", profID)).then((dc) =>
      setUser({ name: dc.data().name, dp: dc.data().dp, id: dc.id })
    );
  }, []);
  //   useEffect(
  //     () =>
  //       onAuthStateChanged(auth, (user) => {
  //         if (user) {
  //           setUser(user);
  //         } else {
  //           setUser(null);
  //         }
  //         setLoadingInitial(false);
  //       }),
  //     []
  //   );

  //   const logout = () => {
  //     setLoading(true);
  //     signOut(auth)
  //       .catch((error) => setError(error))
  //       .finally(() => setLoading(false));
  //   };
  //   const signInWithGoogle = async () => {
  //     setLoading(true);

  //     await Google.logInAsync(config)
  //       .then(async (loginresult) => {
  //         if (loginresult.type === "success") {
  //           const { idToken, accessToken } = loginresult;
  //           const credential = GoogleAuthProvider.credential(
  //             idToken,
  //             accessToken
  //           );
  //           await signInWithCredential(auth, credential);
  //         }
  //         return Promise.reject();
  //       })
  //       .catch((error) => {
  //         setError(error);
  //       })
  //       .finally(() => setLoading(false));
  //   };
  const memoedValue = useMemo(
    () => ({
      user,
    }),
    [user]
  );
  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}

import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";

import tw from "tailwind-rn";
import * as Progress from "react-native-progress";
import useAuth from "../hooks/userAuth";
import { Image } from "react-native";
import { Icon } from "react-native-elements";
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithCredential } from "@firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/core";
import logo from "../Images/login.png";
const Login = ({ setLogin }) => {
  //const { signInWithGoogle } = useAuth();
  const navigation = useNavigation();
  const { setUser } = useAuth();
  const [loginscreen, setScreen] = useState(true);
  const [loading, setloading] = useState(false);
  const [emailState, seteState] = useState(0);
  const [usernameState, setUserstate] = useState(0);
  const [loginState, setLoginstate] = useState(0);
  const [username, setUsername] = useState();
  const [userTemp, setTempUser] = useState();
  const [emailInput, seteemailInput] = useState();
  const [status, setStatus] = useState();
  const [password, setPass] = useState({ pass1: null, pass2: null });
  useEffect(() => {
    setUsername(null);
    setPass({ pass1: null, pass2: null });
    setStatus(null);
    setloading(false);
  }, [loginscreen]);

  const LoginUser = () => {
    setloading(true);
    onSnapshot(
      query(collection(db, "Profiles"), where("username", "==", username)),
      (dc) =>
        dc.docs.map((dc) => {
          //console.log(dc.data())
          if (dc.data().pass === password.pass1) {
            setUser({
              id: dc.id,
              name: dc.data().name,
              dp: dc.data().dp,
              email: dc.data().email,
              username: dc.data().username,
              store: dc.data().store,
              pass: dc.data().pass,
            });
            setStatus(1);
            //navigation.navigate("Home");
            setLogin(false);
          } else {
            setLoginstate(1);
          }
        })
    );
    setTimeout(() => {
      status !== 1 && setLoginstate(2);
      setloading(false);
    }, 5000);
  };
  const config = {
    iosClientId:
      "534218395389-tf4iumr5bljsf609vqgv3285fasct5iq.apps.googleusercontent.com",
    androidClientId:
      "534218395389-70iijoi5soin9g1u6i9c60u0g53bu7d9.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"],
  };

  return (
    <KeyboardAvoidingView
      className="h-auto absolute bottom-1 shadow-sm z-50 flex items-center bg-white rounded-xl  w-[98%] ml-1 border border-gray-400"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex flex-col items-center justify-around w-full rounded-t-xl  bg-indigo-700">
        <View className="flex flex-row w-full items-center justify-between mt-2 mx-2">
          <View></View>
          <View></View>
          <TouchableOpacity className="mr-2" onPress={() => setLogin(false)}>
            <Icon name="close" type="material" color="white" size={24} />
          </TouchableOpacity>
        </View>
        <View className="my-2 mx-auto">
          <Icon
            name="user"
            type="antdesign"
            color="white"
            style={tw(" text-white mr-2")}
            size={100}
          />
        </View>
        <View style={tw("flex flex-row w-full items-center justify-center")}>
          <View className="flex flex-col ">
            <Text className="text-white font-bold text-xl mx-auto">Login</Text>
            <Text className="text-white text-xs mx-auto">to your account</Text>
          </View>
        </View>
        <View>
          <Icon
            name="back"
            type="antdesign"
            color="#4338ca"
            style={tw(" text-white mr-2")}
            size={32}
          />
        </View>
      </View>
      <Text
        style={tw(
          "mt-6 text-center " +
            (loginState === 3 ? " text-green-600" : " text-red-600")
        )}
      >
        {loginState === 1 && "Login failed : Wrong password"}
        {loginState === 2 &&
          "Login failed : Username doesn't exist or Internet connection is broken"}
        {loginState === 3 &&
          "Signed UP successfully : Please login to your account"}
      </Text>
      <View
        style={tw(
          "flex flex-row mt-6 w-4/5 px-2 py-1 rounded-xl border justify-between items-center" +
            (usernameState === 1 ? " border-red-400" : " border-gray-400")
        )}
      >
        <View style={tw("flex flex-row justify-start items-center")}>
          <Icon
            name="user"
            type="antdesign"
            color={usernameState === 1 ? "#dc2626" : "black"}
            style={tw(" text-gray-400 mr-2")}
            size={20}
          />
          <TextInput
            onChangeText={(value) => setUsername(value)}
            placeholder="Enter your username"
            keyboardType="default"
            value={username}
            editable={status === 1 ? false : true}
            className="placeholder:text-black w-full"
            style={tw(usernameState === 1 ? " text-red-400" : " text-black")}
          />
        </View>
      </View>

      <View
        style={tw(
          "flex flex-row my-3 w-4/5 px-2 py-1 rounded-xl border border-gray-400  justify-between items-center"
        )}
      >
        <View style={tw("flex flex-row justify-start items-center")}>
          <Icon
            name="lock"
            type="antdesign"
            style={tw(" text-gray-400 mr-2")}
            size={20}
          />
          <TextInput
            onChangeText={(value) => setPass({ ...password, pass1: value })}
            value={password.pass1}
            // editable={status === 1 ? false : true}
            secureTextEntry={true}
            placeholder="Password"
            keyboardType="default"
            className="w-full"
          />
        </View>
      </View>

      <TouchableOpacity
        disabled={false}
        onPress={() => LoginUser()}
        style={tw(
          "flex flex-row items-center my-3 bg-indigo-600 flex w-4/5 justify-center  py-2 rounded-2xl"
        )}
      >
        <Text style={tw(" font-bold mr-2 text-white  text-center")}>Login</Text>
        {loading && <Progress.CircleSnail size={20} color={["red"]} />}
      </TouchableOpacity>
      <View style={tw(" flex flex-row mt-3 pb-4")}>
        <TouchableOpacity
          onPress={() =>
            Linking.canOpenURL(
              "https://students.iitgn.ac.in/greenclub/store/register/"
            ).then(
              (dc) =>
                dc &&
                Linking.openURL(
                  "https://students.iitgn.ac.in/greenclub/store/register/"
                )
            )
          }
          style={tw("")}
        >
          <Text style={tw("text-indigo-600 font-bold")}>Sign UP</Text>
        </TouchableOpacity>
        <Text style={tw("ml-1 text-center")}>
          for an account if you don't have one.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

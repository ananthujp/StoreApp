import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import * as Google from "expo-google-app-auth";
import tw from "tailwind-rn";
import useAuth from "../hooks/userAuth";
//import LowNav from '../LowNav'
import Cart from "./Cart";
import List from "./List";
import { Image } from "react-native";
import { Icon } from "react-native-elements";
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithCredential } from "@firebase/auth";
import { useRef } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
const Login = () => {
  //const { signInWithGoogle } = useAuth();
  const [emailState, seteState] = useState(0);
  const [usernameState, setUserstate] = useState(0);
  const [username, setUsername] = useState(0);
  const [userTemp, setTempUser] = useState(0);
  const [emailInput, seteemailInput] = useState();
  const [status, setStatus] = useState();
  const [password, setPass] = useState({ pass1: null, pass2: null });
  const emailCheck = (email) => {
    email && email.split("@")[1] && email.split("@")[1].split(".")[1]
      ? seteState(2)
      : seteState(0);
    seteemailInput(email);
    checkEmail(email);
  };
  const checkEmail = (value) => {
    getDocs(
      query(collection(db, "Profiles"), where("email", "==", value))
    ).then((doc) => doc.docs.map((dc) => seteState(5)));
  };
  const checkUser = (value) => {
    setUserstate(0);
    getDocs(
      query(collection(db, "Profiles"), where("username", "==", value))
    ).then((doc) => doc.docs.map((dc) => setUserstate(1)));
    setUsername(value);
  };
  const addUser = () => {
    addDoc(collection(db, "Profiles"), {
      username: username,
      name: userTemp.user.name,
      email: userTemp.user.email,
      dp: userTemp.user.photoUrl,
      pass: password.pass1,
    }).then(() => setStatus(1));
  };
  const config = {
    iosClientId:
      "534218395389-tf4iumr5bljsf609vqgv3285fasct5iq.apps.googleusercontent.com",
    androidClientId:
      "534218395389-70iijoi5soin9g1u6i9c60u0g53bu7d9.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"],
  };
  const signInWithGoogle = async () => {
    await Google.logInAsync(config)
      .then(async (loginresult) => {
        if (loginresult.type === "success") {
          const { idToken, accessToken } = loginresult;
          const credential = GoogleAuthProvider.credential(
            idToken,
            accessToken
          );
          if (loginresult.user.email === emailInput) {
            setTempUser(loginresult);
            seteState(3);
          } else seteState(4);
          await signInWithCredential(auth, credential);
        }
        return Promise.reject();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <View style={tw("h-full flex items-center")}>
      <View style={tw("flex flex-row w-full h-1/2 bg-indigo-700")}></View>
      <Text
        style={tw(
          "mt-6 " + (status === 1 ? " text-green-600" : " text-red-600")
        )}
      >
        {emailState === 4 && "Verification failed : Emails are not matching"}
        {emailState === 5 &&
          "Verification failed : Email has been already used"}
        {usernameState === 1 && "Username has been already taken"}
        {status === 1 && "Success : Signed UP successfully!"}
      </Text>
      <View
        style={tw(
          "flex flex-row mt-6 w-3/5 px-2 py-1 rounded-xl border justify-between items-center" +
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
            onChangeText={(value) => checkUser(value)}
            placeholder="Username"
            keyboardType="default"
            value={username}
            style={tw(usernameState === 1 ? " text-red-400" : " text-black")}
          />
        </View>
        {/* {username && usernameState !== 1 && (
          <Icon
            name="check"
            type="antdesign"
            style={tw(" mr-2")}
            color="#22c55e"
            size={20}
          />
        )} */}
      </View>
      <View
        style={tw(
          "flex flex-row mt-3 w-3/5 px-2 py-1 rounded-xl border justify-between items-center " +
            (emailState === 4 ? " border-red-400" : " border-gray-400")
        )}
      >
        <View style={tw("flex flex-row justify-start items-center")}>
          <Icon
            name="mail"
            type="antdesign"
            style={tw(
              "  mr-2" + (emailState === 4 ? " text-red-400" : " text-gray-400")
            )}
            color={emailState === 4 ? "#dc2626" : "black"}
            size={20}
          />
          <TextInput
            onChangeText={(value) => emailCheck(value)}
            placeholder="Email"
            value={emailInput}
            editable={emailState === 3 ? false : true}
            keyboardType="email-address"
            style={tw(
              "  mr-2" +
                (emailState === 4
                  ? " text-red-400"
                  : emailState === 3
                  ? " text-green-400"
                  : " text-gray-400")
            )}
          />
        </View>
        {emailState == 2 && (
          <TouchableOpacity
            disabled={emailState === 3 ? true : false}
            onPress={signInWithGoogle}
            style={tw(
              "flex flex-row items-center bg-indigo-700 flex w-24 items-center px-4 py-1 rounded-md "
            )}
          >
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png",
              }}
              style={tw("w-4 h-4")}
            />
            <Text style={tw("ml-2 text-white text-center")}>Verify</Text>
          </TouchableOpacity>
        )}
        {emailState == 3 && (
          <Icon
            name="check"
            type="antdesign"
            style={tw(" mr-2")}
            color="#22c55e"
            size={20}
          />
        )}
      </View>
      <View
        style={tw(
          "flex flex-row my-3 w-3/5 px-2 py-1 rounded-xl border border-gray-400  justify-between items-center"
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
            secureTextEntry={true}
            placeholder="Password"
            keyboardType="default"
          />
        </View>
        {password.pass1 && password.pass1 === password.pass2 && (
          <Icon
            name="check"
            type="antdesign"
            style={tw(" mr-2")}
            color="#22c55e"
            size={20}
          />
        )}
      </View>
      <View
        style={tw(
          "flex flex-row mb-3 w-3/5 px-2 py-1 rounded-xl border border-gray-400  justify-between items-center"
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
            onChangeText={(value) => setPass({ ...password, pass2: value })}
            value={password.pass2}
            secureTextEntry={true}
            placeholder="Repeat Password"
            keyboardType="default"
            style={tw(
              "  mr-2" +
                (password.pass1 === password.pass2
                  ? " text-black"
                  : " text-red-400")
            )}
          />
        </View>
        {password.pass1 && password.pass1 === password.pass2 && (
          <Icon
            name="check"
            type="antdesign"
            style={tw(" mr-2")}
            color="#22c55e"
            size={20}
          />
        )}
      </View>
      <TouchableOpacity
        disabled={
          username &&
          usernameState !== 1 &&
          emailState === 3 &&
          password.pass1 &&
          password.pass1 === password.pass2
            ? false
            : true
        }
        onPress={() => addUser()}
        style={tw(
          "flex flex-row items-center  flex w-24 items-center px-4 py-1 rounded-md " +
            (username &&
            usernameState !== 1 &&
            emailState === 3 &&
            password.pass1 &&
            password.pass1 === password.pass2
              ? " bg-indigo-700"
              : " bg-gray-700")
        )}
      >
        <Text style={tw("ml-2 text-white text-center")}>Sign UP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

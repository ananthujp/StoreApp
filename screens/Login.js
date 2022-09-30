import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";

import * as Google from "expo-google-app-auth";
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
const Login = () => {
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
    setloading(true);
    addDoc(collection(db, "Profiles"), {
      username: username,
      name: userTemp.user.name,
      email: userTemp.user.email,
      dp: userTemp.user.photoUrl,
      pass: password.pass1,
      store: false,
    }).then(() => {
      setStatus(1);
      setloading(false);
      setScreen(true);
      setLoginstate(3);
    });
  };
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
            navigation.navigate("Home");
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {loginscreen ? (
        <View style={tw("h-full flex items-center")}>
          <View className="flex flex-row items-center justify-around w-full h-1/5 bg-indigo-700">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name="back"
                type="antdesign"
                color="white"
                style={tw(" text-white mr-2")}
                size={28}
              />
            </TouchableOpacity>
            <View style={tw("flex flex-row items-center justify-center")}>
              <Icon
                name="user"
                type="antdesign"
                color="white"
                style={tw(" text-white mr-2")}
                size={40}
              />
              <View className="flex flex-col">
                <Text className="text-white text-xl">LOGIN</Text>
                <Text className="text-white text-xs">to your account</Text>
              </View>
              <View style={tw("mr-2")}>
                <Icon
                  name="back"
                  type="antdesign"
                  color="#4338ca"
                  style={tw(" text-white mr-2")}
                  size={32}
                />
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
                style={tw(
                  usernameState === 1 ? " text-red-400" : " text-black"
                )}
                className="w-full"
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
              "flex flex-row items-center my-3 bg-indigo-600 flex w-24 items-center px-4 py-1 rounded-md "
            )}
          >
            <Text style={tw("ml-2 mr-2 text-white text-center")}>Login</Text>
            {loading && <Progress.CircleSnail size={20} color={["red"]} />}
          </TouchableOpacity>
          <View style={tw(" flex flex-row my-3")}>
            <TouchableOpacity onPress={() => setScreen(false)} style={tw("")}>
              <Text style={tw("text-indigo-600 font-bold")}>Sign UP</Text>
            </TouchableOpacity>
            <Text style={tw("ml-1 text-center")}>
              for an account if you don't have one.
            </Text>
          </View>
        </View>
      ) : (
        <View style={tw("h-full flex items-center")}>
          <View className="flex flex-row items-center justify-around w-full h-1/5 bg-indigo-700">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name="back"
                type="antdesign"
                color="white"
                style={tw(" text-white mr-2")}
                size={32}
              />
            </TouchableOpacity>
            <View style={tw("flex flex-row items-center justify-center")}>
              <Icon
                name="user"
                type="antdesign"
                color="white"
                style={tw(" text-white mr-2")}
                size={40}
              />
              <View className="flex flex-col">
                <Text className="text-white text-xl">SIGN UP</Text>
                <Text className="text-white text-xs">for an account</Text>
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
              "mt-6 " + (status === 1 ? " text-green-600" : " text-red-600")
            )}
          >
            {emailState === 4 &&
              "Verification failed : Emails are not matching"}
            {emailState === 5 &&
              "Verification failed : Email has been already used"}
            {usernameState === 1 && "Username has been already taken"}
            {status === 1 && "Success : Signed UP successfully!"}
          </Text>
          <View
            style={tw(
              "flex flex-row mt-6 w-4/5 px-2 py-1 rounded-xl border justify-between items-center" +
                (usernameState === 1 ? " border-red-400" : " border-gray-400")
            )}
          >
            <View className="flex flex-row justify-start items-center">
              <Icon
                name="user"
                type="antdesign"
                color={usernameState === 1 ? "#dc2626" : "black"}
                size={20}
              />
              <TextInput
                onChangeText={(value) => checkUser(value)}
                placeholder="Username"
                keyboardType="default"
                value={username}
                editable={status === 1 ? false : true}
                className={
                  "w-full  " + usernameState === 1
                    ? " text-red-400"
                    : " text-black"
                }
              />
            </View>
            {username ? (
              usernameState !== 1 && (
                <Icon
                  name="check"
                  type="antdesign"
                  style={tw(" mr-2")}
                  color="#22c55e"
                  size={20}
                />
              )
            ) : (
              <></>
            )}
          </View>
          <View
            style={tw(
              "flex flex-row mt-3 w-4/5 px-2 py-1 rounded-xl border justify-between items-center " +
                (emailState === 5 ? " border-red-400" : " border-gray-400")
            )}
          >
            <View style={tw("flex flex-row justify-start items-center")}>
              <Icon
                name="mail"
                type="antdesign"
                style={tw(
                  "  mr-2" +
                    (emailState === 5 ? " text-red-400" : " text-gray-400")
                )}
                color={emailState === 5 ? "#dc2626" : "black"}
                size={20}
              />
              <TextInput
                onChangeText={(value) => emailCheck(value)}
                placeholder="Email"
                value={emailInput}
                editable={emailState === 3 ? false : true}
                keyboardType="email-address"
                className={
                  "  mr-2 " +
                  (emailState === 5
                    ? " text-red-400"
                    : emailState === 3
                    ? " text-green-400"
                    : " text-gray-400")
                }
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
                editable={status === 1 ? false : true}
                secureTextEntry={true}
                // style={tw("w-full")}
                placeholder="Password"
                keyboardType="default"
              />
            </View>
            {password.pass1 ? (
              password.pass1 === password.pass2 && (
                <Icon
                  name="check"
                  type="antdesign"
                  style={tw(" mr-2")}
                  color="#22c55e"
                  size={20}
                />
              )
            ) : (
              <></>
            )}
          </View>
          <View
            style={tw(
              "flex flex-row mb-3 w-4/5 px-2 py-1 rounded-xl border border-gray-400  justify-between items-center"
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
                editable={status === 1 ? false : true}
                style={tw(
                  "  mr-2 " +
                    (password.pass1 === password.pass2
                      ? " text-black"
                      : " text-red-400")
                )}
              />
            </View>
            {password.pass1 ? (
              password.pass1 === password.pass2 && (
                <Icon
                  name="check"
                  type="antdesign"
                  style={tw(" mr-2")}
                  color="#22c55e"
                  size={20}
                />
              )
            ) : (
              <></>
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
              "flex flex-row items-center my-3 flex w-24 items-center px-4 py-1 rounded-md " +
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
            {loading && <Progress.CircleSnail size={20} color={["red"]} />}
          </TouchableOpacity>
          <View style={tw(" flex flex-row my-3")}>
            <TouchableOpacity onPress={() => setScreen(true)} style={tw("")}>
              <Text style={tw("text-indigo-600 font-bold")}>Login</Text>
            </TouchableOpacity>
            <Text style={tw("ml-1 text-center")}>
              to your account if you already had signed up
            </Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default Login;

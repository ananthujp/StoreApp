import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StyleSheet,
} from "react-native";
import * as Progress from "react-native-progress";
import React, { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import tw from "tailwind-rn";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/core";
import { FlatList, ScrollView } from "react-native";

const MessageScreen = ({ route }) => {
  const messageRef = useRef();
  const userid = route.params.userid;
  const thread = route.params.thread;
  const navigation = useNavigation();
  const [load, setLoad] = useState(false);
  const [msg, setMsg] = useState();
  const [msgs, setMsgs] = useState();
  const [userThread, setUserThread] = useState();
  const PAGE_DIM = Dimensions.get("window");
  const sendMsg = () => {
    msg && setLoad(true);
    msg &&
      addDoc(
        collection(db, "Profiles", userid, "Messages", thread, "messages"),
        {
          data: msg,
          read: false,
          time: serverTimestamp(),
          from: "me",
        }
      ).then(
        addDoc(
          collection(db, "Profiles", thread, "Messages", userid, "messages"),
          {
            data: msg,
            read: false,
            time: serverTimestamp(),
            from: "you",
          }
        ).then(() => {
          setMsg(null);
          messageRef.current.scrollToEnd({ animated: true });
          setLoad(false);
        })
      );
  };
  useEffect(() => {
    getDoc(doc(db, "Profiles", thread)).then((dc) =>
      setUserThread({ name: dc.data().name, dp: dc.data().dp })
    );
    onSnapshot(
      query(
        collection(db, "Profiles", userid, "Messages", thread, "messages"),
        orderBy("time", "asc")
      ),
      (dc) =>
        setMsgs(
          dc.docs.map((dic) => ({
            text: dic.data().data,
            from: dic.data().from,
          }))
        )
    );
  }, []);
  useEffect(() => {
    messageRef.current.scrollToEnd({ animated: true });
  }, [msgs]);
  return (
    <View style={tw("flex flex-col h-full justify-between bg-gray-100")}>
      <View style={tw("flex flex-row items-center bg-indigo-700 p-4")}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon
            name="arrowleft"
            type="antdesign"
            color={"white"}
            style={tw(" text-gray-400 ml-2 mr-4")}
            size={20}
          />
        </TouchableOpacity>
        <Avatar
          rounded
          size={45}
          source={{
            uri: userThread
              ? userThread.dp
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
          }}
        />
        <Text style={tw("text-lg text-white ml-3")}>{userThread?.name}</Text>
      </View>

      <ScrollView ref={messageRef}>
        {msgs?.map((item, index) =>
          item.from === "me" ? (
            <View
              style={{
                backgroundColor: "#6366f1",
                padding: 10,
                marginLeft: "45%",
                borderRadius: 5,
                marginTop: 5,
                marginRight: "5%",
                maxWidth: "50%",
                alignSelf: "flex-end",
                borderRadius: 20,
              }}
              key={index}
            >
              <Text style={{ fontSize: 16, color: "#fff" }} key={index}>
                {item.text}
              </Text>
              <View style={styles.rightArrow}></View>
              <View style={styles.rightArrowOverlap}></View>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: "#dedede",
                padding: 10,
                borderRadius: 5,
                marginTop: 5,
                marginLeft: "5%",
                maxWidth: "50%",
                alignSelf: "flex-start",
                borderRadius: 20,
              }}
              key={index}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                  justifyContent: "center",
                }}
                key={index}
              >
                {item.text}
              </Text>
              <View style={styles.leftArrow}></View>
              <View style={styles.leftArrowOverlap}></View>
            </View>
          )
        )}
        <View style={tw("h-4")}></View>
      </ScrollView>
      <View style={tw("flex flex-row items-center p-3")}>
        <TextInput
          underlineColorAndroid="transparent"
          onChangeText={(value) => setMsg(value)}
          value={msg}
          style={tw("bg-indigo-100 text-lg py-3 px-4 w-full rounded-xl")}
        />
        {load ? (
          <Progress.CircleSnail
            style={tw("h-8 w-8 -ml-11 rounded-lg items-center")}
            size={30}
            color={["#a5b4fc"]}
          />
        ) : (
          <TouchableOpacity
            onPress={sendMsg}
            style={tw("bg-indigo-500 h-9 w-9 -ml-11 rounded-lg items-center")}
          >
            <Icon
              name="paper-plane"
              type="entypo"
              color="white"
              size={22}
              style={tw("mt-1.5")}
            />
          </TouchableOpacity>
        )}
      </View>
      {/* <View style={tw("flex flex-row items-center bg-indigo-400 w-full p-3")}>
        <TextInput
          onChangeText={(value) => setMsg(value)}
          value={msg}
          style={[
            tw(
              "border border-indigo-200  bg-indigo-300 text-base text-white py-2 px-5 rounded-full"
            ),
            { width: PAGE_DIM.width - 60 },
          ]}
        />
        {load ? (
          <Progress.CircleSnail style={tw("ml-2 ")} size={30} color={["red"]} />
        ) : (
          <TouchableOpacity
            style={tw(
              " ml-1 bg-indigo-800 h-10 flex items-center justify-center w-10 rounded-full"
            )}
            onPress={() => sendMsg()}
          >
            <Icon
              name="arrowup"
              type="antdesign"
              color={"white"}
              style={tw(" text-gray-400")}
              size={25}
            />
          </TouchableOpacity>
        )}
      </View> */}
    </View>
  );
};
const styles = StyleSheet.create({
  rightArrow: {
    position: "absolute",
    backgroundColor: "#6366f1",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10,
  },

  rightArrowOverlap: {
    position: "absolute",
    backgroundColor: "#eeeeee",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20,
  },

  /*Arrow head for recevied messages*/
  leftArrow: {
    position: "absolute",
    backgroundColor: "#dedede",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10,
  },

  leftArrowOverlap: {
    position: "absolute",
    backgroundColor: "#eeeeee",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -20,
  },
});
export default MessageScreen;

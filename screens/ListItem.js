import React, { useEffect, useState } from "react";
import tw from "tailwind-rn";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { Icon } from "react-native-elements/dist/icons/Icon";
import { styles } from "./Styles";
import { Image } from "react-native";
import {
  collection,
  doc,
  getDoc,
  orderBy,
  onSnapshot,
  query,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/userAuth";
import { useNavigation } from "@react-navigation/core";
const ListItem = ({ item, index }) => {
  const { user } = useAuth();
  const [userD, setUser] = useState();
  const [unread, setUnread] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    getDoc(doc(db, "Profiles", item.id)).then((dc) =>
      setUser({ name: dc.data().name, dp: dc.data().dp })
    );
  }, []);
  const [msg, setMsg] = useState();
  onSnapshot(
    query(
      collection(db, "Profiles", user.id, "Messages", item.id, "messages"),
      orderBy("time", "desc"),
      limit(1)
    ),
    (dc) =>
      dc.docs.map((dic) => {
        setMsg(dic.data().data);
        setUnread(!dic.data().read);
      })
  );
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("MessageScreen", {
          userid: user.id,
          thread: item.id,
        });
      }}
      style={[
        tw(
          " rounded-xl my-1 py-2 px-4 flex flex-col border-indigo-400" +
            (index === 0 ? " border-t " : " ")
        ),
      ]}
    >
      <View style={tw("flex flex-row justify-between ")}>
        <View style={tw("flex flex-row items-start")}>
          <Image
            style={tw("w-16 h-16 rounded-full")}
            source={{
              uri: userD
                ? userD.dp
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
            }}
          />
          <View style={tw("flex flex-col items-start ml-2")}>
            <Text
              style={[
                styles.fontStyle,
                tw(" text-center text-gray-200 text-lg"),
              ]}
            >
              {userD?.name}
            </Text>
            {/* <LastMsg user={user.id} msgId={item.id} /> */}
            <Text
              style={[
                unread ? styles.fontStyleItalic : styles.fontStyleReg,
                tw(" text-center text-gray-200 text-xs"),
              ]}
            >
              {msg}
            </Text>
          </View>
        </View>
        <View style={tw("flex flex-col items-center justify-around mx-2")}>
          {unread && (
            <TouchableOpacity
              style={tw(
                "bg-white w-8 h-8 items-center justify-center rounded-full opacity-75"
              )}
            >
              <Text>1</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;

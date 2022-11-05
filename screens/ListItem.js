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
import { Image, Alert } from "react-native";
import {
  collection,
  doc,
  getDoc,
  orderBy,
  onSnapshot,
  query,
  limit,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/userAuth";
import { useNavigation } from "@react-navigation/core";
import { async } from "@firebase/util";
import { Avatar, Badge, ListItem } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import TouchableScale from "react-native-touchable-scale";
const ListItemw = ({ item, index }) => {
  const { user, pushNotif } = useAuth();
  const [userD, setUser] = useState();
  const [unread, setUnread] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    getDoc(doc(db, "Profiles", item.id)).then((dc) =>
      setUser({ name: dc.data().name, dp: dc.data().dp })
    );
    onSnapshot(
      query(
        collection(db, "Profiles", user.id, "Messages", item.id, "messages"),
        orderBy("time", "desc"),
        limit(1)
      ),
      (dc) =>
        dc.docs.map(async (dic) => {
          setMsg(dic.data().data);
          setUnread(!dic.data().read);
          !dic.data().read &&
            userD &&
            (await pushNotif({
              id: dic.id,
              title: `You have an unread message from ${userD.name}`,
              body: dic.data().data,
            }));
        })
    );
  }, []);
  const [msg, setMsg] = useState();
  const handleDelete = (thread) => {
    deleteDoc(doc(db, "Profiles", user.id, "Messages", thread));
  };
  return (
    <ListItem
      key={index}
      Component={TouchableScale}
      friction={90} //
      tension={100} // These props are passed to the parent component (here TouchableScale)
      activeScale={0.95} //
      onPress={() => {
        navigation.navigate("MessageScreen", {
          userid: user.id,
          thread: item.id,
        });
      }}
      onLongPress={() => {
        Alert.alert(
          "Delete Message",
          "Do you want to delete this message thread?",
          [
            {
              text: "Cancel",
              //onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => handleDelete(item.id) },
          ]
        );
      }}
      style={[
        tw(
          " rounded-xl my-1 py-2 px-4 flex flex-col border-indigo-400" +
            (index === 0 ? " border-t " : " ")
        ),
      ]}
      containerStyle={{
        backgroundColor: "transparent",
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 0,
      }}
      //bottomDivider

      // linearGradientProps={{
      //   colors: ["#FF9800", "#F44336"],
      //   start: { x: 1, y: 0 },
      //   end: { x: 0.2, y: 0 },
      // }}
      // ViewComponent={LinearGradient}
    >
      <Avatar
        rounded
        size={56}
        source={{
          uri: userD
            ? userD.dp
            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ color: "white", fontWeight: "bold" }}>
          {userD?.name}
        </ListItem.Title>
        <ListItem.Subtitle style={{ color: "white" }}>{msg}</ListItem.Subtitle>
      </ListItem.Content>
      {unread ? (
        <Badge
          value={1}
          textStyle={{ fontSize: 16, color: "red" }}
          badgeStyle={{
            height: 24,
            width: 24,
            borderRadius: 32,
            borderColor: "red",
            backgroundColor: "white",
          }}
        />
      ) : (
        <ListItem.Chevron color="white" />
      )}
    </ListItem>
  );
};
{
  /* <View className="flex flex-row justify-between ">
        <View className="flex flex-row items-start">
          <Image
            className="w-16 h-16 rounded-full"
            source={{
              uri: userD
                ? userD.dp
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
            }}
          />
          <View className="flex flex-col items-start ml-2">
            <Text
              style={[
                styles.fontStyle,
                tw(" text-center text-gray-200 text-lg"),
              ]}
            >
              {userD?.name}
            </Text>
            {/* <LastMsg user={user.id} msgId={item.id} /> *
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
        <View className="flex flex-col items-center justify-around mx-2">
          {unread && (
            <TouchableOpacity className="bg-white w-8 h-8 items-center justify-center rounded-full opacity-75">
              <Text>1</Text>
            </TouchableOpacity>
          )}
        </View>
      </View> */
}
export default ListItemw;

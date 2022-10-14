import { useNavigation } from "@react-navigation/core";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import * as Progress from "react-native-progress";
import React, { useState } from "react";
import { useEffect } from "react";
import { TextInput } from "react-native";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-rn";
import { db } from "../firebase";
import useAuth from "../hooks/userAuth";
import ListItem from "../screens/ListItem";

function Messages() {
  const navigation = useNavigation();
  const PAGE_DIM = Dimensions.get("window");
  const [threads, setThread] = useState();
  const [search, setSearch] = useState(false);
  const [profiles, setProfiles] = useState();
  const [results, setResults] = useState();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    user &&
      onSnapshot(collection(db, "Profiles", user.id, "Messages"), (dc) => {
        setThread(
          dc.docs.map((dic) => ({
            id: dic.id,
            name: dic.data().name,
            icon: dic.data().icon,
            //messages: dic.data().messages,
          }))
        );
        setLoading(false);
      });
    return () => setThread(null);
  }, [user]);
  useEffect(() => {
    onSnapshot(collection(db, "Profiles"), (dc) =>
      setProfiles(
        dc.docs.map((dc) => ({
          name: dc.data().name,
          id: dc.id,
        }))
      )
    );
  }, []);
  useEffect(() => {
    const matches =
      search?.length > 1 &&
      profiles?.filter((element) => {
        if (element.name.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
          return true;
        }
      });
    setResults([matches]);
  }, [search]);
  const newMessage = (tid) => {
    const matches = threads?.filter((element) => {
      if (element.id.indexOf(tid) !== -1) {
        return true;
      }
    });
    matches.length
      ? navigation.navigate("MessageScreen", {
          userid: user.id,
          thread: tid,
        })
      : setDoc(doc(db, "Profiles", user.id, "Messages", tid), {
          name: "Test",
        }).then(() =>
          addDoc(
            collection(db, "Profiles", user.id, "Messages", tid, "messages"),
            {
              data: "Chat created",
              read: false,
              time: serverTimestamp(),
              from: "me",
            }
          ).then(() => {
            navigation.navigate("MessageScreen", {
              userid: user.id,
              thread: tid,
            });
          })
        );
  };
  return (
    <View
      style={tw("flex flex-col px-2 mt-2 rounded-md items-center")}
      height={PAGE_DIM.height - 350}
      width={PAGE_DIM.width}
    >
      <View
        className={
          "w-full h-[95%] bg-white/60 rounded-3xl z-50" +
          (search ? " absolute" : " hidden")
        }
      ></View>
      <View
        style={tw(
          " flex flex-col items-center z-50  rounded-lg" +
            (search ? " absolute" : " hidden")
        )}
      >
        <View
          style={tw(
            "bg-indigo-100 rounded-full items-center flex flex-row border border-indigo-400"
          )}
        >
          <Icon
            name="user"
            type="antdesign"
            color={"gray"}
            style={tw(" text-gray-400 pl-2")}
            size={20}
          />
          <TextInput
            placeholder="Search for users..."
            onChangeText={(value) => setSearch(value)}
            className="text-sm font-semibold  px-1 py-2 "
            style={[{ width: 0.75 * PAGE_DIM.width }]}
          />
          <TouchableOpacity
            onPress={() => setSearch(false)}
            style={tw("flex items-center justify-center w-10 h-10")}
          >
            <Icon
              name="close"
              type="antdesign"
              color={"black"}
              style={tw(" text-gray-400 mr-2")}
              size={20}
            />
          </TouchableOpacity>
        </View>
        <View
          style={[
            tw(" bg-indigo-50 rounded-b-xl"),
            { width: 0.75 * PAGE_DIM.width },
          ]}
        >
          {results?.map(
            (dc) =>
              dc.length > 0 &&
              dc?.map(
                (dic, i) =>
                  dic.id !== user.id && (
                    <TouchableOpacity
                      key={`search.results.user${i}`}
                      onPress={() => {
                        newMessage(dic.id);
                      }}
                      style={tw(" p-2 border-b border-indigo-200")}
                    >
                      <Text>{dic.name}</Text>
                    </TouchableOpacity>
                  )
              )
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => setSearch(true)}
        style={tw(
          "flex flex-row items-center my-3 bg-indigo-500 flex items-center px-4 py-1 rounded-md "
        )}
      >
        <Icon
          name="plus"
          type="antdesign"
          color={"white"}
          style={tw(" text-gray-400 mr-2")}
          size={20}
        />
        <Text style={tw("ml-2 mr-2 text-white text-center")}>New Message</Text>
      </TouchableOpacity>
      {loading ? (
        <Progress.CircleSnail
          size={100}
          thickness={1}
          color={["red", "white"]}
        />
      ) : (
        user &&
        threads && (
          <ScrollView style={tw("flex w-full")}>
            {threads.map((doc, i) => (
              <ListItem key={`thread.${doc.id}`} item={doc} index={i} />
            ))}
          </ScrollView>
        )
      )}
    </View>
  );
}

export default Messages;

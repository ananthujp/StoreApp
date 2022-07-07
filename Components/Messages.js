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
const Orders = {
  orders: [
    {
      title: "Shirt",
      details: "date",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcdazO-A2GATjul_WcjGUyqN5jKL6E8Fqy5w&usqp=CAU",
      category: ["Dress"],
    },
    {
      title: "Cycle",
      details: "date",
      logo: "https://images.indianexpress.com/2022/03/MerakiS7_LEAD.jpg",
      category: ["Bike"],
    },
    {
      title: "Macbook Pro",
      details: "date",
      logo: "https://i.pcmag.com/imagery/reviews/05POeP7aWhKjIKkZ15YCZa9-14.fit_lim.size_1050x.jpg",
      category: ["Laptop"],
    },
    {
      title: "Cannon 5D",
      details: "date",
      logo: "https://www.cameralabs.com/wp-content/uploads/2017/01/Canon5DIV_hero3_4000.jpg",
      category: ["Camera"],
    },
    {
      title: "Sandals",
      details: "date",
      logo: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/sandals-1622127128.jpg?crop=1.00xw:0.837xh;0,0.0773xh&resize=1200:*",
      category: ["Footwear"],
    },
  ],
  ads: [
    { title: "Ads posted", details: "date" },
    { title: "Ads posted", details: "date" },
    { title: "Ads posted", details: "date" },
    { title: "Ads posted", details: "date" },
    { title: "Ads posted", details: "date" },
    { title: "Ads posted", details: "date" },
    { title: "Ads posted", details: "date" },
    { title: "Ads posted", details: "date" },
  ],
  wishlist: [
    { title: "wishlist ", details: "date" },
    { title: "wishlist ", details: "date" },
    { title: "wishlist ", details: "date" },
    { title: "wishlist ", details: "date" },
    { title: "wishlist ", details: "date" },
    { title: "wishlist ", details: "date" },
  ],
  moreInfoIcon: [
    { name: "Info", icon: "camera", function: (arg) => console.log(arg) },
    { name: "Info", icon: "info", function: (arg) => console.log(arg) },
  ],
};
function Messages() {
  const navigation = useNavigation();
  const PAGE_DIM = Dimensions.get("window");
  const [threads, setThread] = useState();
  const [search, setSearch] = useState(true);
  const [profiles, setProfiles] = useState();
  const [results, setResults] = useState();
  const { user } = useAuth();
  useEffect(() => {
    user &&
      onSnapshot(collection(db, "Profiles", user.id, "Messages"), (dc) =>
        setThread(
          dc.docs.map((dic) => ({
            id: dic.id,
            name: dic.data().name,
            icon: dic.data().icon,
            //messages: dic.data().messages,
          }))
        )
      );
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
            console.log("Done");
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
        style={tw(
          " flex flex-col items-center z-50 w-full h-full rounded-lg" +
            (search ? " absolute" : " hidden")
        )}
      >
        <View
          style={tw(
            "bg-indigo-100 rounded-full items-center flex flex-row border border-indigo-400"
          )}
        >
          <TextInput
            placeholder="Search for users..."
            onChangeText={(value) => setSearch(value)}
            style={[tw("text-lg px-5 py-2 "), { width: 0.75 * PAGE_DIM.width }]}
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
                (dic) =>
                  dic.id !== user.id && (
                    <TouchableOpacity
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
      {threads && (
        <ScrollView style={tw("flex w-full")}>
          {threads.map((doc, i) => (
            <ListItem key={`thread.${doc.id}`} item={doc} index={i} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export default Messages;

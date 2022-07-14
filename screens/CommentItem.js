import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-rn";
import { styles } from "./Styles";
import { Image } from "react-native";
import { Icon } from "react-native-elements";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
const CommentItem = ({ prof, comment, likes }) => {
  const [profile, setProfile] = useState();
  useEffect(() => {
    getDoc(doc(db, "Profiles", prof)).then((doc) =>
      setProfile({ name: doc.data().name, image: doc.data().dp })
    );
  }, []);
  return (
    <View style={tw("flex flex-row items-start mt-3")}>
      <View
        style={tw("h-10 w-10 bg-blue-100 rounded-full border-2 border-white")}
      >
        <Image
          source={{ uri: profile?.image }}
          style={tw("h-10 w-10 rounded-full")}
        />
      </View>
      <View style={tw("flex flex-col ml-4")}>
        <Text style={[tw("text-base"), styles.fontStyle]}>{profile?.name}</Text>
        <View style={tw("flex flex-row")}>
          <Text style={[tw("bg-blue-100 p-3 rounded-b-lg rounded-tr-lg mt-1")]}>
            {comment}
          </Text>
          <View
            style={[
              tw(
                "bg-white rounded-3xl h-5 px-1.5 items-center flex flex-row justify-center -mt-1 -ml-3"
              ),
            ]}
          >
            <Text style={[tw("text-xs mr-0.5")]}>{likes}</Text>
            <Icon name="heart" type="antdesign" color="red" size={10} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CommentItem;

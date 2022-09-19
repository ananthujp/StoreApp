import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import tw from "tailwind-rn";
import { Icon } from "react-native-elements";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import * as Progress from "react-native-progress";
import useAuth from "../hooks/userAuth";
const DATA = [
  {
    id: 0,
    name: "Eilish",
    comment: "Beatiful Product!",
    image:
      "https://www.pinkvilla.com/imageresize/rashmika_mandanna_diwali_selfies_2.jpg?width=752&format=webp&t=pvorg",
  },
  {
    id: 1,
    name: "Hannah",
    comment: "Awesome! Loved It!",
    image:
      "https://c.ndtvimg.com/2021-06/hgkqh1r_kajal-aggarwal_295x200_04_June_21.jpg",
  },
];
const Comments = ({ ProdID }) => {
  const [comments, setComments] = useState();
  const [comment, setComment] = useState();
  const [load, setLoad] = useState(false);
  const { user } = useAuth();
  const handleComment = () => {
    setLoad(true);
    addDoc(collection(db, "Products", ProdID, "Comments"), {
      comment: comment,
      likes: 0,
      prof: user.id,
    }).then(() => {
      setComment("");
      setLoad(false);
    });
  };
  useEffect(() => {
    onSnapshot(collection(db, "Products", ProdID, "Comments"), (dc) =>
      setComments(dc.docs.map((dic) => ({ id: dic.id, data: dic.data() })))
    );
  }, []);
  return (
    <View>
      <View className="mt-4">
        <Text style={[tw("text-lg text-indigo-900"), styles.fontStylelite]}>
          Wanna ask something ?
        </Text>
      </View>
      <View className="flex flex-row items-center mt-2">
        <TextInput
          value={comment}
          onChangeText={(txt) => setComment(txt)}
          className="bg-indigo-100 text-lg py-3 px-4 w-full rounded-xl"
        />

        <TouchableOpacity
          onPress={handleComment}
          className="bg-indigo-300 h-9 w-9 -ml-11 rounded-lg items-center"
        >
          {load ? (
            <Progress.CircleSnail
              className="h-8 w-8 mt-1 rounded-lg items-center"
              size={30}
              color={["white"]}
            />
          ) : (
            <Icon
              name="paper-plane"
              type="entypo"
              color="white"
              size={22}
              className="mt-1.5"
            />
          )}
        </TouchableOpacity>
      </View>
      {comments?.map((doc) => (
        <CommentItem
          key={doc.id}
          prof={doc.data.prof}
          comment={doc.data.comment}
          likes={doc.data.likes}
        />
      ))}
    </View>
  );
};

export default Comments;

const styles = StyleSheet.create({});

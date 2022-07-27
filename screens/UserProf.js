import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import tw from "tailwind-rn";

const UserProf = ({ id }) => {
  const [userP, setUserP] = useState();
  useEffect(() => {
    getDoc(doc(db, "Profiles", id)).then((dc) =>
      setUserP({ id: dc.id, data: dc.data() })
    );
  }, []);
  const formatEmail = (txt) => {
    const email =
      txt[0] +
      "*".repeat(txt.split("@")[0].length - 2) +
      txt.split("@")[0][txt.split("@")[0].length - 1] +
      "@" +
      txt.split("@")[1];
    return email;
  };
  return (
    <View style={tw("flex items-center flex-row my-4")}>
      <Image
        style={tw("w-10 h-10 rounded-full")}
        source={{ uri: userP?.data.dp }}
      />
      <View style={tw("flex flex-col ml-2")}>
        <Text style={tw("text-sm text-gray-600 font-bold")}>
          {userP?.data.name}
        </Text>
        <Text style={tw("text-xs text-gray-400 font-thin")}>
          {userP?.data.email && formatEmail(userP?.data.email)}
        </Text>
      </View>
    </View>
  );
};

export default UserProf;

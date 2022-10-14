import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect } from "react";
import { Icon } from "react-native-elements";
import useAuth from "../hooks/userAuth";
import { useNavigation } from "@react-navigation/core";

const About = () => {
  const TechnicalData = [
    {
      id: 0,
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
      title: "React Native",
    },
    {
      id: 1,
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2048px-Tailwind_CSS_Logo.svg.png",
      title: "Tailwind",
    },
    {
      id: 2,
      icon: "https://www.gstatic.com/devrel-devsite/prod/v24d520161c9661e427a3f6fa9973bfca56d0972dca82fa8ef65c709d915e80f3/firebase/images/touchicon-180.png",
      title: "Firebase",
    },
    {
      id: 3,
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png",
      title: "Node js",
    },
  ];
  const renderItem = ({ item, i }) => (
    <TouchableOpacity className="mx-2 rounded-full">
      <View className="rounded-lg  overflow-hidden bg-white p-2 flex flex-col items-center">
        <View className="w-20 h-20">
          <Image
            className="h-[90%]"
            source={{
              uri: item.icon,
            }}
          />
        </View>
        <Text>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const { setStatusBar } = useAuth();
  useEffect(() => {
    setStatusBar({
      color: "#4338ca",
      content: "light-content",
    });
    return () =>
      setStatusBar({
        color: "#f3f4f6",
        content: "dark-content",
      });
  }, []);
  const navigation = useNavigation();
  return (
    <View className="h-full flex items-center">
      <View className="flex flex-row items-center justify-around w-full h-1/5 bg-indigo-700">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrowleft"
            type="antdesign"
            color="white"
            className=" text-white mr-2"
            size={28}
          />
        </TouchableOpacity>
        <View className="flex flex-row items-center justify-center">
          <Icon
            name="user"
            type="antdesign"
            color="white"
            className=" text-white mr-2"
            size={40}
          />
          <View className="flex flex-col">
            <Text className="text-white text-xl">ABOUT</Text>
            <Text className="text-white text-xs">Green store</Text>
          </View>
          <View className="mr-2">
            <Icon
              name="back"
              type="antdesign"
              color="#4338ca"
              className=" text-white mr-2"
              size={32}
            />
          </View>
        </View>
        <View>
          <Icon
            name="back"
            type="antdesign"
            color="#4338ca"
            className=" text-white mr-2"
            size={32}
          />
        </View>
      </View>

      <View className="flex flex-col w-full">
        <Text className="mr-auto text-sm text-gray-600 mt-8 ml-8">
          Technical Details
        </Text>
        <FlatList
          horizontal
          data={TechnicalData}
          className="mx-8 my-2"
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        <View className="flex flex-row items-center mx-8 mt-4">
          <Text className="mx-2 font-bold">Developer :</Text>
          <Text className="mx-2 ">Ananthu J P</Text>
          <Icon
            name="github"
            type="antdesign"
            color="#4338ca"
            className=" text-white mr-2"
            size={12}
          />
        </View>
        <View className="flex flex-row items-center mx-8 ">
          <Text className="mx-2 font-bold">Source Code :</Text>
          <Text className="mx-2 ">Store | GitHub</Text>
          <Icon
            name="github"
            type="antdesign"
            color="#4338ca"
            className=" text-white mr-2"
            size={12}
          />
        </View>
      </View>
    </View>
  );
};

export default About;

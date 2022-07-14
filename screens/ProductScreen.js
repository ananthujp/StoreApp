import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import tw from "tailwind-rn";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./Styles";
//import { FlatList } from 'react-native-gesture-handler'
import { Image } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Comments from "./Comments";
import { SharedElement } from "react-navigation-shared-element";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/userAuth";
import { useNavigation } from "@react-navigation/core";

const ProductScreen = ({ route }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const PAGE_DIM = Dimensions.get("window");
  const [prodData, setProdData] = useState();
  const [threads, setThread] = useState();
  //const ProdImages = route.params.images;
  const navigation = useNavigation();
  const ProdID = route.params.data;
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
    getDoc(doc(db, "Products", ProdID)).then((dc) =>
      setProdData({ id: dc.id, data: dc.data() })
    );
  }, []);
  const Backdrop = ({ scrollX }) => {
    return (
      <View style={tw("flex flex-row items-center")}>
        {prodData?.data.images.map((_, i) => {
          const inputRange = [
            (i - 1) * PAGE_DIM.width,
            i * PAGE_DIM.width,
            (i + 1) * PAGE_DIM.width,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={`bd.${i}.element`}
              style={[
                tw("flex bg-blue-200 border-white h-2 rounded-full mx-1"),
                { width: scale },
              ]}
            ></Animated.View>
          );
        })}
      </View>
    );
  };
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
          prodID: ProdID,
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
              prodID: ProdID,
            });
          })
        );
  };
  return (
    <SafeAreaView>
      <StatusBar animated barStyle="dark-content" backgroundColor="white" />
      <View style={tw("flex flex-col w-full bg-gray-50 h-full")}>
        <View style={tw("flex flex-col items-center")}>
          <View style={[tw(""), { width: PAGE_DIM.width, overflow: "hidden" }]}>
            <Animated.FlatList
              horizontal
              data={prodData?.data.images}
              keyExtractor={(_, index) => index.toString()}
              snapToInterval={PAGE_DIM.width}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              bounces={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              renderItem={({ item }) => {
                return (
                  <SharedElement id={`item.${item}.img`}>
                    <Image
                      source={{ uri: item }}
                      style={{
                        height: 0.62 * PAGE_DIM.height,
                        width: PAGE_DIM.width,
                        resizeMode: "cover",
                      }}
                    />
                  </SharedElement>
                );
              }}
            />
          </View>
        </View>
        <View
          style={[
            tw(
              "flex flex-row justify-between mt-4 mx-4 items-center h-8 absolute top-0 "
            ),
            { width: 0.95 * PAGE_DIM.width },
          ]}
        >
          <View
            style={tw(
              "flex flex-row bg-blue-500 px-2 items-center justify-center h-7  rounded-2xl"
            )}
          >
            <Icon name="place" type="material" color="red" size={20} />
            <Text
              style={[
                styles.fontStyle,
                tw("text-white text-center text-xs mr-1"),
              ]}
            >
              {prodData?.data.loc.length > 7
                ? prodData?.data.loc.slice(0, 8) + ".."
                : prodData?.data.loc}
            </Text>
          </View>
          <Backdrop scrollX={scrollX} />
          <TouchableOpacity
            style={tw(
              "flex bg-red-600 flex-col items-center px-1 pt-2.5 h-10 w-10 rounded-full"
            )}
          >
            <Icon name="heart" type="antdesign" color="white" size={20} />
          </TouchableOpacity>
        </View>
        <BottomSheet
          snapPoints={[PAGE_DIM.height / 2.3, PAGE_DIM.height]}
          backgroundStyle={tw("rounded-3xl bg-gray-100")}
        >
          <BottomSheetScrollView style={tw("flex flex-col mx-8 mt-3")}>
            <View style={tw("flex flex-row items-center justify-between")}>
              <Text style={[tw("text-3xl text-indigo-900"), styles.fontStyle]}>
                {prodData?.data.name}
              </Text>
              <View style={tw("flex flex-row")}>
                <Icon name="star" type="antdesign" color="#F4E185" size={21} />
                <Text
                  style={[
                    tw("ml-2 text-base text-gray-400"),
                    styles.fontStylelite,
                  ]}
                >
                  (4.5)
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={[tw("text-lg text-indigo-900"), styles.fontStylelite]}
              >
                Built to save from dust, particles etc
              </Text>
            </View>
            <View>
              <Text
                style={[
                  tw("mt-6 text-base text-indigo-900"),
                  styles.fontStyleXlite,
                  { textAlign: "justify" },
                ]}
              >
                {prodData?.data.desc}
              </Text>
            </View>
            <Comments ProdID={ProdID} />
          </BottomSheetScrollView>
        </BottomSheet>
        <View
          style={[
            tw(
              "bg-white absolute bottom-0 flex flex-row justify-between px-6 py-4 w-full rounded-t-3xl"
            ),
            styles.shadow2,
          ]}
        >
          <View style={tw("flex flex-row items-center")}>
            <View style={tw("flex flex-row items-start")}>
              <Text
                style={[tw("text-base text-indigo-900"), styles.fontStylelite]}
              >
                ₹
              </Text>
              <Text style={[tw("text-3xl text-indigo-900"), styles.fontStyle]}>
                {prodData?.data.price}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => newMessage(prodData?.data.user)}
            style={tw("bg-yellow-400 p-3 rounded-2xl")}
          >
            <Text style={[tw("text-base text-indigo-900"), styles.fontStyle]}>
              Contact Seller
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
// ProductScreen.sharedElements = (route, otherNavigation, showing) => {
//   const items = route.params.images;
//   return [
//     {
//       id: `item.${items[0]}.img`,
//       animation: "fade",
//       //resize: 'clip',
//     },
//   ];
// };
export default ProductScreen;

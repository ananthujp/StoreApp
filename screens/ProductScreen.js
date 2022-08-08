import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Button,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import tw from "tailwind-rn";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./Styles";
//import { FlatList } from 'react-native-gesture-handler'
import { Image, Modal } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Comments from "./Comments";
import { SharedElement } from "react-navigation-shared-element";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/userAuth";
import { useNavigation } from "@react-navigation/core";
import UserProf from "./UserProf";
import { Rating } from "react-native-ratings";

const ProductScreen = ({ route }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const PAGE_DIM = Dimensions.get("window");
  const [prodData, setProdData] = useState();
  const [threads, setThread] = useState();
  const [rating, setRating] = useState(null);
  const [wish, setWish] = useState({ flag: false });
  //const ProdImages = route.params.images;
  const navigation = useNavigation();
  const ProdID = route.params.data;
  const { user, setStatusBar } = useAuth();
  const handleRating = () => {
    setModalVisible(!modalVisible);
    const rateings = (prodData?.data.ratings ? prodData?.data.ratings : 0) + 1;
    const rateing =
      ((prodData?.data.rating ? prodData?.data.rating : 0) * (rateings - 1) +
        rating) /
      rateings;
    rating &&
      updateDoc(
        doc(db, "Products", ProdID),
        { rating: rateing, ratings: rateings },
        { merge: true }
      );
  };
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
    user &&
      onSnapshot(
        query(
          collection(db, "Profiles", user.id, "Wishlist"),
          where("id", "==", ProdID)
        ),
        (dc) =>
          dc.docs.map((dic) => dic.id && setWish({ flag: true, id: dic.id }))
      );
  }, [user]);
  useEffect(() => {
    onSnapshot(doc(db, "Products", ProdID), (dc) =>
      setProdData({ id: dc.id, data: dc.data() })
    );
    setStatusBar({
      color: "white",
      content: "dark-content",
    });
    return () =>
      setStatusBar({
        color: "#4338ca",
        content: "light-content",
      });
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
  const addToWishlist = () => {
    !wish.flag
      ? addDoc(collection(db, "Profiles", user.id, "Wishlist"), { id: ProdID })
      : deleteDoc(doc(db, "Profiles", user.id, "Wishlist", wish.id)).then(() =>
          setWish({ flag: false })
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
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView>
      {/* <StatusBar animated barStyle="dark-content" backgroundColor="white" /> */}

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
            onPress={addToWishlist}
            style={tw(
              "flex flex-col items-center px-1 pt-2.5 h-10 w-10 rounded-full" +
                (wish.flag ? " bg-white" : " bg-red-600")
            )}
          >
            <Icon
              name="heart"
              type="antdesign"
              color={wish.flag ? "red" : "white"}
              size={20}
            />
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
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View
                  style={[
                    tw("mx-8 bg-white border border-yellow-400 rounded-lg"),
                    { marginTop: 0.45 * PAGE_DIM.height },
                  ]}
                >
                  <Rating
                    showRating
                    type="star"
                    imageSize={25}
                    onFinishRating={(e) => setRating(e)}
                    style={{ paddingVertical: 10 }}
                  />
                  <Button
                    onPress={() => handleRating()}
                    title="OK"
                    color="#FEC260"
                    accessibilityLabel="Learn more about this purple button"
                  />
                </View>
              </Modal>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={tw("flex flex-col items-end")}
              >
                <View style={tw("flex flex-row")}>
                  <Icon
                    name="star"
                    type="antdesign"
                    color="#F4E185"
                    size={21}
                  />
                  <Text
                    style={[
                      tw("ml-2 text-base text-gray-400"),
                      styles.fontStylelite,
                    ]}
                  >
                    (
                    {prodData?.data.rating
                      ? prodData?.data.rating.toFixed(1)
                      : 0}
                    )
                  </Text>
                </View>
                <Text
                  style={[
                    tw("ml-2 text-gray-400"),
                    styles.fontStylelite,
                    { fontSize: 10 },
                  ]}
                >
                  Total ratings :
                  {prodData?.data.ratings ? prodData?.data.ratings : 0}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={tw("flex flex-row items-center")}>
              <Icon name="place" type="material" color="red" size={20} />
              <Text
                style={[tw("text-lg text-indigo-900"), styles.fontStylelite]}
              >
                {prodData?.data.loc}
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
            {prodData?.data.user && <UserProf id={prodData.data.user} />}
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

import {
  View,
  Text,
  StatusBar,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  Button,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import tw from "tailwind-rn";
import { styles } from "./Styles";
import { SharedElement } from "react-native-shared-element";
import { ProdData } from "./Data";
import ProductCard from "./ProductCard";
import { Icon } from "react-native-elements";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Rating } from "react-native-ratings";
import useAuth from "../hooks/userAuth";
import { useNavigation } from "@react-navigation/core";
const StoreScreen = ({ route }) => {
  const data = route.params.data;
  const PAGE_DIM = Dimensions.get("window");
  const i = route.params.index;
  const [rating, setRating] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState();
  const [prodData, setProdData] = useState();
  const { setStatusBar, setPrompt, prompt } = useAuth();
  useEffect(() => {
    onSnapshot(doc(db, "Stores", data.ids), (dc) =>
      setProdData({ id: dc.id, data: dc.data() })
    );
  }, []);
  const handleRating = () => {
    setModalVisible(!modalVisible);
    const rateings = (prodData?.data.ratings ? prodData?.data.ratings : 0) + 1;
    const rateing =
      ((prodData?.data.rating ? prodData?.data.rating : 0) * (rateings - 1) +
        rating) /
      rateings;
    rating &&
      updateDoc(
        doc(db, "Stores", data.ids),
        { rating: rateing, ratings: rateings },
        { merge: true }
      );
  };
  useEffect(() => {
    //getDocs(query(collection(db, "Products"),where("user","in",["ckYRZEWlaqrlCIWNYAD2"]))).then((dc) =>
    data.storeID === "rs_store"
      ? getDocs(
          query(collection(db, "Products"), where("used", "in", [true]))
        ).then((dc) =>
          setProducts(
            dc.docs.map((dic) => ({
              id: dic.id,
              img: dic.data().images
                ? dic.data().images[0]
                : "https://thumbs.dreamstime.com/b/no-entry-entrance-sign-prohibition-restriction-road-signal-stock-vector-illustration-clip-art-graphics-235013463.jpg",
              title: dic.data().name,
              cost: dic.data().price,
              loc: dic.data().loc,
            }))
          )
        )
      : getDocs(
          query(collection(db, "Products"), where("user", "in", [data.storeID]))
        ).then((dc) =>
          setProducts(
            dc.docs.map((dic) => ({
              id: dic.id,
              img: dic.data().images
                ? dic.data().images[0]
                : "https://thumbs.dreamstime.com/b/no-entry-entrance-sign-prohibition-restriction-road-signal-stock-vector-illustration-clip-art-graphics-235013463.jpg",
              title: dic.data().name,
              cost: dic.data().price,
              loc: dic.data().loc,
            }))
          )
        );
  }, []);
  useLayoutEffect(() => {
    setStatusBar({
      color: "#f3f4f6",
      content: "dark-content",
    });
  }, []);
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        className="mr-auto ml-4 my-4"
        onPress={() => navigation.navigate("Home")}
      >
        <Icon
          name="arrowleft"
          type="antdesign"
          color={"gray"}
          style={tw(" text-gray-400 ml-2 mr-4")}
          size={25}
        />
      </TouchableOpacity>
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
      <View style={[tw("flex flex-row items-center")]}>
        <View style={[tw("flex flex-col px-4 py-4 w-3/4")]}>
          <Text style={[tw("text-3xl"), styles.fontStyle]}>{data.title}</Text>
          <Text style={[tw("text-4xl"), styles.fontStyle]}>
            {data.subtitle}
          </Text>

          {/* <View style={[tw("mt-2 w-24")]}>
            <Button
              onPress={() => setModalVisible(true)}
              title="Rate"
              color="#FEC260"
             
              accessibilityLabel="Learn more about this purple button"
            />
          </View> */}
          <View>
            <Text className="text-gray-500 text-xs">{prodData?.data.info}</Text>
          </View>
        </View>
        <SharedElement style={[tw(" w-1/4 -mx-4 mt-4")]} id={`item.${i}.store`}>
          <Image
            style={[tw("w-full h-32"), { resizeMode: "cover" }]}
            source={{ uri: data.logo }}
          />
        </SharedElement>
      </View>
      <ScrollView
        horizontal={true}
        className="flex flex-row  w-[90%] mx-auto px-4 border-y border-gray-300"
      >
        <TouchableOpacity
          onPress={() =>
            user ? setModalVisible(true) : navigation.navigate("Login")
          }
          style={tw(
            "flex flex-col my-2 items-center border-gray-300 pr-6 border-r  w-auto"
          )}
        >
          <View
            style={tw(
              "flex flex-row items-center justify-center bg-gray-600 px-1 w-16 py-2 rounded-lg"
            )}
          >
            <Text style={[tw("mr-1 text-white text-lg"), styles.fontStyle]}>
              {prodData?.data.rating ? prodData.data.rating.toFixed(1) : 0}
            </Text>
            <Icon name="star" type="antdesign" color="yellow" size={14} />
          </View>
          <Text style={[tw("text-xs mt-1"), styles.fontStylelite]}>
            (Total ratings {prodData?.data.ratings ? prodData.data.ratings : 0})
          </Text>
        </TouchableOpacity>

        {prodData?.data.website && (
          <TouchableOpacity
            onPress={() =>
              Linking.canOpenURL(prodData?.data.website).then(
                (dc) => dc && Linking.openURL(prodData?.data.website)
              )
            }
            className="flex flex-col px-6 my-2 border-gray-300 border-r w-auto"
          >
            <Icon name="language" type="material" color="gray" size={44} />
            <Text style={[tw("text-xs mt-1"), styles.fontStylelite]}>
              Website
            </Text>
          </TouchableOpacity>
        )}
        {prodData?.data.contact && (
          <TouchableOpacity
            onPress={() => Linking.openURL("tel:" + prodData?.data.contact)}
            className="flex flex-col px-6 my-2 border-gray-300 border-r w-auto"
          >
            <Icon name="call" type="material" color="gray" size={44} />
            <Text style={[tw("text-xs mt-1"), styles.fontStylelite]}>
              Contact
            </Text>
          </TouchableOpacity>
        )}
        {prodData?.data.moreinfo && (
          <TouchableOpacity
            onPress={() =>
              setPrompt({
                show: true,
                icon: "info",
                title: data.title + " : More info",
                subtitle: prodData?.data.moreinfo,
                function: () => setPrompt({ ...prompt, show: false }),
              })
            }
            className="flex flex-col px-6 my-2 border-gray-300 border-r w-auto"
          >
            <Icon name="info" type="material" color="gray" size={44} />
            <Text style={[tw("text-xs mt-1"), styles.fontStylelite]}>
              More info
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <ScrollView>
        <View
          style={[tw("px-4 py-4 w-full flex flex-row"), { flexWrap: "wrap" }]}
        >
          {products?.map((item, index) => {
            // <ProductCard data={item} i={index}/>
            return (
              <ProductCard data={item} i={index} key={`pdcard.${index}.cd`} />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default StoreScreen;

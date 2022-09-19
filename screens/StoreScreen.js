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
  const { setStatusBar } = useAuth();
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
    getDocs(
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
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={tw("flex flex-col")}
          >
            <View
              style={tw("flex flex-row bg-blue-300 px-1 w-12 rounded-full")}
            >
              <Text style={[tw("mr-1 text-white"), styles.fontStyle]}>
                {prodData?.data.rating ? prodData.data.rating.toFixed(1) : 0}
              </Text>
              <Icon name="star" type="antdesign" color="yellow" size={14} />
            </View>
            <Text style={[tw("mr-1 text-xs"), styles.fontStylelite]}>
              (Total ratings{" "}
              {prodData?.data.ratings ? prodData.data.ratings : 0})
            </Text>
          </TouchableOpacity>
          {/* <View style={[tw("mt-2 w-24")]}>
            <Button
              onPress={() => setModalVisible(true)}
              title="Rate"
              color="#FEC260"
             
              accessibilityLabel="Learn more about this purple button"
            />
          </View> */}
          <View>
            <Text>Store Info</Text>
          </View>
        </View>
        <SharedElement style={[tw(" w-1/4 -mx-4 mt-4")]} id={`item.${i}.store`}>
          <Image
            style={[tw("w-full h-32"), { resizeMode: "cover" }]}
            source={{ uri: data.logo }}
          />
        </SharedElement>
      </View>
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

import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Icon } from "react-native-elements";
import tw from "tailwind-rn";
import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/userAuth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import ListItemWishlist from "./ListItemWishlist";
const WishlistProfile = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const PAGE_DIM = Dimensions.get("window");

  const [productID, setProductID] = useState();
  useEffect(() => {
    user &&
      onSnapshot(collection(db, "Profiles", user?.id, "Wishlist"), (dc) => {
        setProductID(
          dc.docs.map((dic) => ({ id: dic.data().id, listID: dic.id }))
        );
      });
  }, [user]);

  //   useEffect(() => {
  //     productID &&
  //       setProducts(
  //         productID.map((dc) =>
  //           getDoc(doc(db, "Products", dc.id)).then((dl) => ({
  //             name: dl.data().name,
  //             img: dl.data().images
  //               ? dl.data().images[0]
  //               : "https://thumbs.dreamstime.com/b/no-entry-entrance-sign-prohibition-restriction-road-signal-stock-vector-illustration-clip-art-graphics-235013463.jpg",
  //           }))
  //         )
  //       );
  //     console.log(products);
  //   }, [productID]);
  return (
    <View
      style={tw("flex flex-col px-2 mt-2 rounded-md items-center")}
      height={PAGE_DIM.height - 350}
      width={PAGE_DIM.width}
    >
      <ScrollView style={tw("w-full")}>
        {productID?.map((dc, i) => (
          <ListItemWishlist
            item={dc.id}
            listID={dc.listID}
            key={`profile.wishlist.${i}`}
            //logo={dc.img}
            index={i}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default WishlistProfile;

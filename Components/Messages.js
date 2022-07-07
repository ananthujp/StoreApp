import { collection, getDocs, onSnapshot } from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { Dimensions, ScrollView, View } from "react-native";
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
  const PAGE_DIM = Dimensions.get("window");
  const [threads, setThread] = useState();
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

  return (
    <View
      style={tw("flex flex-col px-2 mt-2 rounded-md")}
      height={PAGE_DIM.height - 350}
      width={PAGE_DIM.width}
    >
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

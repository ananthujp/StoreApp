import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { styles } from "./Styles";
import tw from "tailwind-rn";
import Counter from "./Counter";
import ListItem from "./ListItem";
import { ProdData } from "./Data";
import { useNavigation } from "@react-navigation/core";
import ListItemOrder from "../Components/ListItemOrder";
import ListItemAds from "../Components/ListItemAds";
import ListItemWishlist from "../Components/ListItemWishlist";
import Messages from "./Messages";
import useAuth from "../hooks/userAuth";
const ITEMS = ["Item 1", "Item 2", "Item 3", "Item 4"];
const Profile = () => {
  const { user } = useAuth();
  const PAGE_DIM = Dimensions.get("window");
  const [tab, setTab] = useState(0);
  const navigation = useNavigation();
  const Tabs = [
    { name: "Messages", icon: "inbox", command: "message" },
    { name: "Orders", icon: "tag", command: "orders" },
    { name: "Ads", icon: "camera", command: "ads" },
    { name: "Wish list", icon: "smile", command: "wishlist" },
  ];
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
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const Backdrop = ({ scrollX }) => {
    return (
      <View style={tw("flex flex-row items-center")}>
        {Tabs.map((dc, i) => {
          const inputRange = [
            (i - 1) * PAGE_DIM.width,
            i * PAGE_DIM.width,
            (i + 1) * PAGE_DIM.width,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [46, 150, 46],
            extrapolate: "clamp",
          });
          const bgColor = scrollX.interpolate({
            inputRange,
            outputRange: [
              "rgba(255,255,255,0.5)",
              "rgb(255,255,255)",
              "rgba(255,255,255,0.5)",
            ],
            extrapolate: "clamp",
          });
          return (
            <TouchableOpacity
              onPress={() =>
                flatListRef.current.scrollToIndex({
                  animated: true,
                  index: i,
                })
              }
            >
              <Animated.View
                key={`bd1.${i}.element`}
                style={[
                  tw("flex mx-1 h-12  rounded-full"),
                  { width: scale },
                  { backgroundColor: bgColor },
                ]}
              >
                <Counter icon={dc.icon} text={dc.name} count="03" />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View>
      <View
        style={tw(
          "flex flex-row justify-between w-full items-center px-6 py-2"
        )}
      >
        <View style={tw("flex flex-row items-center")}>
          <Avatar
            rounded
            size={50}
            source={{
              uri: user ? user.dp : "",
            }}
          />
          <Text style={[styles.fontStyle, tw("ml-4 text-lg text-white")]}>
            Hi {user?.name}!
          </Text>
        </View>
        <Icon
          name="setting"
          type="antdesign"
          color="white"
          onPress={() => navigation.navigate("Login")}
        />
      </View>
      <View style={tw("flex w-full items-center")}>
        <Backdrop scrollX={scrollX} />
      </View>
      <View style={tw("flex flex-col items-center")}>
        <View style={[tw(""), { width: PAGE_DIM.width, overflow: "hidden" }]}>
          <Animated.FlatList
            horizontal
            data={Tabs}
            ref={flatListRef}
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
              switch (item.command) {
                case "message":
                  return <Messages />;
                  break;
                case "orders":
                  return (
                    <View
                      style={tw("flex flex-col px-2 mt-2 rounded-md")}
                      height={PAGE_DIM.height - 350}
                      width={PAGE_DIM.width}
                    >
                      <ScrollView style={tw("flex w-full")}>
                        {Orders.orders.map((doc, i) => (
                          <ListItemOrder
                            key={`orders.list.${i}`}
                            item={doc.title}
                            logo={doc.logo}
                            category={doc.category}
                            moreInfo={Orders.moreInfoIcon}
                          />
                        ))}
                      </ScrollView>
                    </View>
                  );
                  break;
                case "ads":
                  return (
                    <View
                      style={tw("flex flex-col px-2 mt-2 rounded-md")}
                      height={PAGE_DIM.height - 350}
                      width={PAGE_DIM.width}
                    >
                      <ScrollView style={tw("flex w-full")}>
                        {Orders.orders.map((doc, i) => (
                          <ListItemAds
                            key={`orders.list.${i}`}
                            item={doc.title}
                            logo={doc.logo}
                            category={doc.category}
                            moreInfo={Orders.moreInfoIcon}
                          />
                        ))}
                      </ScrollView>
                    </View>
                  );
                  break;
                case "wishlist":
                  return (
                    <View
                      style={tw("flex flex-col px-2 mt-2 rounded-md")}
                      height={PAGE_DIM.height - 350}
                      width={PAGE_DIM.width}
                    >
                      <ScrollView style={tw("flex w-full")}>
                        {Orders.orders.map((doc, i) => (
                          <ListItemWishlist
                            key={`orders.list.${i}`}
                            item={doc.title}
                            logo={doc.logo}
                            category={doc.category}
                            moreInfo={Orders.moreInfoIcon}
                          />
                        ))}
                      </ScrollView>
                    </View>
                  );
                  break;
                default:
              }
            }}
          />
        </View>
      </View>
      {/* 
      <View style={tw("flex flex-row justify-between w-full px-2 mt-4")}>
        <TouchableOpacity onPress={() => setTab(0)}>
          <Counter
            selection={tab === 0 ? true : false}
            icon="inbox"
            text="Messages"
            count="03"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab(1)}>
          <Counter
            selection={tab === 1 ? true : false}
            icon="tag"
            text="Orders"
            count="03"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab(2)}>
          <Counter
            selection={tab === 2 ? true : false}
            icon="camera"
            text="Ads"
            count="12"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab(3)}>
          <Counter
            selection={tab === 3 ? true : false}
            icon="smile"
            text="Wish list"
            count="51"
          />
        </TouchableOpacity>
      </View> */}
      {/* <View
        style={tw("flex flex-col mx-2 mt-2 rounded-md")}
        height={PAGE_DIM.height - 350}
      >
        <View>
          {ITEMS.map((doc) => (
            <ListItem item={doc} moreInfo={Orders.moreInfoIcon} />
          ))}
        </View>
      </View> */}
    </View>
  );
};

export default Profile;

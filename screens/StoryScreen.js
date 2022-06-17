import {
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Animated,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import tw from "tailwind-rn";
import { SharedElement } from "react-navigation-shared-element";
import { styles } from "./Styles";
import * as Animatable from "react-native-animatable";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const StoryScreen = ({ navigation, route }) => {
  const [id, setId] = useState(route.params.item);
  const items = route.params.items;
  //const id = route.params.id;
  const PAGE_DIM = Dimensions.get("window");
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  return (
    <SafeAreaView>
      <View style={tw("flex bg-transparent h-full")}>
        <StatusBar
        //animated
        // barStyle="light-content"
        // backgroundColor="black"
        //translucent backgroundColor="transparent"
        />
        <Animatable.View
          animation="fadeInDown"
          delay={600}
          style={[
            tw(
              "absolute top-0 items-center w-full rounded-b-xl bg-purple-600 py-2"
            ),
            { zIndex: 4 },
          ]}
        >
          <ScrollView horizontal={true} style={{ width: "50%" }}>
            <View
              style={[tw("flex flex-row h-12 items-center"), { zIndex: 40 }]}
            >
              {Object.keys(items).map((_, i) => {
                const inputRange = [
                  (i - 1) * PAGE_DIM.height,
                  i * PAGE_DIM.height,
                  (i + 1) * PAGE_DIM.height,
                ];
                const scale = scrollY.interpolate({
                  inputRange,
                  outputRange: [28, 46, 28],
                  extrapolate: "clamp",
                });

                return (
                  <TouchableOpacity
                    key={`bdi.${i}.element`}
                    onPress={() =>
                      flatListRef.current.scrollToIndex({
                        animated: true,
                        index: i,
                      })
                    }
                  >
                    <Animated.View
                      style={[
                        tw(
                          "flex bg-blue-200 border-white border-2 h-2 rounded-full mx-1"
                        ),
                        { width: scale, height: scale },
                      ]}
                    >
                      <Image
                        style={tw("h-full w-full rounded-full ")}
                        source={{ uri: items[Object.keys(items)[i]].img }}
                      />
                    </Animated.View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </Animatable.View>
        <Animatable.View
          animation="fadeInUp"
          delay={800}
          style={[tw("absolute bottom-16 p-4 w-full"), { zIndex: 20 }]}
        >
          {/* <View style={tw('flex flex-row')}> */}
          {Object.keys(items).map((_, i) => {
            const inputRange = [
              (i - 1) * PAGE_DIM.height,
              i * PAGE_DIM.height,
              (i + 1) * PAGE_DIM.height,
            ];
            const opacity = scrollY.interpolate({
              inputRange,
              outputRange: [0, 1, 0],
              extrapolate: "clamp",
            });
            const translY = scrollY.interpolate({
              inputRange,
              outputRange: [-80, -25, 80],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={`det.${i}.element`}
                style={[
                  tw("absolute flex flex-col mx-6 -mt-6"),
                  {
                    width: "95%",
                    opacity: opacity,
                    transform: [{ translateY: translY }],
                  },
                ]}
              >
                <Text style={[tw("text-white text-lg"), styles.fontStyle]}>
                  {items[Object.keys(items)[i]].txt}
                </Text>
                <ScrollView style={{ height: "10%" }}>
                  <Text
                    style={[
                      tw("text-white text-sm text-justify overflow-hidden"),
                      styles.fontStylelite,
                    ]}
                  >
                    {items[Object.keys(items)[i]].dt}
                  </Text>
                </ScrollView>
                <View style={tw("flex flex-row mt-1 justify-evenly")}>
                  <View style={tw("bg-white p-2 rounded-xl")}>
                    <Text>View More</Text>
                  </View>
                  <View style={tw("bg-white p-2 w-20 rounded-xl")}>
                    <Text style={tw("text-center")}>Buy</Text>
                  </View>
                </View>
              </Animated.View>
            );
          })}

          {/* </View> */}
        </Animatable.View>

        <View
          style={[tw("flex"), { height: PAGE_DIM.height, overflow: "hidden" }]}
        >
          <Animated.FlatList
            initialScrollIndex={id}
            ref={flatListRef}
            data={Object.keys(items)}
            keyExtractor={(_, index) => index.toString()}
            snapToInterval={PAGE_DIM.height}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            renderItem={({ item }) => {
              return (
                <SharedElement id={`item.${items[item].id}.img`}>
                  <Image
                    style={{
                      height: PAGE_DIM.height,
                      width: PAGE_DIM.width,
                      resizeMode: "cover",
                    }}
                    source={{ uri: items[item].img }}
                  />
                </SharedElement>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
StoryScreen.sharedElements = (route, otherNavigation, showing) => {
  const id = route.params.item;
  return [
    {
      id: `item.${id}.img`,
      animation: "fade",
      //resize: 'clip',
    },
  ];
};
export default StoryScreen;

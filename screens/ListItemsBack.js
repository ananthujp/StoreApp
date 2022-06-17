import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import React from "react";
import tw from "tailwind-rn";
import { styles } from "./Styles";
import { Icon } from "react-native-elements/dist/icons/Icon";
const ListItem = ({ item, moreInfo }) => {
  const PAGE_DIM = Dimensions.get("window");
  const translateX = useSharedValue(0);
  //const rheight = useSharedValue(64);
  const [exp, setExp] = React.useState(false);
  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX;
    },
    onEnd: (event, context) => {
      const shouldBeDismissed = translateX.value < -PAGE_DIM.width * 0.3;
      if (translateX.value < -PAGE_DIM.width * 0.3) {
        translateX.value = withTiming(-PAGE_DIM.width);
        //rheight.value = withTiming(0);
      } else {
        translateX.value = withTiming(0);
      }
    },
  });
  const rstyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  //   const rheightstyle = useAnimatedStyle(() => {
  //     return {
  //       height: rheight.value,
  //     };
  //   });
  return (
    <TouchableOpacity onPress={() => setExp(!exp)}>
      <PanGestureHandler
        onGestureEvent={panGestureEvent}
        style={tw("flex flex-col")}
      >
        <Animated.View
          style={[
            tw("bg-gray-200 rounded-xl my-1 py-2 px-4 flex flex-col"),
            rstyle,
            //rheightstyle,
          ]}
        >
          <View style={tw("flex flex-row justify-between ")}>
            <View style={tw("flex flex-row items-start")}>
              <View style={tw("flex w-10 h-10 bg-black")}></View>
              <View style={tw("flex flex-col items-start ml-2")}>
                <Text style={[styles.fontStyle, tw(" text-center")]}>
                  {item}
                </Text>
                <Text
                  style={[styles.fontStyleXlite, tw(" text-center text-xs")]}
                >
                  {item}
                </Text>
                {exp && (
                  <View style={tw("flex flex-row items-start mt-2")}>
                    {moreInfo.map((dc, i) => (
                      <TouchableOpacity
                        key={`info.${item}.icon.${i}`}
                        onPress={() => dc.function(item)}
                      >
                        <Icon
                          name={dc.icon}
                          type="antdesign"
                          color={"gray"}
                          size={24}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
            <View style={tw("flex w-8 h-8 bg-black")}></View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </TouchableOpacity>
  );
};

export default ListItem;

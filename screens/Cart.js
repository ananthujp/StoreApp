import { StyleSheet, Text, View ,Button,TouchableOpacity,Dimensions} from 'react-native'
import React from 'react'
import tw from 'tailwind-rn'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {useAnimatedGestureHandler, useAnimatedStyle, useSharedValue,withSpring} from 'react-native-reanimated'
const Cart = () => {
    const onPressLearnMore=()=>{
        console.log("Touch test")
    }
    const PAGE_DIM =Dimensions.get('window')
    const translateY = useSharedValue(0)
    const panGestureEvent = useAnimatedGestureHandler({
        onStart: (event,context) => {
            context.translateY =translateY.value;
        },
        onActive: (event,context) => {
            translateY.value = event.translationY + context.translateY;
        },
        onEnd: (event,context) => {
            if(event.translationY < 0){
                translateY.value = withSpring(-(PAGE_DIM.height * 0.75))
            }
            else{
                translateY.value = withSpring(-(PAGE_DIM.height * 0.25))
            }
        }
    })
    const rstyle = useAnimatedStyle(()=>{
        return(
            {
                height: 20-translateY.value,
            }
        )
    })
    return (
        <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={[tw('absolute flex items-center bg-purple-200 h-32 rounded-t-2xl bottom-5 w-full'),rstyle]}>

            
          <Animated.View style={tw('w-12 h-2 rounded-2xl flex bg-gray-400 mt-2')}></Animated.View>

            <Button
             style={tw('flex pt-12')}
             onPress={onPressLearnMore}
            title="Learn More"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
            />

        </Animated.View>
          </PanGestureHandler>
    )
}

export default Cart

const styles = StyleSheet.create({})

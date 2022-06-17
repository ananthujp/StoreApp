import { View, Text } from 'react-native'
import React from 'react'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { enableScreens } from 'react-native-screens';
import HomeScreen from './screens/HomeScreen'
import ChatScreen from './screens/ChatScreen'
import ProductScreen from './screens/ProductScreen';
import StoryScreen from './screens/StoryScreen';
import Login from './screens/Login'
import useAuth from './hooks/userAuth'
import { NavigationContainer } from '@react-navigation/native';
const Stack = createSharedElementStackNavigator ();
enableScreens();
const StackNavigator = () => {
    const {user} =useAuth();
    return (
    //    <NavigationContainer independent={true}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
        {user?(<>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            
    </>):
            //<Stack.Screen name="Login" component={Login} />}
            <><Stack.Screen name="Login" component={HomeScreen} />
            <Stack.Screen name="ProductScreen" component={ProductScreen} options={({ route }) => ({ title: route.params.name })}/>
            <Stack.Screen name="StoryScreen" component={StoryScreen} options={({ route }) =>  ({ image: route.params.image,text: route.params.text,id: route.params.id })}
                    // sharedElements={ (route) =>{

                        
                    //      return [
                    // //         {
                    // //         id: `item.${route.params.id}.photo`,
                    // //         animation: 'move',
                    // //         resize: 'clip'
                    // //         }
                    //      {id: route.params.item.id}];
                    //  }}
                    />
            </>
            }
            
        </Stack.Navigator>
        
    )
}

export default StackNavigator

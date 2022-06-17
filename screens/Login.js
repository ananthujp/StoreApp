import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import tw from 'tailwind-rn'
import useAuth from '../hooks/userAuth'
//import LowNav from '../LowNav'
import Cart from './Cart'
import List from './List'
const Login = () => {
    const  {signInWithGoogle}=useAuth();
 
    return (
        <View style={tw('h-full')}>
 
        <TouchableOpacity  onPress={signInWithGoogle} style={tw('flex items-center mt-4')}>
        <View style={tw('bg-purple-800 flex w-24 items-center px-4 py-1 rounded-2xl')}>
            <Text style={tw('text-white text-center')}>
                Login
            </Text>
        </View>
        <Text style={tw('text-center')}>
                Login
            </Text>
            <Text style={{fontFamily: 'Gilroy'}}>
                Login
            </Text>
        </TouchableOpacity>
        <Cart/>
        </View>
    )
}

export default Login

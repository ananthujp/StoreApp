import { StyleSheet, Text, View,TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import CommentItem from './CommentItem'
import tw from 'tailwind-rn'
import { Icon } from 'react-native-elements'

const DATA=[
        {
            id:0, 
            name: 'Eilish', 
            comment: 'Beatiful Product!', 
            image: 'https://www.pinkvilla.com/imageresize/rashmika_mandanna_diwali_selfies_2.jpg?width=752&format=webp&t=pvorg'
        },
        {
            id:1, 
            name: 'Hannah', 
            comment: 'Awesome! Loved It!', 
            image: 'https://c.ndtvimg.com/2021-06/hgkqh1r_kajal-aggarwal_295x200_04_June_21.jpg'
        },
    ]
const Comments = () => {
    return (
        <View>
            <View style={tw('mt-4')}>
                <Text style={[tw('text-lg text-indigo-900'),styles.fontStylelite]}>Wanna ask something ?</Text>
            </View>
            <View style={tw('flex flex-row items-center mt-2')}>
                <TextInput style={tw('bg-indigo-100 text-lg py-3 px-4 w-full rounded-xl')}/>
                
                <TouchableOpacity style={tw('bg-indigo-300 h-9 w-9 -ml-11 rounded-lg items-center')}>
                    <Icon 
                        name='paper-plane'
                        type='entypo'
                        color='white'
                        size={22}
                        style={tw('mt-1.5')}
                    />
                </TouchableOpacity>
            </View>
            {DATA.map((doc)=>
            <CommentItem key={doc.id} name={doc.name} comment={doc.comment} image={doc.image} />)}
        </View>
    )
}

export default Comments

const styles = StyleSheet.create({})

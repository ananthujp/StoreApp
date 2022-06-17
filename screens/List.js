import { StyleSheet, Text, View } from 'react-native'
import React from "react"
import ListItem  from "./ListItem"
const List = () => {
    const ITEMS=["Item 1","Item 2","Item 3","Item 4"]
    return (
        <View>
        {ITEMS.map((doc)=> 
        <ListItem item={doc}/>
        )}
            
        </View>
    )
}

export default List

const styles = StyleSheet.create({})

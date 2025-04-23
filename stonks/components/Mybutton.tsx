import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface MybuttonProps {
  title: string;
  OnPress: () => void;
}

const Mybutton: React.FC<MybuttonProps> = ({ title, OnPress }) => {
  return (
    // <View>
    //     <Button title={props.title || "Default Title"} onPress={props.onPress || (() => alert("Button Pressed!"))} />
    // </View>
    <TouchableOpacity activeOpacity={0.8} style={style.button} onPress={OnPress}>
        <Text style={style.text}>{title}</Text>
    </TouchableOpacity>
  )
}
const style = StyleSheet.create({
    button:{
        backgroundColor:"orange",
        paddingVertical:10,
        borderRadius:15,
        alignItems:"center"
    },
    text:{
        fontSize:16,
        color:"white",
        fontWeight:700,
    }
})
export default Mybutton

import Mybutton from '@/components/Mybutton';
import { useRouter } from 'expo-router';
import React from 'react'
import { View, Text, TextInput } from 'react-native'

const Login = () => {
    const [Email, setEmail] = React.useState("");
    const [Password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: Email,
                    password: Password,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                // Handle successful login
                console.log('Login successful:', data);
            } else {
                // Handle login error
                console.error('Login failed:', data);
            }
        } catch (error) {
            console.error('Error during login:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const route = useRouter();
    const OnContinue = () =>{
      route.navigate("/signup");
    }
    return (
      <View
        style={{
          flex:1,
        }}
      >
        <View style={{padding:20, gap:20}}>
            <TextInput placeholder='Enter Your Email' style={{borderWidth:1,paddingHorizontal:20}} onChangeText={(text) => setEmail(text)}/>
            <TextInput secureTextEntry={true} placeholder='Enter Your Password' style={{borderWidth:1,paddingHorizontal:20}} onChangeText={(text) => setPassword(text)}/>
            <Mybutton title={"Login"} OnPress={handleLogin}/>
        </View>
        
      </View>
    )
}

export default Login

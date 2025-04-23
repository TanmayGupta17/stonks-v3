import Mybutton from '@/components/Mybutton';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async () => {
        setIsLoading(true);
        try {
            console.log('username:', username);
            console.log('email:', email);   
            const response = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username : username,
                    email: email,
                    password: password,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                // Handle successful login
                console.log('signup successful:', data);
            } else {
                // Handle login error
                console.error('signup failed:', data);
            }
        } catch (error) {
            console.error('Error during signup:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}

            <TextInput 
                placeholder='Enter Your Name' 
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />
            <TextInput 
                placeholder='Enter Your Email' 
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput 
                secureTextEntry={true} 
                placeholder='Enter Your Password' 
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />
            <Mybutton 
                title={isLoading ? "Signing up..." : "Signup"} 
                OnPress={isLoading ? () => {} : handleSignup}
            />
            {isLoading && <ActivityIndicator style={styles.loader} color="#0000ff" />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 20,
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        fontSize: 16,
    },
    errorContainer: {
        backgroundColor: '#FF4444',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
    },
    loader: {
        marginTop: 10,
    },
});

export default Signup;

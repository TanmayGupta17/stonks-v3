import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthMode = "login" | "signup";

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
  };

  const handleAuth = async () => {
    if (!email || !password || (mode === "signup" && !username)) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");
    console.log("asdsadasdasdasdasdasdasdasdasdasdasd");
    console.log("email:", email);
    try {
      const response = await fetch('http://localhost:3000/api/auth/' + (mode === 'login' ? 'login' : 'signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          ...(mode === 'signup' && { username }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store the token and user data using AsyncStorage
      // console.log(data.token + " tanmay")
      await AsyncStorage.setItem('token', "shivam");
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      if (mode === 'login') {
        router.push('/main2');
      } else {
        router.push('/onboarding');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'An error occurred during authentication');
      Alert.alert('Error', error.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
        console.log('username:', username);
        console.log('email:', email);   
        const response = await fetch('http://192.168.247.175:3000/api/auth/signup', {
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
            router.push('/onboarding');
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

const handleLogin = async () => {
  setIsLoading(true);
  try {
      console.log('username:', username);
      console.log('email:', email);   
      const response = await fetch('http://192.168.247.175:3000/api/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: email,
              password: password,
          }),
      });
      const data = await response.json();
      if (response.ok) {
          // Handle successful login
          console.log('signup successful:', data);
          
          router.push('/main2');

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={["#0a2e38", "#000000"]}
          style={styles.background}
        >
          <View style={styles.logoContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="trending-up" size={40} color="#58CC02" />
            </View>
            <Text style={styles.logoText}>STONKS</Text>
            <Text style={styles.tagline}>Learn Stock Market Concepts</Text>
            <Text style={styles.subTagline}>
              The fun way to become a trading expert!
            </Text>
          </View>

          <View style={styles.formContainer}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {mode === "signup" && (
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={24}
                  color="#58CC02"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#6B7280"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={24}
                color="#58CC02"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#6B7280"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="#58CC02"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#6B7280"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {mode === "login" && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.authButton, isLoading && styles.authButtonDisabled]} 
              onPress={mode === "login" ? handleLogin : handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#0D2535" />
              ) : (
                <>
                  <Text style={styles.authButtonText}>
                    {mode === "login" ? "START INVESTING" : "SIGN UP"}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#0D2535" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {mode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={styles.toggleButton}>
                  {mode === "login" ? "Sign Up" : "Login"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#0D2535",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#1A3A52",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginBottom: 5,
  },
  subTagline: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A3A52",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    height: "100%",
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#58CC02",
    fontSize: 14,
  },
  authButton: {
    backgroundColor: "#58CC02",
    borderRadius: 10,
    height: 55,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  authButtonText: {
    color: "#0D2535",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleText: {
    color: "#94A3B8",
    fontSize: 14,
    marginRight: 5,
  },
  toggleButton: {
    color: "#58CC02",
    fontSize: 14,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#1A3A52",
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#2D4A63",
  },
  footerText: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  errorContainer: {
    backgroundColor: '#FF4444',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
});

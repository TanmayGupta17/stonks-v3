import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

export default function IndexPage() {
  const router = useRouter();

  const stocks = [
    { name: "NIFTY", price: "22,500" },
    { name: "TCS", price: "3,900" },
    { name: "RELIANCE", price: "2,850" },
    { name: "INFY", price: "1,500" },
    { name: "HDFC", price: "2,700" },
  ];

  const walletBalance = 5000;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* App Title */}
        <Text style={styles.heading}>Stonks</Text>

        {/* Scrolling Stock Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.stockBar}
        >
          {stocks.map((stock, index) => (
            <View key={index} style={styles.stockItem}>
              <Text style={styles.stockText}>
                {stock.name}: ₹{stock.price}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Wallet */}
        <View style={styles.walletContainer}>
          <Text style={styles.walletText}>
            Wallet Balance: ₹{walletBalance}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/Game")}
          >
            <Text style={styles.buttonText}>Graph Game</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#16a085" }]}
            onPress={() => router.push("/quiz")}
          >
            <Text style={styles.buttonText}>Stock Selection</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={[styles.button, {backgroundColor: '#f39c12'}]} onPress={() => router.push('/BullishBearish')}>
            <Text style={styles.buttonText}>Bullish / Bearish</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, {backgroundColor: '#8e44ad'}]} onPress={() => router.push('/CurrentGame')}>
            <Text style={styles.buttonText}>Current Game</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#121212", // Consistent background color for the entire screen
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 1,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00ff9d",
    textAlign: "center",
    marginBottom: 10,
  },
  stockBar: {
    backgroundColor: "#000",
  },
  stockItem: {
    marginHorizontal: 15,
  },
  stockText: {
    color: "#00ff9d",
    fontWeight: "bold",
    fontSize: 16,
  },
  walletContainer: {
    backgroundColor: "#00ff9d",
    padding: 15,
    margin: 15,
    borderRadius: 10,
    elevation: 5,
  },
  walletText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  button: {
    width: Dimensions.get("window").width * 0.8,
    paddingVertical: 15,
    borderRadius: 15,
    elevation: 5,
    backgroundColor: "#2980b9",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

interface StockPrice {
  name: string;
  price: string;
  change: number;
}

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [stockPrices, setStockPrices] = useState<StockPrice[]>([
    { name: "NIFTY", price: "₹22,500", change: 0.8 },
    { name: "TCS", price: "₹3,900", change: 1.2 },
    { name: "RELIANCE", price: "₹2,850", change: -0.5 },
    { name: "INFY", price: "₹1,840", change: 0.3 },
    { name: "HDFC", price: "₹1,650", change: -0.2 },
    { name: "WIPRO", price: "₹420", change: 1.5 },
    { name: "TATAMOTORS", price: "₹780", change: 2.1 },
    { name: "ICICI", price: "₹950", change: 0.7 },
  ]);

  const [scrollX, setScrollX] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(5000);
  const [trending, setTrending] = useState<StockPrice[]>([
    { name: "TATASTEEL", price: "₹132", change: 3.2 },
    { name: "BAJAJ", price: "₹756", change: 2.8 },
    { name: "AIRTEL", price: "₹892", change: 1.9 },
  ]);

  // Auto scroll the marquee
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollX((prev) => prev + 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const navigateToQuiz = () => {
    // Navigate to the quiz screen
    // navigation.navigate('StockQuiz');
    console.log("Navigating to Quiz...");
  };

  const navigateToGraphGame = () => {
    console.log("Navigating to Graph Game...");
  };

  const navigateToStockSelection = () => {
    console.log("Navigating to Stock Selection...");
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0a2e38", "#000000"]} style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Stonks</Text>
          <FontAwesome5 name="bell" size={22} color="#58cc02" />
        </View>

        {/* Marquee Ticker */}
        <View style={styles.tickerContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            contentOffset={{ x: scrollX, y: 0 }}
            contentContainerStyle={{ paddingRight: 800 }}
          >
            {stockPrices.map((stock, index) => (
              <View key={index} style={styles.tickerItem}>
                <Text style={styles.tickerName}>{stock.name}: </Text>
                <Text style={styles.tickerPrice}>{stock.price} </Text>
                <Text
                  style={[
                    styles.tickerChange,
                    { color: stock.change >= 0 ? "#58cc02" : "#ff4040" },
                  ]}
                >
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change}%
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Market Overview */}
        <View style={styles.marketOverview}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Market Overview</Text>
            <Text style={styles.dateText}>April 10, 2025</Text>
          </View>

          <View style={styles.marketStats}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>21,432</Text>
              <Text style={styles.statLabel}>SENSEX</Text>
              <Text style={[styles.statChange, { color: "#58cc02" }]}>
                +1.2%
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>8,742</Text>
              <Text style={styles.statLabel}>NIFTY BANK</Text>
              <Text style={[styles.statChange, { color: "#ff4040" }]}>
                -0.3%
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>₹82.4</Text>
              <Text style={styles.statLabel}>USD/INR</Text>
              <Text style={[styles.statChange, { color: "#58cc02" }]}>
                +0.1%
              </Text>
            </View>
          </View>
        </View>

        {/* Wallet Balance */}
        <TouchableOpacity style={styles.walletBalance}>
          <View style={styles.walletContent}>
            <FontAwesome5
              name="wallet"
              size={18}
              color="#0a2e38"
              style={styles.walletIcon}
            />
            <Text style={styles.walletText}>
              Wallet Balance: ₹{walletBalance}
            </Text>
          </View>
          <FontAwesome5 name="plus-circle" size={18} color="#0a2e38" />
        </TouchableOpacity>

        {/* Trending Stocks */}
        <View style={styles.trendingSection}>
          <Text style={styles.trendingTitle}>Trending Today</Text>
          <View style={styles.trendingList}>
            {trending.map((stock, index) => (
              <TouchableOpacity key={index} style={styles.trendingItem}>
                <View style={styles.stockIconContainer}>
                  <FontAwesome5 name="chart-line" size={16} color="#fff" />
                </View>
                <View style={styles.stockInfo}>
                  <Text style={styles.stockName}>{stock.name}</Text>
                  <Text style={styles.stockPrice}>{stock.price}</Text>
                </View>
                <Text
                  style={[
                    styles.stockChange,
                    { color: stock.change >= 0 ? "#58cc02" : "#ff4040" },
                  ]}
                >
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#2389da" }]}
            onPress={() => router.push("/game")}
          >
            <FontAwesome5
              name="chart-area"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Graph Game</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#1ea896" }]}
            onPress={() => router.push("/selection")}
          >
            <FontAwesome5
              name="search-dollar"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Stock Selection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#58cc02" }]}
            onPress={() => router.push("/quiz")}
          >
            <FontAwesome5
              name="brain"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Stock Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#e82cc1" }]}
            onPress={() => router.push("/news")}
          >
            <FontAwesome5
              name="brain"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Stock News</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#112eca" }]}
            onPress={() => router.push("/match")}
          >
            <FontAwesome5
              name="match"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Match the Keyword</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerTab}>
            <FontAwesome5 name="home" size={20} color="#58cc02" />
            <Text style={[styles.footerTabText, { color: "#58cc02" }]}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/simulator")}
            style={styles.footerTab}
          >
            <FontAwesome5 name="chart-bar" size={20} color="#a3c2cd" />
            <Text style={styles.footerTabText}>Markets</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/pathway")}
            style={styles.footerTab}
          >
            <FontAwesome5 name="book" size={20} color="#a3c2cd" />
            <Text style={styles.footerTabText}>Learn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/profile")}
            style={styles.footerTab}
          >
            <FontAwesome5 name="user" size={20} color="#a3c2cd" />
            <Text style={styles.footerTabText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#58cc02",
  },
  tickerContainer: {
    backgroundColor: "#0c1e24",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1a3540",
  },
  tickerItem: {
    flexDirection: "row",
    marginRight: 20,
  },
  tickerName: {
    color: "#a3c2cd",
    fontWeight: "bold",
  },
  tickerPrice: {
    color: "#ffffff",
  },
  tickerChange: {
    fontWeight: "bold",
  },
  marketOverview: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  dateText: {
    fontSize: 14,
    color: "#a3c2cd",
  },
  marketStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    backgroundColor: "#1a3540",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "30%",
  },
  statValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#a3c2cd",
    fontSize: 12,
    marginVertical: 4,
  },
  statChange: {
    fontSize: 14,
    fontWeight: "bold",
  },
  walletBalance: {
    backgroundColor: "#58cc02",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletIcon: {
    marginRight: 10,
  },
  walletText: {
    color: "#0a2e38",
    fontSize: 18,
    fontWeight: "bold",
  },
  trendingSection: {
    padding: 20,
  },
  trendingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  trendingList: {
    marginBottom: 10,
  },
  trendingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a3540",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  stockIconContainer: {
    backgroundColor: "#2c6b7b",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stockInfo: {
    flex: 1,
  },
  stockName: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  stockPrice: {
    color: "#a3c2cd",
    fontSize: 14,
  },
  stockChange: {
    fontWeight: "bold",
    fontSize: 16,
  },
  navigationButtons: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "#0c1e24",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#1a3540",
    marginTop: "auto",
  },
  footerTab: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  footerTabText: {
    color: "#a3c2cd",
    fontSize: 12,
    marginTop: 5,
  },
});

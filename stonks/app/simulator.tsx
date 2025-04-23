import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView as RNScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { PieChart as ChartPie } from "react-native-chart-kit"; // Import the PieChart component

export default function SimulatorPage() {
  const router = useRouter();

  // Define the stocks array with proper typing
  const stocks: { name: string; price: string }[] = [
    { name: "NIFTY", price: "22,500" },
    { name: "TCS", price: "3,900" },
    { name: "RELIANCE", price: "2,850" },
    { name: "INFY", price: "1,500" },
    { name: "HDFC", price: "2,700" },
  ];

  const walletBalance = 5000;

  // Portfolio state for the simulator
  const [portfolio, setPortfolio] = useState([
    { name: "TCS", shares: 5, buyPrice: 3500, currentPrice: 3900 },
    { name: "RELIANCE", shares: 3, buyPrice: 2700, currentPrice: 2850 },
    { name: "INFY", shares: 10, buyPrice: 1400, currentPrice: 1500 },
  ]);

  const [cash, setCash] = useState(5000);

  // Calculate portfolio value
  const portfolioValue = portfolio.reduce(
    (total, stock) => total + stock.shares * stock.currentPrice,
    0
  );

  // Calculate portfolio distribution for pie chart
  //   const portfolioDistribution = portfolio.map((stock) => ({
  //     value: stock.shares * stock.currentPrice,
  //     color: getRandomColor(stock.name), // Function to generate consistent colors
  //     label: stock.name,
  //   }));

  const portfolioDistribution = portfolio.map((stock) => ({
    name: stock.name,
    population: stock.shares * stock.currentPrice, // Use 'population' instead of 'value'
    color: getRandomColor(stock.name),
    legendFontColor: "#FFFFFF", // Add this for legend text color
    legendFontSize: 15, // Add this for legend font size
  }));

  // Add cash to distribution
  portfolioDistribution.push({
    name: "Cash", // Instead of 'label'
    population: cash, // Instead of 'value'
    color: "#ffa502",
    legendFontColor: "#FFFFFF", // Add this
    legendFontSize: 15, // Add this
  });

  // Function to get a color based on stock name (for consistency)
  function getRandomColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = "#" + (hash & 0x00ffffff).toString(16).padStart(6, "0");
    return color;
  }

  return (
    <RNScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* App Title */}
        <Text style={styles.heading}>Stock Market Simulator</Text>

        {/* Pie Chart */}
        <ChartPie
          data={portfolioDistribution}
          width={Dimensions.get("window").width - 30}
          height={220}
          chartConfig={{
            backgroundColor: "#1e2923",
            backgroundGradientFrom: "#1e2923",
            backgroundGradientTo: "#08130D",
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />

        {/* Portfolio Summary */}
        <View style={styles.walletContainer}>
          <Text style={styles.walletText}>
            Portfolio Value: ₹{portfolioValue}
          </Text>
          <Text style={styles.walletText}>Cash: ₹{cash}</Text>
          <Text style={styles.walletText}>Total: ₹{portfolioValue + cash}</Text>
        </View>

        {/* Scrolling Stock Bar */}
        <RNScrollView
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
        </RNScrollView>

        {/* Portfolio Holdings */}
        <RNScrollView style={styles.stockList}>
          <Text style={styles.sectionTitle}>Your Holdings</Text>
          {portfolio.map((stock, index) => {
            const currentValue = stock.shares * stock.currentPrice;
            const purchaseValue = stock.shares * stock.buyPrice;
            const profitLoss = currentValue - purchaseValue;
            const profitLossPercentage = (profitLoss / purchaseValue) * 100;

            return (
              <View key={index} style={styles.stockItem}>
                <View style={styles.stockDetails}>
                  <Text style={styles.stockName}>{stock.name}</Text>
                  <Text style={styles.stockShares}>{stock.shares} shares</Text>
                </View>
                <View style={styles.stockValue}>
                  <Text style={styles.currentValue}>₹{currentValue}</Text>
                  <Text
                    style={[
                      styles.profitLoss,
                      profitLoss >= 0 ? styles.profit : styles.loss,
                    ]}
                  >
                    {profitLoss >= 0 ? "+" : ""}₹{profitLoss} (
                    {profitLossPercentage.toFixed(2)}%)
                  </Text>
                </View>
              </View>
            );
          })}
        </RNScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Buy Stocks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.sellButton]}>
            <Text style={styles.buttonText}>Sell Stocks</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 15,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00ff9d",
    textAlign: "center",
    marginBottom: 20,
  },
  stockBar: {
    backgroundColor: "#000",
    padding: 10,
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
    backgroundColor: "#1e272e",
    padding: 15,
    margin: 15,
    borderRadius: 10,
    elevation: 5,
  },
  walletText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  stockList: {
    flex: 1,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00ff9d",
    marginBottom: 10,
  },
  stockDetails: {
    flex: 1,
  },
  stockName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  stockShares: {
    color: "#bbb",
    fontSize: 14,
  },
  stockValue: {
    alignItems: "flex-end",
  },
  currentValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  profitLoss: {
    fontSize: 14,
  },
  profit: {
    color: "#2ed573",
  },
  loss: {
    color: "#ff4757",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    backgroundColor: "#2980b9",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  sellButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

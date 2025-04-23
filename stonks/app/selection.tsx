import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ToastAndroid,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

// Duolingo color palette
const colors = {
  primary: "#58CC02", // Duolingo green
  primaryDark: "#58A700", // Darker green for buttons
  secondary: "#1CB0F6", // Duolingo blue
  secondaryDark: "#1899D6", // Darker blue
  accent: "#FF9600", // Duolingo orange
  accentDark: "#E38400", // Darker orange
  negative: "#FF4B4B", // Duolingo red
  negativeLight: "#FFF0F0", // Light red background
  positiveLight: "#E5F8D3", // Light green background
  neutral: "#AFAFAF", // Gray for skip button
  neutralDark: "#777777", // Darker gray
  white: "#FFFFFF",
  background: "#FFF5F5", // Very light background
  lightGray: "#F7F7F7",
  text: "#4B4B4B", // Dark gray for text
  textLight: "#777777", // Lighter text
  border: "#E5E5E5",
};

// Define the type for the stock item
interface StockItem {
  id: string;
  name: string;
  ticker: string;
  currentPrice: number;
  priceHistory: number[];
  trend: "up" | "down" | "volatile" | "stable";
  volatility: number; // 0-1 scale
}

interface StockCardProps {
  item: StockItem;
  onBuy: (item: StockItem) => void;
  onSkip: (item: StockItem) => void;
}

// Generate realistic price movement data based on stock characteristics
const generatePriceData = (
  startPrice: number,
  trend: string,
  volatility: number
): number[] => {
  const pricePoints = 24; // 24 hours of data
  const prices = [startPrice];

  // Base trend direction
  const trendFactor =
    trend === "up"
      ? 0.005
      : trend === "down"
      ? -0.005
      : trend === "volatile"
      ? 0
      : 0.001; // stable has slight upward bias

  for (let i = 1; i < pricePoints; i++) {
    // Random factor influenced by volatility (0-1)
    const randomChange = (Math.random() - 0.5) * volatility * startPrice * 0.02;
    // Trend factor
    const trendChange = prices[i - 1] * trendFactor;
    // Calculate new price
    const newPrice = prices[i - 1] + randomChange + trendChange;
    // Ensure price doesn't go negative
    prices.push(Math.max(newPrice, 0.01));
  }

  return prices;
};

const StockCard: React.FC<StockCardProps> = ({ item, onBuy, onSkip }) => {
  // Generate chart data
  const chartData = {
    labels: Array.from({ length: 7 }, (_, i) => `${i * 4}h`), // Show 0h, 4h, 8h, etc.
    datasets: [
      {
        data: item.priceHistory,
        color: (opacity = 1) =>
          item.priceHistory[0] < item.priceHistory[item.priceHistory.length - 1]
            ? `rgba(88, 204, 2, ${opacity})` // Duolingo green for upward trend
            : `rgba(255, 75, 75, ${opacity})`, // Duolingo red for downward trend
        strokeWidth: 2,
      },
    ],
  };

  // Calculate price change percentage
  const priceChange =
    item.priceHistory[item.priceHistory.length - 1] - item.priceHistory[0];
  const priceChangePercent = (priceChange / item.priceHistory[0]) * 100;
  const isPriceUp = priceChange >= 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.stockName}>{item.name}</Text>
        <Text style={styles.stockTicker}>{item.ticker}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.currentPrice}>₹{item.currentPrice.toFixed(2)}</Text>
        <Text
          style={[
            styles.priceChange,
            isPriceUp ? styles.priceUp : styles.priceDown,
          ]}
        >
          {isPriceUp ? "▲" : "▼"} {Math.abs(priceChangePercent).toFixed(2)}%
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth - 80}
          height={180}
          chartConfig={{
            backgroundColor: colors.white,
            backgroundGradientFrom: colors.white,
            backgroundGradientTo: colors.white,
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(75, 75, 75, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(75, 75, 75, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "0", // Hide dots
            },
          }}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={true}
          withHorizontalLabels={true}
          withVerticalLabels={true}
          withDots={false}
        />
        <Text style={styles.chartLabel}>Price movement - Last 24 hours</Text>
      </View>

      <View
        style={[
          styles.marketAnalysis,
          isPriceUp ? styles.positiveAnalysis : styles.negativeAnalysis,
        ]}
      >
        <Text style={styles.analysisLabel}>Market Analysis:</Text>
        <Text style={styles.analysisText}>
          {item.trend === "up"
            ? "Showing strong upward momentum."
            : item.trend === "down"
            ? "Currently in a downward trend."
            : item.trend === "volatile"
            ? "Experiencing high volatility."
            : "Relatively stable with minor fluctuations."}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.buyButton]}
          onPress={() => onBuy(item)}
        >
          <Text style={styles.buyButtonText}>BUY</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={() => onSkip(item)}
        >
          <Text style={styles.skipButtonText}>SKIP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const showToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("", message); // Use Alert for iOS
  }
};

const App = () => {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [portfolio, setPortfolio] = useState<StockItem[]>([]);
  const [balance, setBalance] = useState(10000);
  const [swipeCount, setSwipeCount] = useState(0);
  const maxSwipes = 12;

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await fetch('http://192.168.247.175:3000/api/stocks/');
      const data = await response.json();
      setStocks(data.map((stock: any) => ({
        id: stock._id,
        name: stock.name,
        ticker: stock.ticker,
        currentPrice: stock.basePrice,
        priceHistory: generatePriceData(stock.basePrice, stock.trend, stock.volatility),
        trend: stock.trend,
        volatility: stock.volatility
      })));
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  // const handleBuy = async (item: StockItem) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch('http://192.168.247.175:3000/api/stocks/buy', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         stockId: item.id,
  //         quantity: 1
  //       })
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to buy stock');
  //     }

  //     const data = await response.json();
  //     setPortfolio(data.portfolio);
  //     setBalance(balance - item.currentPrice);
  //     showToast(`✅ Purchased ${item.ticker} at ₹${item.currentPrice.toFixed(2)}`);
  //     removeStock(item.id);
  //   } catch (error) {
  //     console.error('Error buying stock:', error);
  //     showToast('Failed to buy stock. Please try again.');
  //   }
  // };
  const handleBuy = (item: StockItem) => {
    // Check if user can afford the stock
    if (balance < item.currentPrice) {
      showToast(`⚠️ Insufficient funds to buy ${item.ticker}!`);
      return;
    }

    // Add to portfolio and update balance
    setPortfolio([...portfolio, item]);
    setBalance(balance - item.currentPrice);
    showToast(
      `✅ Purchased ${item.ticker} at ₹${item.currentPrice.toFixed(2)}`
    );

    removeStock(item.id);
  };

  const handleSkip = (item: StockItem) => {
    showToast(`⏩ Skipped ${item.ticker}`);
    removeStock(item.id);
  };

  const removeStock = (id: string) => {
    setStocks(stocks.filter((stock) => stock.id !== id));
    setSwipeCount(swipeCount + 1);

    if (swipeCount + 1 >= maxSwipes) {
      simulateMarket();
    }
  };

  const simulateMarket = () => {
    // Simulate market movements for portfolio stocks
    const updatedPortfolio = portfolio.map((stock) => {
      // Generate new price based on trend and volatility
      const priceChange =
        stock.currentPrice *
        ((Math.random() - 0.3) * stock.volatility +
          (stock.trend === "up"
            ? 0.05
            : stock.trend === "down"
            ? -0.05
            : stock.trend === "volatile"
            ? Math.random() > 0.5
              ? 0.1
              : -0.1
            : 0));

      const newPrice = Math.max(stock.currentPrice + priceChange, 0.01);
      return { ...stock, currentPrice: newPrice };
    });

    // Calculate portfolio value
    const portfolioValue = updatedPortfolio.reduce(
      (sum, stock) => sum + stock.currentPrice,
      0
    );
    const totalValue = portfolioValue + balance;

    showFinalScore(totalValue, portfolioValue, updatedPortfolio);
  };

  const showFinalScore = (
    totalValue: number,
    portfolioValue: number,
    finalPortfolio: StockItem[]
  ) => {
    const initialInvestment = 10000;
    const profit = totalValue - initialInvestment;
    const profitPercentage = (profit / initialInvestment) * 100;

    let performanceRating;
    let message;

    if (profitPercentage >= 15) {
      performanceRating = "Legendary";
      message = `🏆 MARKET GENIUS!\nYou made a ${profitPercentage.toFixed(
        2
      )}% return!`;
    } else if (profitPercentage >= 8) {
      performanceRating = "Champion";
      message = `💰 EXCELLENT TRADER!\nYou made a ${profitPercentage.toFixed(
        2
      )}% return!`;
    } else if (profitPercentage >= 3) {
      performanceRating = "Expert";
      message = `📈 SOLID PERFORMANCE!\nYou made a ${profitPercentage.toFixed(
        2
      )}% return!`;
    } else if (profitPercentage >= 0) {
      performanceRating = "Apprentice";
      message = `✅ BROKE EVEN!\nYou made a ${profitPercentage.toFixed(
        2
      )}% return!`;
    } else if (profitPercentage >= -10) {
      performanceRating = "Novice";
      message = `📉 MARKET SLUMP!\nYou lost ${Math.abs(
        profitPercentage
      ).toFixed(2)}% of your investment.`;
    } else {
      performanceRating = "Beginner";
      message = `🚨 MARKET CRASH!\nYou lost ${Math.abs(
        profitPercentage
      ).toFixed(2)}% of your investment!`;
    }

    // Create a detailed portfolio analysis text
    let portfolioAnalysis = "";
    if (finalPortfolio.length > 0) {
      portfolioAnalysis = "\n\nYour Portfolio:\n";
      finalPortfolio.forEach((stock) => {
        portfolioAnalysis += `• ${stock.ticker}: ₹${stock.currentPrice.toFixed(
          2
        )}\n`;
      });
    } else {
      portfolioAnalysis = "\n\nYou didn't purchase any stocks.";
    }

    Alert.alert(
      `Trading Results: ${performanceRating}`,
      `${message}\n\nFinal Balance: ₹${balance.toFixed(
        2
      )}\nPortfolio Value: ₹${portfolioValue.toFixed(
        2
      )}\nTotal Value: ₹${totalValue.toFixed(2)}${portfolioAnalysis}`,
      [
        {
          text: "Play Again",
          onPress: restartGame,
          style: "default",
        },
        {
          text: "Exit",
          style: "cancel",
        },
      ]
    );
  };

  const restartGame = () => {
    fetchStocks();
    setPortfolio([]);
    setBalance(10000);
    setSwipeCount(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <View style={styles.header}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Account Balance</Text>
            <Text style={styles.balanceValue}>₹{balance.toFixed(2)}</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>
                Decisions: {swipeCount}/{maxSwipes}
              </Text>
              <Text style={styles.progressPercent}>
                {Math.round((swipeCount / maxSwipes) * 100)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(swipeCount / maxSwipes) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.portfolioSummary}>
          <Text style={styles.portfolioLabel}>
            Portfolio: {portfolio.length} stocks
          </Text>
          <Text style={styles.portfolioValue}>
            Value: ₹
            {portfolio
              .reduce((sum, stock) => sum + stock.currentPrice, 0)
              .toFixed(2)}
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {stocks.length > 0 ? (
            <StockCard item={stocks[0]} onBuy={handleBuy} onSkip={handleSkip} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No more stocks to review!</Text>
              <Text style={styles.emptySubText}>
                Simulating market conditions...
              </Text>
              <TouchableOpacity
                style={styles.finishButton}
                onPress={() => simulateMarket()}
              >
                <Text style={styles.finishButtonText}>See Results</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gestureContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  balanceContainer: {
    marginBottom: 12,
  },
  balanceLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.9,
  },
  balanceValue: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "bold",
  },
  progressContainer: {
    marginTop: 4,
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  progressPercent: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBar: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.secondary,
    borderRadius: 12,
  },
  portfolioSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: colors.border,
  },
  portfolioLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  portfolioValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    width: screenWidth - 40,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  stockName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
  },
  stockTicker: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginRight: 10,
  },
  priceChange: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  priceUp: {
    color: colors.white,
    backgroundColor: colors.primary,
  },
  priceDown: {
    color: colors.white,
    backgroundColor: colors.negative,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  marketAnalysis: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 2,
  },
  positiveAnalysis: {
    backgroundColor: colors.positiveLight,
    borderColor: colors.primary,
  },
  negativeAnalysis: {
    backgroundColor: colors.negativeLight,
    borderColor: colors.negative,
  },
  analysisLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  analysisText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 2,
  },
  buyButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  skipButton: {
    backgroundColor: colors.neutral,
    borderColor: colors.neutralDark,
  },
  buyButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  skipButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    padding: 30,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 20,
  },
  finishButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: colors.secondaryDark,
    marginTop: 10,
  },
  finishButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});

export default App;

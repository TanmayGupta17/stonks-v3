import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface Transaction {
  type: "BUY" | "SELL";
  price: number;
  shares: number;
  timestamp: number;
  value: number;
}

// Smooth line chart component
const SmoothLineGraph: React.FC<{data: number[], labels: string[]}> = ({ data, labels }) => {
  return (
    <View style={styles.chartWrapper}>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
              color: (opacity = 1) => `rgba(50, 150, 255, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        }}
        width={320}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "4",
            strokeWidth: "1",
            stroke: "#4287f5",
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

// Portfolio display component
const PortfolioDisplay: React.FC<{
  cash: number, 
  shares: number, 
  currentPrice: number,
  transactions: Transaction[]
}> = ({ cash, shares, currentPrice, transactions }) => {
  // Calculate portfolio value and profit/loss
  const sharesValue = shares * currentPrice;
  const totalValue = cash + sharesValue;
  const initialCash = 100;
  const profitLoss = totalValue - initialCash;
  const isProfitable = profitLoss >= 0;
  
  return (
    <View style={styles.portfolioContainer}>
      <View style={styles.portfolioHeader}>
        <Text style={styles.portfolioTitle}>Your Portfolio</Text>
        <Text style={[
          styles.portfolioValue, 
          isProfitable ? styles.positive : styles.negative
        ]}>
          ${totalValue.toFixed(2)}
          <Text style={styles.profitLoss}>
            {isProfitable ? " ↑" : " ↓"} (${Math.abs(profitLoss).toFixed(2)})
          </Text>
        </Text>
      </View>
      
      <View style={styles.portfolioDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cash:</Text>
          <Text style={styles.detailValue}>${cash.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Shares:</Text>
          <Text style={styles.detailValue}>{shares} @ ${currentPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Shares Value:</Text>
          <Text style={styles.detailValue}>${sharesValue.toFixed(2)}</Text>
        </View>
      </View>
      
      {transactions.length > 0 && (
        <View style={styles.recentTransactions}>
          <Text style={styles.transactionsTitle}>Recent Transactions:</Text>
          <ScrollView style={styles.transactionsList} nestedScrollEnabled={true}>
            {transactions.slice(-5).reverse().map((transaction, index) => {
              const date = new Date(transaction.timestamp);
              const timeString = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
              
              return (
                <View key={index} style={styles.transaction}>
                  <Text style={[
                    styles.transactionType,
                    transaction.type === "BUY" ? styles.buyText : styles.sellText
                  ]}>
                    {transaction.type === "BUY" ? "🔵 BUY" : "🔴 SELL"}
                  </Text>
                  <Text style={styles.transactionDetails}>
                    {transaction.shares} shares @ ${transaction.price.toFixed(2)}
                  </Text>
                  <Text style={styles.transactionValue}>
                    ${transaction.value.toFixed(2)}
                  </Text>
                  <Text style={styles.transactionTime}>{timeString}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const StockGame = () => {
  // Price history data for chart
  const [priceHistory, setPriceHistory] = useState<number[]>([45, 46, 47, 48, 48.5, 49, 49.5, 50, 51, 52, 
    53, 53.5, 54, 55, 56, 57, 58, 58.5, 59, 60]);
  const [timeLabels, setTimeLabels] = useState<string[]>(["", "", "", "", ""]);
  const [currentPrice, setCurrentPrice] = useState<number>(60);
  
  // Portfolio state
  const [cash, setCash] = useState<number>(100);
  const [shares, setShares] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Trading inputs
  const [sharesToTrade, setSharesToBuy] = useState<number>(1);
  
  // Game state
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("Welcome! Buy or sell shares to start trading.");
  
  // Animation refs
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Animation constants
  const animationInterval = 100; // Update every 100ms
  
  // Function to generate next price with some randomness
  const generateNextPrice = (lastPrice: number): number => {
    // More realistic market movement with slight bias up or down
    const trend = Math.random() > 0.48 ? 1 : -1; // Slight upward bias
    const volatility = 0.1 + (Math.random() * 0.3); // 0.1 to 0.4 point movement
    
    // Generate new price with trend and volatility
    let newPrice = lastPrice + (trend * volatility);
    
    // Ensure price doesn't go too low
    if (newPrice < 10) newPrice = 10 + (Math.random() * 2);
    
    return newPrice;
  };
  
  // Handle buy action
  const handleBuy = () => {
    if (shares < 0) {
      setMessage("⚠️ You can't buy partial shares!");
      return;
    }
    
    const cost = currentPrice * sharesToTrade;
    
    if (cost > cash) {
      setMessage("⚠️ Not enough cash for this purchase!");
      return;
    }
    
    // Process the buy transaction
    setCash(prev => prev - cost);
    setShares(prev => prev + sharesToTrade);
    
    // Record the transaction
    const newTransaction: Transaction = {
      type: "BUY",
      price: currentPrice,
      shares: sharesToTrade,
      timestamp: Date.now(),
      value: cost
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    setMessage(`✅ Bought ${sharesToTrade} shares for $${cost.toFixed(2)}`);
  };
  
  // Handle sell action
  const handleSell = () => {
    if (sharesToTrade > shares) {
      setMessage("⚠️ You don't have enough shares to sell!");
      return;
    }
    
    const revenue = currentPrice * sharesToTrade;
    
    // Process the sell transaction
    setCash(prev => prev + revenue);
    setShares(prev => prev - sharesToTrade);
    
    // Record the transaction
    const newTransaction: Transaction = {
      type: "SELL",
      price: currentPrice,
      shares: sharesToTrade,
      timestamp: Date.now(),
      value: revenue
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    setMessage(`✅ Sold ${sharesToTrade} shares for $${revenue.toFixed(2)}`);
  };
  
  // Reset game
  const resetGame = () => {
    setCash(100);
    setShares(0);
    setTransactions([]);
    setCurrentPrice(60);
    setPriceHistory([50, 52, 54, 56, 60]);
    setSharesToBuy(1);
    setMessage("Game reset. Starting with $100.");
    setIsRunning(true);
    
    // Initialize time labels
    const now = new Date();
    const newLabels = Array(5).fill("").map((_, i) => {
      const d = new Date(now.getTime() - (5000 - i*1000));
      return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    });
    setTimeLabels(newLabels);
  };
  
  // Increase shares to trade
  const increaseShares = () => {
    setSharesToBuy(prev => prev + 1);
  };
  
  // Decrease shares to trade
  const decreaseShares = () => {
    if (sharesToTrade > 1) {
      setSharesToBuy(prev => prev - 1);
    }
  };
  
  // Animation effect to continuously update price
  useEffect(() => {
    if (isRunning) {
      // Start animation loop
      animationTimerRef.current = setInterval(() => {
        // Generate new price
        const newPrice = generateNextPrice(currentPrice);
        setCurrentPrice(newPrice);
        
        // Update price history
        setPriceHistory(prev => [...prev.slice(1), newPrice]);
        
        // Update time labels
        const now = new Date();
        const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        setTimeLabels(prev => [...prev.slice(1), timeString]);
        
        // Check for bankruptcy
        const portfolioValue = cash + (shares * newPrice);
        if (portfolioValue <= 0 && shares <= 0) {
          setIsRunning(false);
          setMessage("Game Over! You've lost all your money!");
        }
        
      }, animationInterval);
      
      return () => {
        if (animationTimerRef.current) {
          clearInterval(animationTimerRef.current);
        }
      };
    }
  }, [isRunning, currentPrice, cash, shares]);
  
  // Initialize the game on mount
  useEffect(() => {
    // Initialize time labels
    const now = new Date();
    const newLabels = Array(5).fill("").map((_, i) => {
      const d = new Date(now.getTime() - (5000 - i*1000));
      return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    });
    setTimeLabels(newLabels);
    
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📈 Real-Time Trading</Text>
      <Text style={styles.subtitle}>Current Price: <Text style={styles.price}>${currentPrice.toFixed(2)}</Text></Text>

      {/* Chart display */}
      <SmoothLineGraph 
        data={priceHistory} 
        labels={timeLabels}
      />

      {/* Portfolio display */}
      <PortfolioDisplay 
        cash={cash} 
        shares={shares} 
        currentPrice={currentPrice}
        transactions={transactions}
      />

      {/* Trading controls */}
      <View style={styles.controlsContainer}>
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.tradeControls}>
          <Text style={styles.tradeLabel}>Shares:</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={decreaseShares}
              disabled={sharesToTrade <= 1}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityValue}>{sharesToTrade}</Text>
            
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={increaseShares}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.tradingButtonsContainer}>
          <TouchableOpacity
            style={[styles.tradeButton, styles.buyButton]}
            onPress={handleBuy}
            disabled={!isRunning}
          >
            <Text style={styles.tradeButtonText}>BUY</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tradeButton, styles.sellButton]}
            onPress={handleSell}
            disabled={!isRunning || shares === 0}
          >
            <Text style={styles.tradeButtonText}>SELL</Text>
          </TouchableOpacity>
        </View>
        
        {!isRunning && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetGame}
          >
            <Text style={styles.resetButtonText}>RESTART GAME</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 4
  },
  price: {
    fontWeight: "bold"
  },
  chartWrapper: {
    marginVertical: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 3,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  chart: {
    borderRadius: 16
  },
  portfolioContainer: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  portfolioHeader: {
    marginBottom: 10,
  },
  portfolioTitle: {
    fontSize: 16,
    color: '#666',
  },
  portfolioValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profitLoss: {
    fontSize: 16,
    fontWeight: "normal"
  },
  portfolioDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  detailLabel: {
    color: '#666',
  },
  detailValue: {
    fontWeight: "500",
  },
  positive: {
    color: "#4CAF50"
  },
  negative: {
    color: "#F44336"
  },
  recentTransactions: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 5
  },
  transactionsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  transactionsList: {
    maxHeight: 120,
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionType: {
    fontWeight: "500",
    width: 65,
  },
  buyText: {
    color: "#1976D2",
  },
  sellText: {
    color: "#D32F2F",
  },
  transactionDetails: {
    flex: 1,
    paddingHorizontal: 5,
    fontSize: 12,
  },
  transactionValue: {
    fontWeight: "500",
    width: 55,
    textAlign: "right",
    fontSize: 12,
  },
  transactionTime: {
    color: '#888',
    fontSize: 10,
    width: 40,
    textAlign: "right",
  },
  controlsContainer: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 2,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    color: '#333',
    fontWeight: "500",
  },
  tradeControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  tradeLabel: {
    fontSize: 16,
    color: '#555',
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  quantityButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#f0f0f0',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#555',
  },
  quantityValue: {
    width: 40,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  tradingButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tradeButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    elevation: 1,
  },
  tradeButtonText: {
    color: '#fff',
    fontWeight: "bold",
    fontSize: 16,
  },
  buyButton: {
    backgroundColor: '#1976D2',
  },
  sellButton: {
    backgroundColor: '#D32F2F',
  },
  resetButton: {
    backgroundColor: '#2E7D32',
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    elevation: 1,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: "bold",
    fontSize: 16,
  }
});

export default StockGame;
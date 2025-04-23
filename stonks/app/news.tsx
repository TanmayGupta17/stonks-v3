import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  Animated,
  PanResponder,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

interface NewsPredictionItem {
  _id: string;
  stockTicker: string;
  newsHeadline: string;
  newsDetails: string;
  isBullish: boolean;
  explanation: string;
}

interface PredictionResult {
  isCorrect: boolean;
  explanation: string;
  user: {
    level: number;
    experience: number;
    nextLevel: number;
  };
}

interface UserStats {
  level: number;
  experience: number;
  nextLevel: number;
}

const API_BASE_URL = "http://192.168.247.175:3000/api";

const MarketSentimentAnalyzer = () => {
  const [newsList, setNewsList] = useState<NewsPredictionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    experience: 0,
    nextLevel: 100
  });

  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    fetchNewsData();
    fetchUserStats();
  }, []);

  // Update userStats when result changes
  useEffect(() => {
    if (result?.user) {
      setUserStats(result.user);
    }
  }, [result]);

  const fetchUserStats = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/user/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const fetchNewsData = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`${API_BASE_URL}/news`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch market news");
      }

      const data = await response.json();
      setNewsList(data.map((item: any) => ({
        _id: item._id,
        stockTicker: item.stockTicker,
        newsHeadline: item.newsHeadline,
        newsDetails: item.newsDetails,
        isBullish: item.isBullish,
        explanation: item.explanation,
      })));
    } catch (error: any) {
      console.error("Error loading market news:", error);
      Alert.alert(
        "Data Retrieval Error",
        error.message || "Unable to load market news. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const submitPrediction = async (prediction: boolean) => {
    if (!newsList[currentIndex]) return;
    
    try {
      setIsSubmitting(true);
      const token = await AsyncStorage.getItem("token");
      const currentNews = newsList[currentIndex];

      const response = await fetch(`${API_BASE_URL}/news/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newsId: currentNews._id,
          isBullish: prediction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Prediction submission failed");
      }

      setResult(data);
    } catch (error: any) {
      console.error("Prediction Error:", error);
      Alert.alert(
        "Submission Error", 
        error.message || "Failed to submit your market prediction."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToNext = () => {
    setResult(null);
    if (currentIndex + 1 < newsList.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert(
        "Analysis Complete", 
        "You've analyzed all available market news. Check back later for updates.",
        [{ text: "OK", onPress: () => fetchNewsData() }]
      );
    }
  };

  const panResponder = React.useMemo(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -120) {
          // Swipe left to go to next
          if (currentIndex + 1 < newsList.length) {
            setCurrentIndex(currentIndex + 1);
            setResult(null);
          }
        } else if (gestureState.dx > 120) {
          // Swipe right to go to previous
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setResult(null);
          }
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    }),
    [currentIndex, newsList.length]
  );

  const renderProgressBar = () => {
    const progress = (userStats.experience / userStats.nextLevel) * 100 || 0;
    return (
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading market data...</Text>
      </SafeAreaView>
    );
  }

  const currentNews = newsList[currentIndex];

  if (!currentNews) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <MaterialIcons name="sentiment-dissatisfied" size={48} color="#888" />
        <Text style={styles.emptyText}>No market news available</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchNewsData}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Persistent User Stats and Progress Bar */}
      <View style={styles.userStatsHeader}>
        <Text style={styles.levelText}>Level {userStats.level}</Text>
        {renderProgressBar()}
        <Text style={styles.xpText}>
          {userStats.experience} / {userStats.nextLevel} XP
        </Text>
      </View>
      
      {/* Swipable News Card */}
      <Animated.View
        style={[pan.getLayout(), styles.card]}
        {...panResponder.panHandlers}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.ticker}>{currentNews.stockTicker}</Text>
          <Text style={styles.counter}>
            {currentIndex + 1}/{newsList.length}
          </Text>
        </View>
        
        <Text style={styles.headline}>{currentNews.newsHeadline}</Text>
        <Text style={styles.details}>{currentNews.newsDetails}</Text>

        {!result ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.bullishButton]}
              onPress={() => submitPrediction(true)}
              disabled={isSubmitting}
            >
              <FontAwesome name="arrow-up" size={16} color="#fff" />
              <Text style={styles.buttonText}>Bullish</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.bearishButton]}
              onPress={() => submitPrediction(false)}
              disabled={isSubmitting}
            >
              <FontAwesome name="arrow-down" size={16} color="#fff" />
              <Text style={styles.buttonText}>Bearish</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              {result.isCorrect ? (
                <View style={styles.resultIconContainer}>
                  <MaterialIcons name="check-circle" size={28} color="#4CAF50" />
                  <Text style={[styles.resultTitle, styles.correctText]}>Correct Analysis</Text>
                </View>
              ) : (
                <View style={styles.resultIconContainer}>
                  <MaterialIcons name="cancel" size={28} color="#F44336" />
                  <Text style={[styles.resultTitle, styles.incorrectText]}>Incorrect Analysis</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.explanationText}>{result.explanation}</Text>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={navigateToNext}
            >
              <Text style={styles.nextButtonText}>Next Analysis</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
      
      {/* Swipe Instructions */}
      <View style={styles.swipeInstructions}>
        <Text style={styles.swipeText}>
          <FontAwesome name="arrow-left" size={14} color="#888" /> Swipe to navigate news items <FontAwesome name="arrow-right" size={14} color="#888" />
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  userStatsHeader: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
    marginTop: 12,
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ticker: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  counter: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  headline: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 12,
    lineHeight: 24,
  },
  details: {
    fontSize: 15,
    color: "#555",
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    flex: 0.48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bullishButton: {
    backgroundColor: "#4CAF50",
  },
  bearishButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  resultContainer: {
    marginTop: 8,
  },
  resultHeader: {
    marginBottom: 16,
  },
  resultIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  correctText: {
    color: "#4CAF50",
  },
  incorrectText: {
    color: "#F44336",
  },
  explanationText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 20,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  levelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4A90E2",
  },
  xpText: {
    fontSize: 14,
    color: "#666",
  },
  nextButton: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 8,
  },
  swipeInstructions: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
  },
  swipeText: {
    color: "#888",
    fontSize: 14,
  }
});

export default MarketSentimentAnalyzer;

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function LandingScreen() {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push("/auth");
    console.log("Starting quiz...");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0a2e38", "#000000"]} style={styles.background}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <FontAwesome5 name="chart-line" size={60} color="#58cc02" />
            <Text style={styles.appName}>STONKS</Text>
          </View>

          <View style={styles.taglineContainer}>
            <Text style={styles.tagline}>Learn Stock Market Concepts</Text>
            <Text style={styles.subTagline}>
              The fun way to become a trading expert!
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <FeatureItem icon="brain" text="Master investment concepts" />
            <FeatureItem icon="chart-bar" text="Learn market terminology" />
            <FeatureItem icon="trophy" text="Test your trading knowledge" />
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartQuiz}
          >
            <Text style={styles.startButtonText}>START INVESTING</Text>
            <FontAwesome5 name="arrow-right" size={16} color="#fff" />
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Modules</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>hours</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>⭐</Text>
              <Text style={styles.statLabel}>Beginner</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Your path to financial wisdom</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Feature item component
const FeatureItem = ({ icon, text }: { icon: any; text: string }) => (
  <View style={styles.featureItem}>
    <FontAwesome5
      name={icon}
      size={20}
      color="#58cc02"
      style={styles.featureIcon}
    />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 10,
    letterSpacing: 3,
  },
  taglineContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  tagline: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  subTagline: {
    fontSize: 16,
    color: "#a3c2cd",
    textAlign: "center",
    marginTop: 8,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "rgba(32, 78, 88, 0.6)",
    padding: 16,
    borderRadius: 12,
  },
  featureIcon: {
    marginRight: 15,
  },
  featureText: {
    color: "#ffffff",
    fontSize: 16,
  },
  startButton: {
    backgroundColor: "#58cc02",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  startButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(26, 53, 64, 0.8)",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#a3c2cd",
  },
  statDivider: {
    height: 30,
    width: 1,
    backgroundColor: "#2c6b7b",
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    color: "#a3c2cd",
    fontSize: 14,
  },
});

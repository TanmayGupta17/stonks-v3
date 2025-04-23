import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
  ViewToken,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
const { width, height } = Dimensions.get("window");

// Define the onboarding data structure
interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  backgroundColor: string[];
}

// Define props for the ViewableItemsChanged callback
interface ViewableItemsChangedProps {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Gamified Learning",
    description:
      "Make stock market education fun with quizzes, challenges, and rewards that keep you engaged.",
    icon: "trophy",
    backgroundColor: ["#0a2e38", "#125a4d"],
  },
  {
    id: "2",
    title: "Bite-sized Modules",
    description:
      "Learn complex stock market concepts through easy-to-digest mini-lessons that fit into your busy schedule.",
    icon: "book-reader",
    backgroundColor: ["#0a2e38", "#125a70"],
  },
  {
    id: "3",
    title: "Market Simulator",
    description:
      "Practice trading with virtual money in a risk-free environment before investing real cash.",
    icon: "chart-line",
    backgroundColor: ["#0a2e38", "#126a42"],
  },
  {
    id: "4",
    title: "Track Your Progress",
    description:
      "Watch your knowledge and portfolio grow as you master investment concepts and strategies.",
    icon: "chart-bar",
    backgroundColor: ["#0a2e38", "#0f4f3d"],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(
    ({ viewableItems }: ViewableItemsChangedProps) => {
      if (viewableItems[0]) {
        setCurrentIndex(Number(viewableItems[0].index));
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = (index: number) => {
    if (slidesRef.current) {
      slidesRef.current.scrollToIndex({ index });
    }
  };

  const handleGetStarted = () => {
    console.log("Navigate to Home Screen");
    router.push("/main2");
  };

  const renderOnboardingItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={styles.slide}>
        <LinearGradient
          colors={["#0a2e38", "#000000"]}
          style={styles.gradientBackground}
        >
          <View style={styles.iconContainer}>
            <FontAwesome5 name={item.icon} size={70} color="#58cc02" />
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </LinearGradient>
      </View>
    );
  };

  const renderNextButton = () => {
    if (currentIndex === onboardingData.length - 1) {
      return (
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
        >
          <LinearGradient
            colors={["#58cc02", "#40a001"]}
            style={styles.getStartedGradient}
          >
            <Text style={styles.getStartedText}>GET STARTED</Text>
            <FontAwesome5 name="arrow-right" size={16} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => scrollTo(currentIndex + 1)}
      >
        <LinearGradient
          colors={["#58cc02", "#40a001"]}
          style={styles.nextGradient}
        >
          <Text style={styles.nextText}>NEXT</Text>
          <FontAwesome5 name="arrow-right" size={16} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderSkipButton = () => {
    if (currentIndex === onboardingData.length - 1) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => scrollTo(onboardingData.length - 1)}
      >
        <Text style={styles.skipText}>SKIP</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Stonks</Text>
      </View>

      <Animated.FlatList
        data={onboardingData}
        renderItem={renderOnboardingItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        ref={slidesRef}
      />

      <View style={styles.dotContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        {renderSkipButton()}
        {renderNextButton()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#58cc02",
  },
  slide: {
    width,
    height: height * 0.7,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  gradientBackground: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(10, 46, 56, 0.7)",
    borderRadius: 70,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: "rgba(88, 204, 2, 0.5)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffffff",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#e0e0e0",
    lineHeight: 24,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#58cc02",
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  nextButton: {
    marginLeft: "auto",
  },
  nextGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  nextText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  skipButton: {
    padding: 12,
  },
  skipText: {
    color: "#a3c2cd",
    fontSize: 16,
    fontWeight: "bold",
  },
  getStartedButton: {
    marginLeft: "auto",
  },
  getStartedGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  getStartedText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
});

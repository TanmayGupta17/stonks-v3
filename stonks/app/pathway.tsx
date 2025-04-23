import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "completed" | "current" | "locked";
  progress: number; // 0-100
  points: number;
  lessons: number;
  totalLessons: number;
  quizzes: number;
  totalQuizzes: number;
}

export default function LearningPathwayScreen({
  navigation,
}: {
  navigation: any;
}) {
  const [modules, setModules] = useState<Module[]>([
    {
      id: "1",
      title: "Stock Market Basics",
      description:
        "Learn foundational concepts of stock markets and investing.",
      icon: "book",
      status: "completed",
      progress: 100,
      points: 250,
      lessons: 5,
      totalLessons: 5,
      quizzes: 3,
      totalQuizzes: 3,
    },
    {
      id: "2",
      title: "Technical Analysis",
      description: "Understand charts, patterns, and market indicators.",
      icon: "chart-line",
      status: "completed",
      progress: 100,
      points: 200,
      lessons: 4,
      totalLessons: 4,
      quizzes: 2,
      totalQuizzes: 2,
    },
    {
      id: "3",
      title: "Fundamental Analysis",
      description: "Learn to evaluate company financials and business models.",
      icon: "search-dollar",
      status: "current",
      progress: 60,
      points: 120,
      lessons: 3,
      totalLessons: 5,
      quizzes: 1,
      totalQuizzes: 2,
    },
    {
      id: "4",
      title: "Investment Strategies",
      description:
        "Discover various approaches to build a profitable portfolio.",
      icon: "chess",
      status: "locked",
      progress: 0,
      points: 0,
      lessons: 0,
      totalLessons: 6,
      quizzes: 0,
      totalQuizzes: 3,
    },
    {
      id: "5",
      title: "Risk Management",
      description: "Learn to protect your investments and minimize losses.",
      icon: "shield-alt",
      status: "locked",
      progress: 0,
      points: 0,
      lessons: 0,
      totalLessons: 4,
      quizzes: 0,
      totalQuizzes: 2,
    },
    {
      id: "6",
      title: "Advanced Trading",
      description: "Master complex trading strategies and market analysis.",
      icon: "graduation-cap",
      status: "locked",
      progress: 0,
      points: 0,
      lessons: 0,
      totalLessons: 7,
      quizzes: 0,
      totalQuizzes: 3,
    },
  ]);

  const calculateTotalProgress = (): number => {
    const completedModules = modules.filter(
      (m) => m.status === "completed"
    ).length;
    const currentModuleProgress =
      modules.find((m) => m.status === "current")?.progress || 0;

    return Math.round(
      (completedModules * 100 + currentModuleProgress) / modules.length
    );
  };

  const totalProgress = calculateTotalProgress();
  const totalPoints = modules.reduce((sum, module) => sum + module.points, 0);

  const navigateToModule = (moduleId: string) => {
    // Navigate to specific module
    console.log(`Navigating to module ${moduleId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0a2e38", "#000000"]} style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={20} color="#58cc02" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Learning Pathway</Text>
          <View style={{ width: 20 }} />
        </View>

        {/* Progress Overview */}
        <View style={styles.progressOverview}>
          <View style={styles.progressCircleContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentage}>{totalProgress}%</Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {modules.filter((m) => m.status === "completed").length}
              </Text>
              <Text style={styles.statLabel}>Modules Done</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {modules.length -
                  modules.filter((m) => m.status === "completed").length}
              </Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
          </View>
        </View>

        {/* Modules Pathway */}
        <ScrollView
          style={styles.modulesList}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pathwayContainer}>
            {modules.map((module, index) => (
              <View key={module.id}>
                {/* Connection Line */}
                {index > 0 && (
                  <View
                    style={[
                      styles.connectionLine,
                      {
                        backgroundColor:
                          module.status === "locked" ? "#1a3540" : "#58cc02",
                      },
                    ]}
                  />
                )}

                {/* Module Card */}
                <TouchableOpacity
                  style={[
                    styles.moduleCard,
                    module.status === "locked"
                      ? styles.lockedModule
                      : module.status === "current"
                      ? styles.currentModule
                      : styles.completedModule,
                  ]}
                  onPress={() => navigateToModule(module.id)}
                  disabled={module.status === "locked"}
                >
                  <View style={styles.moduleHeader}>
                    <View
                      style={[
                        styles.moduleIconContainer,
                        module.status === "locked"
                          ? styles.lockedIcon
                          : module.status === "current"
                          ? styles.currentIcon
                          : styles.completedIcon,
                      ]}
                    >
                      <FontAwesome5
                        name={module.icon}
                        size={24}
                        color={module.status === "locked" ? "#1a3540" : "#fff"}
                      />
                    </View>
                    <View style={styles.moduleInfo}>
                      <Text style={styles.moduleTitle}>{module.title}</Text>
                      <Text
                        style={[
                          styles.moduleStatus,
                          module.status === "locked"
                            ? styles.lockedText
                            : module.status === "current"
                            ? styles.currentText
                            : styles.completedText,
                        ]}
                      >
                        {module.status === "completed"
                          ? "COMPLETED"
                          : module.status === "current"
                          ? "IN PROGRESS"
                          : "LOCKED"}
                      </Text>
                    </View>
                    {module.status === "completed" && (
                      <View style={styles.checkmarkContainer}>
                        <FontAwesome5
                          name="check-circle"
                          size={24}
                          color="#58cc02"
                        />
                      </View>
                    )}
                    {module.status === "current" && (
                      <View style={styles.playButtonContainer}>
                        <FontAwesome5
                          name="play-circle"
                          size={24}
                          color="#58cc02"
                        />
                      </View>
                    )}
                    {module.status === "locked" && (
                      <View style={styles.lockContainer}>
                        <FontAwesome5 name="lock" size={20} color="#1a3540" />
                      </View>
                    )}
                  </View>

                  <Text style={styles.moduleDescription}>
                    {module.description}
                  </Text>

                  {module.status !== "locked" && (
                    <View style={styles.moduleProgressContainer}>
                      <View style={styles.progressBarBackground}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { width: `${module.progress}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {module.progress}%
                      </Text>
                    </View>
                  )}

                  <View style={styles.moduleMeta}>
                    <View style={styles.metaItem}>
                      <FontAwesome5
                        name="book-open"
                        size={14}
                        color="#a3c2cd"
                      />
                      <Text style={styles.metaText}>
                        {module.lessons}/{module.totalLessons} Lessons
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <FontAwesome5
                        name="question-circle"
                        size={14}
                        color="#a3c2cd"
                      />
                      <Text style={styles.metaText}>
                        {module.quizzes}/{module.totalQuizzes} Quizzes
                      </Text>
                    </View>
                    {module.status !== "locked" && (
                      <View style={styles.metaItem}>
                        <FontAwesome5 name="trophy" size={14} color="#a3c2cd" />
                        <Text style={styles.metaText}>
                          {module.points} Points
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerTab}>
            <FontAwesome5 name="home" size={20} color="#a3c2cd" />
            <Text style={styles.footerTabText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerTab}>
            <FontAwesome5 name="chart-bar" size={20} color="#a3c2cd" />
            <Text style={styles.footerTabText}>Markets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerTab}>
            <FontAwesome5 name="book" size={20} color="#58cc02" />
            <Text style={[styles.footerTabText, { color: "#58cc02" }]}>
              Learn
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerTab}>
            <FontAwesome5 name="user" size={20} color="#a3c2cd" />
            <Text style={styles.footerTabText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  progressOverview: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "rgba(26, 53, 64, 0.4)",
    flexDirection: "row",
    alignItems: "center",
  },
  progressCircleContainer: {
    marginRight: 20,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0c2b36",
    borderWidth: 4,
    borderColor: "#58cc02",
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  progressLabel: {
    fontSize: 12,
    color: "#a3c2cd",
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 12,
    color: "#a3c2cd",
  },
  modulesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pathwayContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  connectionLine: {
    width: 4,
    height: 30,
    marginVertical: 5,
  },
  moduleCard: {
    width: "100%",
    borderRadius: 16,
    padding: 18,
    marginBottom: 5,
  },
  completedModule: {
    backgroundColor: "rgba(26, 53, 64, 0.8)",
    borderLeftWidth: 4,
    borderLeftColor: "#58cc02",
  },
  currentModule: {
    backgroundColor: "rgba(26, 53, 64, 0.8)",
    borderLeftWidth: 4,
    borderLeftColor: "#2389da",
  },
  lockedModule: {
    backgroundColor: "rgba(10, 30, 36, 0.5)",
    borderLeftWidth: 4,
    borderLeftColor: "#1a3540",
  },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  moduleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  completedIcon: {
    backgroundColor: "#58cc02",
  },
  currentIcon: {
    backgroundColor: "#2389da",
  },
  lockedIcon: {
    backgroundColor: "#1a3540",
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  moduleStatus: {
    fontSize: 12,
    fontWeight: "bold",
  },
  completedText: {
    color: "#58cc02",
  },
  currentText: {
    color: "#2389da",
  },
  lockedText: {
    color: "#a3c2cd",
  },
  checkmarkContainer: {
    marginLeft: 10,
  },
  playButtonContainer: {
    marginLeft: 10,
  },
  lockContainer: {
    marginLeft: 10,
  },
  moduleDescription: {
    fontSize: 14,
    color: "#a3c2cd",
    marginBottom: 15,
  },
  moduleProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#0c2b36",
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 10,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#58cc02",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  moduleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#a3c2cd",
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "#0c1e24",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#1a3540",
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

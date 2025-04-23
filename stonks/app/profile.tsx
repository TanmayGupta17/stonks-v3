// ProfileScreen.tsx
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useRouter } from "expo-router";

interface StockAchievement {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  icon: string;
}

const ProfileScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  interface UserData {
    name: string;
    username: string;
    joinDate: string;
    level: number;
    experience: number;
    nextLevel: number;
    streak: number;
    totalQuizzes: number;
    correctAnswers: number;
    incorrectAnswers: number;
    achievements: StockAchievement[];
  }

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.247.175:3000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('user');
    router.push("/auth");
    // Navigate to login screen
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Calculate completion percentage
  const completionPercentage = (userData.experience / userData.nextLevel) * 100;

  // Calculate accuracy
  const totalAnswers = userData.correctAnswers + userData.incorrectAnswers;
  const accuracy =
    totalAnswers > 0
      ? Math.round((userData.correctAnswers / totalAnswers) * 100)
      : 0;

  const toggleDarkMode = () => setIsDarkMode((previousState) => !previousState);
  const toggleNotifications = () =>
    setNotifications((previousState) => !previousState);

  return (
    <ScrollView style={styles.container}>
      {/* Header with profile info */}
      <View style={styles.headerContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.nameText}>{userData.name}</Text>
          <Text style={styles.usernameText}>@{userData.username}</Text>
          <Text style={styles.joinDateText}>Joined {userData.joinDate}</Text>

          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Progress</Text>

        <View style={styles.levelContainer}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>Level {userData.level}</Text>
            <Text style={styles.expText}>
              {userData.experience}/{userData.nextLevel} XP
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${completionPercentage}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="fire" size={24} color="#4ADE80" />
            <Text style={styles.statValue}>{userData.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="notebook" size={24} color="#4ADE80" />
            <Text style={styles.statValue}>{userData.totalQuizzes}</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="target" size={24} color="#4ADE80" />
            <Text style={styles.statValue}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>
      </View>

      {/* Achievements Section */}
      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>Achievements</Text>

        {userData.achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementItem}>
            <View
              style={[
                styles.achievementIcon,
                !achievement.earned && styles.achievementIconLocked,
              ]}
            >
              <FontAwesome5
                name={achievement.icon}
                size={20}
                color={achievement.earned ? "#4ADE80" : "#6B7280"}
              />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              <Text style={styles.achievementDesc}>
                {achievement.description}
              </Text>
            </View>
            {achievement.earned ? (
              <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />
            ) : (
              <Ionicons name="lock-closed" size={24} color="#6B7280" />
            )}
          </View>
        ))}
      </View>

      {/* Settings Section */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={24} color="#4ADE80" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#4ADE80" }}
            thumbColor={isDarkMode ? "#FFFFFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={isDarkMode}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={24} color="#4ADE80" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#4ADE80" }}
            thumbColor={notifications ? "#FFFFFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleNotifications}
            value={notifications}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerContainer: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#4ADE80",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4ADE80",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  usernameText: {
    color: "#9CA3AF",
    fontSize: 16,
  },
  joinDateText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 2,
  },
  editProfileButton: {
    backgroundColor: "#2A2A2A",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  editProfileText: {
    color: "#4ADE80",
    fontSize: 14,
    fontWeight: "500",
  },
  statsContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  levelContainer: {
    marginBottom: 16,
  },
  levelInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  levelText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  expText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#2A2A2A",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4ADE80",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  statLabel: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  achievementsContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#4ADE80",
  },
  achievementIconLocked: {
    borderColor: "#6B7280",
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  achievementDesc: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  settingsContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default ProfileScreen;

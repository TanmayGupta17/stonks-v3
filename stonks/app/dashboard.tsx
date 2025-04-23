import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";
import {
  Activity,
  Award,
  Zap,
  DollarSign,
  TrendingDown,
  Gamepad,
  Medal,
} from "lucide-react";

export default function Dashboard() {
  // Initial state
  const [stats, setStats] = useState({
    modulesCompleted: 42,
    gamesPlayed: 156,
    moneyMade: 2845.75,
    moneyLost: 675.25,
    level: 8,
    experience: 75, // percentage to next level
    userName: "Player One",
  });

  // Simulate real-time updates
  useEffect(() => {
    // Function to simulate random data changes
    const updateStats = () => {
      setStats((prevStats) => {
        // Randomly determine which stat to update
        const updateType = Math.floor(Math.random() * 4);

        let newStats = { ...prevStats };

        switch (updateType) {
          case 0: // Update modules completed
            newStats.modulesCompleted += 1;
            newStats.experience = Math.min(newStats.experience + 5, 100);
            break;
          case 1: // Update games played
            newStats.gamesPlayed += 1;
            newStats.experience = Math.min(newStats.experience + 3, 100);
            break;
          case 2: // Update money made
            const earnings = Math.floor(Math.random() * 100) + 20;
            newStats.moneyMade += earnings;
            newStats.experience = Math.min(newStats.experience + 2, 100);
            break;
          case 3: // Update money lost
            const loss = Math.floor(Math.random() * 50) + 10;
            newStats.moneyLost += loss;
            break;
        }

        // Check if level up is needed
        if (newStats.experience >= 100) {
          newStats.level += 1;
          newStats.experience = 0;
        }

        return newStats;
      });
    };

    // Update every 2-3 seconds
    const interval = setInterval(() => {
      updateStats();
    }, 2000 + Math.random() * 1000);

    return () => clearInterval(interval);
  }, []);

  // Format timestamp for last update
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animated pulse effect
  const [pulseAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gaming Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, {stats.userName}</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Level {stats.level}</Text>
        </View>
      </View>

      <View style={styles.liveIndicatorContainer}>
        <Animated.View
          style={[styles.liveIndicator, { transform: [{ scale: pulseScale }] }]}
        />
        <Text style={styles.liveText}>
          Live updates - Last change: {lastUpdate.toLocaleTimeString()}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Modules Completed"
          value={stats.modulesCompleted}
          color="#1e40af"
        />
        <StatCard
          title="Games Played"
          value={stats.gamesPlayed}
          color="#7e22ce"
        />
        <StatCard
          title="Money Made"
          value={`$${stats.moneyMade.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}`}
          color="#15803d"
        />
        <StatCard
          title="Money Lost"
          value={`$${stats.moneyLost.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}`}
          color="#b91c1c"
        />
      </View>

      <View style={styles.expCard}>
        <View style={styles.expHeader}>
          <View>
            <Text style={styles.expTitle}>Experience</Text>
            <Text style={styles.expSubtitle}>
              Level {stats.level} → Level {stats.level + 1}
            </Text>
          </View>
          <Text style={styles.expPercentage}>{stats.experience}%</Text>
        </View>
        <View style={styles.progressBg}>
          <View
            style={[styles.progressBar, { width: `${stats.experience}%` }]}
          />
        </View>
      </View>

      <View style={styles.achievementCard}>
        <Text style={styles.achievementTitle}>Recent Achievements</Text>
        <View style={styles.achievementGrid}>
          <AchievementCard
            title="Speed Demon"
            description="Complete 5 games in under 10 minutes"
            progress={
              stats.gamesPlayed > 160
                ? 100
                : Math.floor(((stats.gamesPlayed - 156) / 5) * 100)
            }
          />
          <AchievementCard
            title="Big Spender"
            description="Make a purchase of $1000 or more"
            progress={
              stats.moneyMade > 3845.75
                ? 100
                : Math.floor((stats.moneyMade - 2845.75) / 10)
            }
          />
          <AchievementCard
            title="Module Master"
            description="Complete all modules in a category"
            progress={
              stats.modulesCompleted > 50
                ? 100
                : Math.floor(((stats.modulesCompleted - 42) / 8) * 100)
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
}

function StatCard({ title, value, color }: StatCardProps) {
  return (
    <View style={[styles.card, { borderColor: color }]}>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </View>
  );
}

interface AchievementCardProps {
  title: string;
  description: string;
  progress: number;
}

function AchievementCard({
  title,
  description,
  progress,
}: AchievementCardProps) {
  const cappedProgress = Math.min(progress, 100);

  return (
    <View style={styles.achievementItem}>
      <Text style={styles.achievementItemTitle}>{title}</Text>
      <Text style={styles.achievementDescription}>{description}</Text>
      <View style={styles.achievementProgressBg}>
        <View
          style={[
            styles.achievementProgressBar,
            { width: `${cappedProgress}%` },
          ]}
        />
      </View>
      <Text style={styles.achievementPercentage}>{cappedProgress}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  levelBadge: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  levelText: {
    color: "white",
    fontWeight: "bold",
  },
  liveIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
    marginRight: 4,
  },
  liveText: {
    fontSize: 12,
    color: "#64748b",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    width: "48%",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardTitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  expCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  expTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  expSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  expPercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#facc15",
  },
  progressBg: {
    backgroundColor: "#334155",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    backgroundColor: "#facc15",
    height: 8,
  },
  achievementCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  achievementGrid: {
    flexDirection: "column",
  },
  achievementItem: {
    backgroundColor: "rgba(51, 65, 85, 0.5)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#475569",
  },
  achievementItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 12,
  },
  achievementProgressBg: {
    backgroundColor: "#475569",
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
    overflow: "hidden",
  },
  achievementProgressBar: {
    backgroundColor: "#818cf8",
    height: 6,
  },
  achievementPercentage: {
    fontSize: 12,
    textAlign: "right",
    color: "#94a3b8",
  },
});

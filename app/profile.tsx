import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  RefreshControl,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { database, type ExerciseType, type TrackerEntry } from "../services/database";
import { auth, type User } from "../services/auth";

const EXERCISE_LABELS: Record<ExerciseType, { label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; color: string }> = {
  breathing: { label: "Дыхание", icon: "weather-windy", color: "#4A90A4" },
  grounding: { label: "Заземление", icon: "leaf", color: "#4A9D7A" },
  cbt: { label: "Разбор мысли", icon: "head-lightbulb-outline", color: "#7B6B8E" },
  body: { label: "Телесная", icon: "human-handsup", color: "#C08450" },
};

const EMOTION_LABELS: Record<string, string> = {
  calm: "Спокойствие",
  joy: "Радость",
  sadness: "Грусть",
  anxiety: "Тревога",
  anger: "Злость",
  fear: "Страх",
  emptiness: "Пустота",
  hope: "Надежда",
};

interface ProfileStats {
  totalAntianxietySessions: number;
  exerciseCounts: Record<ExerciseType, number>;
  totalTrackerEntries: number;
  avgAnxietyLevel: number;
  emotionCounts: Record<string, number>;
  programCompletedDays: number;
  programTotalDays: number;
  lastTrackerEntry: TrackerEntry | null;
  lastAntianxietySession: { exerciseType: ExerciseType; completedAt: string } | null;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    const currentUser = await auth.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      const avatar = await auth.getAvatar();
      setAvatarUri(avatar);
    }
    setLoading(false);
  }, []);

  const loadStats = useCallback(async () => {
    const data = await database.getProfileStats();
    setStats(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkAuth();
    }, [checkAuth])
  );

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadStats();
      }
    }, [user, loadStats])
  );

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user, loadStats]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }, [loadStats]);

  const handleLogout = useCallback(async () => {
    await auth.logout();
    setUser(null);
    setStats(null);
  }, []);

  const handleGoToAuth = () => {
    router.push("/auth");
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Разрешение требуется",
        "Для выбора фото необходим доступ к галерее"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
      await auth.saveAvatar(uri);
    }
  };

  if (loading) {
    return (
      <BackgroundWrapper>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingRing}>
            <ActivityIndicator size="large" color="#6BB3D0" />
          </View>
          <Text style={styles.loadingText}>Загрузка профиля</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  if (!user) {
    return (
      <BackgroundWrapper>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <View style={styles.authPrompt}>
            <LinearGradient
              colors={["rgba(74, 144, 164, 0.25)", "rgba(123, 107, 142, 0.15)"]}
              style={styles.authIconCircle}
            >
              <MaterialCommunityIcons name="account-lock" size={56} color="#6BB3D0" />
            </LinearGradient>
            <Text style={styles.authTitle}>Мой профиль</Text>
            <Text style={styles.authSubtitle}>
              Создайте аккаунт или войдите, чтобы отслеживать свой прогресс в упражнениях
            </Text>
            <View style={styles.authFeatures}>
              <View style={styles.authFeatureItem}>
                <View style={styles.authFeatureIconWrap}>
                  <MaterialCommunityIcons name="chart-line" size={20} color="#5BB89A" />
                </View>
                <Text style={styles.authFeatureText}>Отчёты о прогрессе</Text>
              </View>
              <View style={styles.authFeatureItem}>
                <View style={styles.authFeatureIconWrap}>
                  <MaterialCommunityIcons name="meditation" size={20} color="#9B8BB0" />
                </View>
                <Text style={styles.authFeatureText}>Статистика упражнений</Text>
              </View>
              <View style={styles.authFeatureItem}>
                <View style={styles.authFeatureIconWrap}>
                  <MaterialCommunityIcons name="emoticon-outline" size={20} color="#D4A574" />
                </View>
                <Text style={styles.authFeatureText}>История эмоций</Text>
              </View>
            </View>
            <Pressable style={styles.authButton} onPress={handleGoToAuth}>
              <LinearGradient
                colors={["#5BA3B8", "#4A90A4", "#3D7A8C"]}
                style={styles.authButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.authButtonText}>Войти или зарегистрироваться</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </BackgroundWrapper>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTopEmotions = () => {
    if (!stats) return [];
    return Object.entries(stats.emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([key, count]) => ({ key, label: EMOTION_LABELS[key] || key, count }));
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="rgba(255, 255, 255, 0.5)"
            />
          }
        >
          <View style={styles.profileHeader}>
            <Pressable style={styles.avatarContainer} onPress={pickImage}>
              <LinearGradient
                colors={["rgba(107, 179, 208, 0.5)", "rgba(123, 107, 142, 0.3)"]}
                style={styles.avatarRing}
              >
                <View style={styles.avatarInner}>
                  {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                  ) : (
                    <View style={styles.avatarCircle}>
                      <MaterialCommunityIcons name="account" size={48} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              </LinearGradient>
              <LinearGradient
                colors={["#C9A050", "#B8923E"]}
                style={styles.avatarEditBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="camera" size={14} color="#1a1a2e" />
              </LinearGradient>
            </Pressable>
            <Text style={styles.profileTitle}>Мой профиль</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={18} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.logoutButtonText}>Выйти</Text>
            </Pressable>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={["rgba(74, 144, 164, 0.35)", "rgba(74, 144, 164, 0.12)"]}
                style={styles.statIconBg}
              >
                <MaterialCommunityIcons name="meditation" size={24} color="#6BB3D0" />
              </LinearGradient>
              <Text style={styles.statValue}>{stats?.totalAntianxietySessions || 0}</Text>
              <Text style={styles.statLabel}>Антитревога</Text>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={["rgba(74, 157, 122, 0.35)", "rgba(74, 157, 122, 0.12)"]}
                style={styles.statIconBg}
              >
                <MaterialCommunityIcons name="calendar-check" size={24} color="#5BB89A" />
              </LinearGradient>
              <Text style={styles.statValue}>
                {stats?.programCompletedDays || 0}/{stats?.programTotalDays || 7}
              </Text>
              <Text style={styles.statLabel}>Практика 7 дней</Text>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={["rgba(123, 107, 142, 0.35)", "rgba(123, 107, 142, 0.12)"]}
                style={styles.statIconBg}
              >
                <MaterialCommunityIcons name="emoticon-outline" size={24} color="#9B8BB0" />
              </LinearGradient>
              <Text style={styles.statValue}>{stats?.totalTrackerEntries || 0}</Text>
              <Text style={styles.statLabel}>Я сегодня</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Антитревога</Text>
            <Text style={styles.sectionSubtitle}>Упражнения для снятия тревоги</Text>

            <View style={styles.exerciseGrid}>
              {(Object.keys(EXERCISE_LABELS) as ExerciseType[]).map((type) => {
                const { label, icon, color } = EXERCISE_LABELS[type];
                const count = stats?.exerciseCounts[type] || 0;
                return (
                  <View key={type} style={styles.exerciseCard}>
                    <View style={styles.exerciseCardRow}>
                      <View style={[styles.exerciseIcon, { backgroundColor: `${color}20` }]}>
                        <MaterialCommunityIcons name={icon} size={18} color={color} />
                      </View>
                      <Text style={styles.exerciseLabel} numberOfLines={1}>{label}</Text>
                      <Text style={[styles.exerciseCount, { color }]}>{count}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {stats?.lastAntianxietySession && (
              <View style={styles.lastActivity}>
                <MaterialCommunityIcons name="history" size={16} color="rgba(255, 255, 255, 0.5)" />
                <Text style={styles.lastActivityText}>
                  Последнее: {EXERCISE_LABELS[stats.lastAntianxietySession.exerciseType].label},{" "}
                  {formatDate(stats.lastAntianxietySession.completedAt)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Я сегодня</Text>
            <Text style={styles.sectionSubtitle}>Трекер эмоций и самочувствия</Text>

            {stats && stats.totalTrackerEntries > 0 ? (
              <>
                <View style={styles.anxietyCard}>
                  <View style={styles.anxietyHeader}>
                    <Text style={styles.anxietyLabel}>Средний уровень тревоги</Text>
                    <Text style={styles.anxietyValue}>{stats.avgAnxietyLevel}/10</Text>
                  </View>
                  <View style={styles.anxietyBar}>
                    <LinearGradient
                      colors={["#C75450", "#E07A76", "#C75450"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.anxietyProgress, { width: `${(stats.avgAnxietyLevel / 10) * 100}%` }]}
                    />
                  </View>
                </View>

                {getTopEmotions().length > 0 && (
                  <View style={styles.emotionsCard}>
                    <Text style={styles.emotionsTitle}>Частые эмоции</Text>
                    <View style={styles.emotionsList}>
                      {getTopEmotions().map(({ key, label, count }) => (
                        <View key={key} style={styles.emotionTag}>
                          <Text style={styles.emotionLabel}>{label}</Text>
                          <Text style={styles.emotionCount}>{count}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {stats.lastTrackerEntry && (
                  <View style={styles.lastActivity}>
                    <MaterialCommunityIcons name="history" size={16} color="rgba(255, 255, 255, 0.5)" />
                    <Text style={styles.lastActivityText}>
                      Последняя запись: {formatDate(stats.lastTrackerEntry.date)}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="emoticon-neutral-outline" size={40} color="rgba(255, 255, 255, 0.3)" />
                <Text style={styles.emptyText}>Записей пока нет</Text>
                <Text style={styles.emptyHint}>Заполняйте трекер «Я сегодня» для отслеживания прогресса</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Практика 7 дней</Text>
            <Text style={styles.sectionSubtitle}>Программа работы с самооценкой</Text>

            <View style={styles.programProgress}>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const progress = stats?.programCompletedDays || 0;
                const isCompleted = day <= progress;
                const hasData = stats?.programCompletedDays !== undefined && progress > 0;
                return (
                  <View
                    key={day}
                    style={[
                      styles.dayCircle,
                      isCompleted && styles.dayCircleCompleted,
                      !isCompleted && hasData && day === progress + 1 && styles.dayCircleCurrent,
                    ]}
                  >
                    {isCompleted ? (
                      <LinearGradient
                        colors={["#5BB89A", "#4A9D7A", "#3D8B68"]}
                        style={styles.dayCircleInner}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                      </LinearGradient>
                    ) : (
                      <Text style={styles.dayNumber}>{day}</Text>
                    )}
                  </View>
                );
              })}
            </View>

            <Text style={styles.programHint}>
              {stats?.programCompletedDays === 7
                ? "Вы прошли всю программу!"
                : `Пройдено ${stats?.programCompletedDays || 0} из 7 дней`}
            </Text>
          </View>

          <View style={styles.footerSpace} />
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
      default: {},
    }),
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: "hidden",
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(26, 26, 46, 0.9)",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    ...Platform.select({
      ios: {
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
      },
      default: {},
    }),
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
  statIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  exerciseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  exerciseCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  exerciseCardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  exerciseLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  exerciseCount: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 6,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  lastActivity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  lastActivityText: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  anxietyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  anxietyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  anxietyLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  anxietyValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#C75450",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  anxietyBar: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
    overflow: "hidden",
  },
  anxietyProgress: {
    height: "100%",
    borderRadius: 5,
  },
  emotionsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  emotionsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  emotionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emotionTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  emotionLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  emotionCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 24,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  emptyHint: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.35)",
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 20,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  programProgress: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
  },
  dayCircleCompleted: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  dayCircleInner: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleCurrent: {
    borderColor: "#5BB89A",
    borderWidth: 2.5,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  programHint: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  footerSpace: {
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingRing: {
    padding: 24,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  loadingText: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif", default: "sans-serif" }),
  },
  authPrompt: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  authIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(74, 144, 164, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  authSubtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  authFeatures: {
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    padding: 20,
    gap: 16,
    marginBottom: 32,
  },
  authFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  authFeatureText: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  authButton: {
    alignSelf: "stretch",
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#4A90A4",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  authButtonGradient: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  authFeatureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  authButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  logoutButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

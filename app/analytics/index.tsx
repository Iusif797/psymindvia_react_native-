import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import MoodChart from "../../components/MoodChart";
import { database, type TrackerEntry } from "../../services/database";

const { width } = Dimensions.get("window");

type TimePeriod = "week" | "month" | "all";

const WEEKDAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const WEEKDAY_FULL = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

const EMOTION_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  calm: { label: "Спокойствие", color: "#4A9D7A", icon: "emoticon-happy-outline" },
  joy: { label: "Радость", color: "#F4C542", icon: "emoticon-excited-outline" },
  sadness: { label: "Грусть", color: "#6B8EAD", icon: "emoticon-sad-outline" },
  anxiety: { label: "Тревога", color: "#C08450", icon: "emoticon-confused-outline" },
  anger: { label: "Злость", color: "#C75450", icon: "emoticon-angry-outline" },
  fear: { label: "Страх", color: "#7B6B8E", icon: "emoticon-dead-outline" },
  emptiness: { label: "Пустота", color: "#8A8A8A", icon: "emoticon-neutral-outline" },
  hope: { label: "Надежда", color: "#4A90A4", icon: "emoticon-cool-outline" },
};

interface AnalyticsData {
  entries: TrackerEntry[];
  avgAnxiety: number;
  totalEntries: number;
  chartData: { date: string; value: number; label: string }[];
  emotionFrequency: { emotion: string; count: number; percentage: number }[];
  weekdayPattern: { day: string; avgAnxiety: number; count: number }[];
  emotionPairs: { pair: string[]; count: number }[];
  anxietyTrend: "up" | "down" | "stable";
  streakDays: number;
}

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState<TimePeriod>("week");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = useCallback(async () => {
    const entries = await database.getTrackerEntries();
    const filteredEntries = filterByPeriod(entries, period);
    const analytics = calculateAnalytics(filteredEntries, entries);
    setData(analytics);
    setLoading(false);
  }, [period]);

  useFocusEffect(
    useCallback(() => {
      loadAnalytics();
    }, [loadAnalytics])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  }, [loadAnalytics]);

  const filterByPeriod = (entries: TrackerEntry[], p: TimePeriod) => {
    const now = new Date();
    let cutoff: Date;

    switch (p) {
      case "week":
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return entries;
    }

    return entries.filter((e) => new Date(e.date) >= cutoff);
  };

  const calculateAnalytics = (entries: TrackerEntry[], allEntries: TrackerEntry[]): AnalyticsData => {
    const totalEntries = entries.length;
    const avgAnxiety = totalEntries > 0
      ? Math.round((entries.reduce((sum, e) => sum + e.anxietyLevel, 0) / totalEntries) * 10) / 10
      : 0;

    const chartData = entries
      .slice(0, 7)
      .reverse()
      .map((e) => {
        const date = new Date(e.date);
        return {
          date: e.date,
          value: e.anxietyLevel,
          label: WEEKDAYS[date.getDay()],
        };
      });

    const emotionCounts: Record<string, number> = {};
    entries.forEach((e) => {
      e.emotions.forEach((em) => {
        emotionCounts[em] = (emotionCounts[em] || 0) + 1;
      });
    });

    const totalEmotions = Object.values(emotionCounts).reduce((a, b) => a + b, 0) || 1;
    const emotionFrequency = Object.entries(emotionCounts)
      .map(([emotion, count]) => ({
        emotion,
        count,
        percentage: Math.round((count / totalEmotions) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const weekdayData: Record<number, { total: number; count: number }> = {};
    for (let i = 0; i < 7; i++) {
      weekdayData[i] = { total: 0, count: 0 };
    }
    entries.forEach((e) => {
      const day = new Date(e.date).getDay();
      weekdayData[day].total += e.anxietyLevel;
      weekdayData[day].count += 1;
    });

    const weekdayPattern = Object.entries(weekdayData).map(([dayNum, { total, count }]) => ({
      day: WEEKDAY_FULL[parseInt(dayNum)],
      avgAnxiety: count > 0 ? Math.round((total / count) * 10) / 10 : 0,
      count,
    }));

    const pairCounts: Record<string, number> = {};
    entries.forEach((e) => {
      if (e.emotions.length >= 2) {
        for (let i = 0; i < e.emotions.length - 1; i++) {
          for (let j = i + 1; j < e.emotions.length; j++) {
            const pair = [e.emotions[i], e.emotions[j]].sort().join("|");
            pairCounts[pair] = (pairCounts[pair] || 0) + 1;
          }
        }
      }
    });

    const emotionPairs = Object.entries(pairCounts)
      .map(([pair, count]) => ({ pair: pair.split("|"), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    let anxietyTrend: "up" | "down" | "stable" = "stable";
    if (entries.length >= 4) {
      const half = Math.floor(entries.length / 2);
      const recentAvg = entries.slice(0, half).reduce((s, e) => s + e.anxietyLevel, 0) / half;
      const olderAvg = entries.slice(half).reduce((s, e) => s + e.anxietyLevel, 0) / (entries.length - half);
      if (recentAvg > olderAvg + 0.5) anxietyTrend = "up";
      else if (recentAvg < olderAvg - 0.5) anxietyTrend = "down";
    }

    let streakDays = 0;
    if (allEntries.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const sortedDates = [...new Set(allEntries.map((e) => {
        const d = new Date(e.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      }))].sort((a, b) => b - a);

      const todayTime = today.getTime();
      const yesterdayTime = todayTime - 24 * 60 * 60 * 1000;

      if (sortedDates[0] === todayTime || sortedDates[0] === yesterdayTime) {
        let currentDate = sortedDates[0];
        for (const date of sortedDates) {
          if (date === currentDate) {
            streakDays++;
            currentDate -= 24 * 60 * 60 * 1000;
          } else {
            break;
          }
        }
      }
    }

    return {
      entries,
      avgAnxiety,
      totalEntries,
      chartData,
      emotionFrequency,
      weekdayPattern,
      emotionPairs,
      anxietyTrend,
      streakDays,
    };
  };

  const getAnxietyColor = (level: number) => {
    if (level <= 3) return "#4A9D7A";
    if (level <= 6) return "#C08450";
    return "#C75450";
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return { icon: "trending-up", color: "#C75450" };
      case "down":
        return { icon: "trending-down", color: "#4A9D7A" };
      default:
        return { icon: "trending-neutral", color: "#8A8A8A" };
    }
  };

  const getTrendText = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "Уровень тревоги растёт";
      case "down":
        return "Тревога снижается";
      default:
        return "Стабильный уровень";
    }
  };

  if (loading || !data) {
    return (
      <BackgroundWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Загрузка аналитики...</Text>
        </View>
      </BackgroundWrapper>
    );
  }

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
          <View style={styles.header}>
            <Text style={styles.title}>Аналитика</Text>
            <Text style={styles.subtitle}>Твои паттерны и тренды</Text>
          </View>

          <View style={styles.periodSelector}>
            {(["week", "month", "all"] as TimePeriod[]).map((p) => (
              <Pressable
                key={p}
                style={[
                  styles.periodButton,
                  period === p && styles.periodButtonActive,
                ]}
                onPress={() => setPeriod(p)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    period === p && styles.periodButtonTextActive,
                  ]}
                >
                  {p === "week" ? "Неделя" : p === "month" ? "Месяц" : "Всё время"}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={["rgba(74, 144, 164, 0.3)", "rgba(74, 144, 164, 0.1)"]}
                style={styles.statIcon}
              >
                <MaterialCommunityIcons name="calendar-check" size={22} color="#6BB3D0" />
              </LinearGradient>
              <Text style={styles.statValue}>{data.totalEntries}</Text>
              <Text style={styles.statLabel}>записей</Text>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={[`${getAnxietyColor(data.avgAnxiety)}40`, `${getAnxietyColor(data.avgAnxiety)}15`]}
                style={styles.statIcon}
              >
                <MaterialCommunityIcons
                  name="heart-pulse"
                  size={22}
                  color={getAnxietyColor(data.avgAnxiety)}
                />
              </LinearGradient>
              <Text style={[styles.statValue, { color: getAnxietyColor(data.avgAnxiety) }]}>
                {data.avgAnxiety}
              </Text>
              <Text style={styles.statLabel}>ср. тревога</Text>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={["rgba(244, 197, 66, 0.3)", "rgba(244, 197, 66, 0.1)"]}
                style={styles.statIcon}
              >
                <MaterialCommunityIcons name="fire" size={22} color="#F4C542" />
              </LinearGradient>
              <Text style={[styles.statValue, { color: "#F4C542" }]}>{data.streakDays}</Text>
              <Text style={styles.statLabel}>дней подряд</Text>
            </View>
          </View>

          {data.totalEntries > 0 && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Тревожность за период</Text>
                <View style={styles.chartCard}>
                  <MoodChart data={data.chartData} height={160} color="#4A90A4" />
                </View>

                {data.anxietyTrend !== "stable" && (
                  <View style={styles.trendBadge}>
                    <MaterialCommunityIcons
                      name={getTrendIcon(data.anxietyTrend).icon as any}
                      size={18}
                      color={getTrendIcon(data.anxietyTrend).color}
                    />
                    <Text
                      style={[
                        styles.trendText,
                        { color: getTrendIcon(data.anxietyTrend).color },
                      ]}
                    >
                      {getTrendText(data.anxietyTrend)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Частые эмоции</Text>
                <View style={styles.emotionsCard}>
                  {data.emotionFrequency.map(({ emotion, count, percentage }) => {
                    const info = EMOTION_LABELS[emotion] || {
                      label: emotion,
                      color: "#8A8A8A",
                      icon: "emoticon-outline",
                    };
                    return (
                      <View key={emotion} style={styles.emotionRow}>
                        <View style={styles.emotionInfo}>
                          <View style={[styles.emotionIcon, { backgroundColor: `${info.color}25` }]}>
                            <MaterialCommunityIcons
                              name={info.icon as any}
                              size={18}
                              color={info.color}
                            />
                          </View>
                          <Text style={styles.emotionLabel}>{info.label}</Text>
                        </View>
                        <View style={styles.emotionBarContainer}>
                          <View style={styles.emotionBarBg}>
                            <LinearGradient
                              colors={[info.color, `${info.color}80`]}
                              style={[styles.emotionBar, { width: `${percentage}%` }]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            />
                          </View>
                          <Text style={styles.emotionPercent}>{percentage}%</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {data.emotionPairs.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Частые сочетания</Text>
                  <Text style={styles.sectionSubtitle}>Эмоции, которые ты чувствуешь вместе</Text>
                  <View style={styles.pairsCard}>
                    {data.emotionPairs.map(({ pair, count }, idx) => {
                      const em1 = EMOTION_LABELS[pair[0]] || { label: pair[0], color: "#8A8A8A" };
                      const em2 = EMOTION_LABELS[pair[1]] || { label: pair[1], color: "#8A8A8A" };
                      return (
                        <View key={idx} style={styles.pairRow}>
                          <View style={styles.pairEmotions}>
                            <View style={[styles.pairTag, { backgroundColor: `${em1.color}25` }]}>
                              <Text style={[styles.pairTagText, { color: em1.color }]}>
                                {em1.label}
                              </Text>
                            </View>
                            <Text style={styles.pairPlus}>+</Text>
                            <View style={[styles.pairTag, { backgroundColor: `${em2.color}25` }]}>
                              <Text style={[styles.pairTagText, { color: em2.color }]}>
                                {em2.label}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.pairCount}>{count}x</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Тревожность по дням</Text>
                <Text style={styles.sectionSubtitle}>Когда тревога выше?</Text>
                <View style={styles.weekdayCard}>
                  {data.weekdayPattern.map(({ day, avgAnxiety, count }) => {
                    if (count === 0) return null;
                    const barHeight = (avgAnxiety / 10) * 80;
                    return (
                      <View key={day} style={styles.weekdayItem}>
                        <View style={styles.weekdayBar}>
                          <LinearGradient
                            colors={[getAnxietyColor(avgAnxiety), `${getAnxietyColor(avgAnxiety)}60`]}
                            style={[styles.weekdayBarFill, { height: barHeight }]}
                          />
                        </View>
                        <Text style={styles.weekdayLabel}>{day.slice(0, 2)}</Text>
                        <Text style={styles.weekdayValue}>{avgAnxiety}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </>
          )}

          {data.totalEntries === 0 && (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={["rgba(74, 144, 164, 0.2)", "rgba(123, 107, 142, 0.1)"]}
                style={styles.emptyIcon}
              >
                <MaterialCommunityIcons name="chart-line" size={48} color="#6BB3D0" />
              </LinearGradient>
              <Text style={styles.emptyTitle}>Пока нет данных</Text>
              <Text style={styles.emptyText}>
                Заполняй трекер «Я сегодня», чтобы видеть свою аналитику
              </Text>
            </View>
          )}

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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: "rgba(74, 144, 164, 0.3)",
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  periodButtonTextActive: {
    color: "#6BB3D0",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
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
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 14,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  chartCard: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 20,
    padding: 20,
    paddingLeft: 36,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
  },
  trendText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  emotionsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 20,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  emotionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emotionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: 130,
  },
  emotionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
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
  emotionBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  emotionBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  emotionBar: {
    height: "100%",
    borderRadius: 4,
  },
  emotionPercent: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
    width: 36,
    textAlign: "right",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  pairsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 20,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  pairRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pairEmotions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pairTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  pairTagText: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  pairPlus: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.4)",
  },
  pairCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  weekdayCard: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  weekdayItem: {
    alignItems: "center",
  },
  weekdayBar: {
    width: 24,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    justifyContent: "flex-end",
    overflow: "hidden",
    marginBottom: 8,
  },
  weekdayBarFill: {
    width: "100%",
    borderRadius: 12,
  },
  weekdayLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  weekdayValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  footerSpace: {
    height: 60,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

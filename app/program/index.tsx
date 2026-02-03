import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import { PROGRAM_DAYS } from "../../constants/program";

const DAY_ICONS: Record<number, keyof typeof MaterialCommunityIcons.glyphMap> = {
  1: "star-outline",
  2: "flag-checkered",
  3: "head-heart-outline",
  4: "shield-half-full",
  5: "heart-outline",
  6: "butterfly-outline",
  7: "check-decagram-outline",
};

export default function ProgramIndexScreen() {
  const handleDayPress = (dayId: number) => {
    router.push(`/program/${dayId}` as any);
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <View style={styles.ruleBadge}>
              <MaterialCommunityIcons
                name="timer-sand"
                size={18}
                color="#4A9D7A"
              />
              <Text style={styles.ruleBadgeText}>5 мин. УЗНАЛ! СДЕЛАЛ!</Text>
            </View>
            <Text style={styles.title}>Практика 7 дней</Text>
            <Text style={styles.subtitle}>
              Применяйте все техники на практике, чтобы видеть результат и не
              оставаться вечными учениками.
            </Text>
          </View>

          <View style={styles.daysSection}>
            {PROGRAM_DAYS.map((day) => (
              <Pressable
                key={day.id}
                style={styles.dayCard}
                onPress={() => handleDayPress(day.id)}
              >
                <View style={styles.dayIconWrap}>
                  <MaterialCommunityIcons
                    name={DAY_ICONS[day.id] ?? "circle-outline"}
                    size={24}
                    color="#4A9D7A"
                  />
                </View>
                <View style={styles.dayContent}>
                  <Text style={styles.dayTitle}>{day.title}</Text>
                  <Text style={styles.daySubtitle}>{day.subtitle}</Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="rgba(255, 255, 255, 0.4)"
                />
              </Pressable>
            ))}
          </View>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  headerSection: {
    marginBottom: 28,
  },
  ruleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(74, 157, 122, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 16,
  },
  ruleBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A9D7A",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 26,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  daysSection: {
    gap: 14,
  },
  dayCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  dayIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(74, 157, 122, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  dayContent: {
    flex: 1,
  },
  dayTitle: {
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
  daySubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

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

type Practice = {
  id: string;
  route: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  duration: string;
  color: string;
};

const PRACTICES: Practice[] = [
  {
    id: "breathing",
    route: "/antianxiety/breathing",
    icon: "weather-windy",
    title: "Дыхание",
    description: "Техника 4-7-8 для быстрого успокоения",
    duration: "2-3 мин",
    color: "#4A90A4",
  },
  {
    id: "grounding",
    route: "/antianxiety/grounding",
    icon: "leaf",
    title: "Заземление",
    description: "Техника 5-4-3-2-1 для возврата в настоящее",
    duration: "3-5 мин",
    color: "#4A9D7A",
  },
  {
    id: "cbt",
    route: "/antianxiety/cbt",
    icon: "head-lightbulb-outline",
    title: "Разбор мысли",
    description: "Когнитивная техника для работы с тревожной мыслью",
    duration: "5-7 мин",
    color: "#7B6B8E",
  },
  {
    id: "body",
    route: "/antianxiety/body",
    icon: "human-handsup",
    title: "Тело",
    description: "Телесная стабилизация и расслабление",
    duration: "3-5 мин",
    color: "#C08450",
  },
];

export default function AntiAnxietyScreen() {
  const handlePracticePress = (route: string) => {
    router.push(route as any);
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
            <View style={styles.emergencyBadge}>
              <MaterialCommunityIcons
                name="heart-pulse"
                size={20}
                color="#C75450"
              />
              <Text style={styles.emergencyBadgeText}>Экстренная помощь</Text>
            </View>

            <Text style={styles.title}>Мне сейчас плохо</Text>
            <Text style={styles.subtitle}>
              Это пройдёт. Давай вместе пройдём через это. Выбери, что тебе ближе
              прямо сейчас.
            </Text>
          </View>

          <View style={styles.practicesSection}>
            {PRACTICES.map((practice) => (
              <Pressable
                key={practice.id}
                style={styles.practiceCard}
                onPress={() => handlePracticePress(practice.route)}
              >
                <View
                  style={[
                    styles.practiceIconWrapper,
                    { backgroundColor: `${practice.color}20` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={practice.icon}
                    size={28}
                    color={practice.color}
                  />
                </View>
                <View style={styles.practiceContent}>
                  <View style={styles.practiceHeader}>
                    <Text style={styles.practiceTitle}>{practice.title}</Text>
                    <Text style={styles.practiceDuration}>{practice.duration}</Text>
                  </View>
                  <Text style={styles.practiceDescription}>
                    {practice.description}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="rgba(255, 255, 255, 0.4)"
                />
              </Pressable>
            ))}
          </View>

          <View style={styles.reminderSection}>
            <View style={styles.reminderCard}>
              <MaterialCommunityIcons
                name="information-outline"
                size={24}
                color="rgba(255, 255, 255, 0.6)"
              />
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>Помни</Text>
                <Text style={styles.reminderText}>
                  Тревога — это реакция тела. Она не опасна, даже если неприятна.
                  Ты справляешься.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.crisisSection}>
            <Text style={styles.crisisTitle}>Если очень тяжело</Text>
            <Text style={styles.crisisText}>
              Эти практики — поддержка, не терапия. Если тебе нужна профессиональная
              помощь, обратись к специалисту.
            </Text>
            <Pressable
              style={styles.contactButton}
              onPress={() => router.push("/contact")}
            >
              <Text style={styles.contactButtonText}>Связаться с психологом</Text>
            </Pressable>
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
  emergencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(199, 84, 80, 0.15)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 16,
  },
  emergencyBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#C75450",
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
  practicesSection: {
    gap: 14,
    marginBottom: 28,
  },
  practiceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  practiceIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  practiceContent: {
    flex: 1,
  },
  practiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  practiceDuration: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  practiceDescription: {
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
  reminderSection: {
    marginBottom: 28,
  },
  reminderCard: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  reminderText: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.55)",
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  crisisSection: {
    alignItems: "center",
    paddingTop: 8,
  },
  crisisTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  crisisText: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  contactButton: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

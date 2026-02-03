import { View, Text, StyleSheet, ScrollView, StatusBar, Platform, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../components/BackgroundWrapper";

const { height } = Dimensions.get("window");

type Item = {
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
};

const items: Item[] = [
  {
    title: "Диплом о профессиональной переподготовке",
    subtitle: "Квалификация в области психологического консультирования и психотерапии",
    icon: "school-outline",
    accent: "#4A90A4",
  },
  {
    title: "Диплом психолога-практика",
    subtitle: "Квалификация в области практической психологии и психологического консультирования",
    icon: "account-tie-outline",
    accent: "#7B6B8E",
  },
  {
    title: "Сертификат квалифицированного специалиста",
    subtitle: "Обучение современным техникам психологической помощи",
    icon: "certificate-outline",
    accent: "#C08450",
  },
  {
    title: "Сертификат о профессиональной подготовке",
    subtitle: "Специализация в области интегральной психологии",
    icon: "shield-star-outline",
    accent: "#4A9D7A",
  },
  {
    title: "Диплом профессионального психолога",
    subtitle: "Специализация: психологическое консультирование и терапия",
    icon: "badge-account-outline",
    accent: "#6B8EAD",
  },
];

export default function Education() {
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>Образование</Text>
            <Text style={styles.heroTitle}>Образование и квалификация</Text>
            <Text style={styles.heroText}>
              Профессиональная подготовка и сертификация. Постоянно совершенствую навыки, проходя
              дополнительные курсы и тренинги.
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          {items.map((it) => (
            <View key={it.title} style={styles.card}>
              <View style={[styles.iconWrap, { backgroundColor: `${it.accent}15` }]}>
                <MaterialCommunityIcons name={it.icon as any} size={28} color={it.accent} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{it.title}</Text>
                <Text style={styles.cardSubtitle}>{it.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  scrollView: { flex: 1 },
  contentContainer: { paddingBottom: 40 },
  heroSection: {
    minHeight: height * 0.3,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  heroContent: {
    justifyContent: "center",
  },
  heroEyebrow: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 1.5,
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 42,
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroText: {
    fontSize: 17,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.95)",
    lineHeight: 26,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  list: { paddingHorizontal: 24, paddingTop: 32, gap: 16 },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 26,
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

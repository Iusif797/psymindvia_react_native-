import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, Platform, Dimensions } from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../components/BackgroundWrapper";

const { height } = Dimensions.get("window");

type Course = {
  title: string;
  subtitle: string;
  meta: { label: string; value: string }[];
  cta: string;
  price: string;
  accent: string;
};

const courses: Course[] = [
  {
    title: "Курс по системным расстановкам",
    subtitle: "по Берту Хеллингеру",
    meta: [
      { label: "Формат", value: "дистанционное" },
      { label: "Старт", value: "1 октября 2025" },
      { label: "Длительность", value: "2,5 месяца" },
      { label: "Тип", value: "семинар" },
    ],
    cta: "Оставить заявку",
    price: "600 $",
    accent: "#4A90A4",
  },
  {
    title: "Мастерство системных расстановок",
    subtitle: "Глубокий терапевтический подход для работы с семейными системами",
    meta: [
      { label: "Формат", value: "по программе" },
      { label: "Фокус", value: "семейные и системные динамики" },
    ],
    cta: "Оставить заявку",
    price: "500 $",
    accent: "#7B6B8E",
  },
  {
    title: "НЛП Практик",
    subtitle: "Эффективные техники коммуникации и личностного роста",
    meta: [
      { label: "Формат", value: "дистанционное и очное" },
      { label: "Старт", value: "1 октября 2025" },
      { label: "Длительность", value: "2 месяца" },
      { label: "Тип", value: "семинар" },
    ],
    cta: "Оставить заявку",
    price: "от 300 $",
    accent: "#C08450",
  },
  {
    title: "Регрессия: Погружение в Память Души и Мультивселенную",
    subtitle: "Путешествие в прошлые жизни, родовые каналы и межвоплощенческое пространство",
    meta: [
      { label: "Формат", value: "онлайн" },
      { label: "Старт", value: "15 сентября 2025" },
      { label: "Длительность", value: "7 недель" },
      { label: "Тип", value: "интенсив" },
    ],
    cta: "Оставить заявку",
    price: "650 $",
    accent: "#4A9D7A",
  },
  {
    title: "Практическая психология",
    subtitle: "Комплексный курс для освоения практических навыков психологической помощи",
    meta: [
      { label: "Формат", value: "онлайн" },
      { label: "Старт", value: "20 ноября 2025" },
      { label: "Длительность", value: "6 месяцев" },
      { label: "Тип", value: "курс" },
    ],
    cta: "Оставить заявку",
    price: "500 $",
    accent: "#6B8EAD",
  },
  {
    title: "Практическая психология. Этапы психологического консультирования",
    subtitle: "От теории и техник до работы с реальными кейсами",
    meta: [
      { label: "Формат", value: "лекции + практика" },
      { label: "Старт", value: "Открыт набор" },
      { label: "Длительность", value: "6 месяцев" },
      { label: "Стоимость", value: "уточняется" },
    ],
    cta: "Оставить заявку",
    price: "Уточняется",
    accent: "#D97A7A",
  },
  {
    title: "Когнитивно-поведенческая терапия (КПТ)",
    subtitle: "Практический курс по когнитивно-поведенческой терапии",
    meta: [
      { label: "Формат", value: "онлайн / офлайн" },
      { label: "Старт", value: "По мере набора группы" },
      { label: "Длительность", value: "42 ак. часа" },
      { label: "Тип", value: "курс" },
    ],
    cta: "Оставить заявку",
    price: "600 $",
    accent: "#4A90A4",
  },
  {
    title: "Психосоматика и нейропсихология",
    subtitle:
      "Курс по работе с психосоматическими расстройствами и регуляции нервной системы",
    meta: [
      { label: "Формат", value: "онлайн" },
      { label: "Старт", value: "По мере набора группы" },
      { label: "Длительность", value: "16 занятий" },
      { label: "Тип", value: "курс" },
    ],
    cta: "Оставить заявку",
    price: "500 $",
    accent: "#7B6B8E",
  },
];

export default function Courses() {
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>MINDVIA</Text>
            <Text style={styles.heroTitle}>Образовательные курсы</Text>
            <Text style={styles.heroText}>
              Профессиональные программы обучения от дипломированного психолога с многолетним опытом
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          {courses.map((course, idx) => (
              <View key={`${course.title}-${idx}`} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.accentDot, { backgroundColor: course.accent }]} />
                  <Text
                    style={styles.cardTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {course.title}
                  </Text>
                </View>
                <Text
                  style={styles.cardSubtitle}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {course.subtitle}
                </Text>

                <View style={styles.metaGrid}>
                  {course.meta.map((m, mi) => (
                    <View key={`${course.title}-${m.label}-${mi}`} style={styles.metaItem}>
                      <Text style={styles.metaLabel}>{m.label}</Text>
                      <Text style={styles.metaValue} numberOfLines={1} ellipsizeMode="tail">
                        {m.value}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.cardBottom}>
                  <View style={styles.priceWrap}>
                    <Text style={styles.priceLabel}>Стоимость</Text>
                    <Text style={styles.priceValue} numberOfLines={1} ellipsizeMode="tail">
                      {course.price}
                    </Text>
                  </View>
                  <Link href="/contact" asChild>
                    <Pressable style={[styles.ctaButton, { backgroundColor: course.accent }]}>
                      <Text style={styles.ctaText}>{course.cta}</Text>
                      <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
                    </Pressable>
                  </Link>
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
  list: { paddingHorizontal: 24, paddingTop: 32, gap: 20 },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    overflow: "hidden",
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 10 },
  accentDot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 24,
    maxHeight: 48,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.65)",
    lineHeight: 22,
    marginBottom: 16,
    maxHeight: 44,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  metaItem: {
    width: "48%",
    minHeight: 56,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    justifyContent: "center",
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: 14,
    minHeight: 52,
  },
  priceWrap: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  ctaButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 52,
    flexShrink: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

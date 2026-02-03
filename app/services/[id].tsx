import { View, Text, StyleSheet, ScrollView, StatusBar, Pressable, Platform, Dimensions } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../../components/BackgroundWrapper";

const { height } = Dimensions.get("window");

const data: Record<
  string,
  {
    title: string;
    description: string;
    details: string[];
    duration: string;
    format: string;
    icon: string;
    color: string;
  }
> = {
  "1": {
    title: "Индивидуальные консультации",
    description:
      "Персональные сессии, направленные на работу с конкретными психологическими трудностями и достижение личностного роста.",
    details: [
      "Методы КПТ, квантовой психологии, МАК-терапии, Рилиф, НЛП и другие интегративные подходы",
      "Фокус на запросе и динамике, с которой вы пришли",
      "Поддержка и бережная работа в безопасном пространстве",
    ],
    duration: "По запросу",
    format: "Очно / онлайн",
    icon: "account-outline",
    color: "#4A90A4",
  },
  "2": {
    title: "Регрессивная терапия",
    description:
      "Глубокое исследование прошлых опытов души (прошлые жизни, перинатальный период, детские воспоминания) для осознания корней проблем, исцеления травм и освобождения от повторяющихся сценариев.",
    details: [
      "Прошлые жизни, перинатальный период, детские воспоминания",
      "Осознание корней проблем и исцеление травм",
      "Освобождение от повторяющихся сценариев",
    ],
    duration: "По запросу",
    format: "Очно / онлайн",
    icon: "history",
    color: "#7B6B8E",
  },
  "3": {
    title: "Системные расстановки",
    description:
      "Метод, позволяющий увидеть и разрешить невидимые связи и переплетения в семейной и родовой системе, влияющие на отношения, здоровье и судьбу.",
    details: [
      "Индивидуальные расстановки с использованием МАК-карт, якорей, фигурок и заместителей",
      "Диагностика скрытых динамик и бережная работа с системой",
      "Мягкие решения для восстановления баланса",
    ],
    duration: "По запросу",
    format: "Очно / онлайн",
    icon: "family-tree",
    color: "#C08450",
  },
  "4": {
    title: "Консультации для подростков и семей",
    description:
      "Специализированные сессии, направленные на решение кризисов подросткового возраста, вопросов идентичности, внутренних конфликтов, а также на улучшение семейных отношений.",
    details: [
      "Кризисы подросткового возраста и вопросы идентичности",
      "Внутренние конфликты и эмоциональная регуляция",
      "Улучшение семейных отношений и коммуникации",
    ],
    duration: "По запросу",
    format: "Очно / онлайн",
    icon: "account-child-outline",
    color: "#4A9D7A",
  },
  "5": {
    title: "Работа с родом и семейной системой",
    description: "Исцеление родовых травм, восстановление силы рода и разрешение системных проблем.",
    details: ["Исцеление родовых травм", "Восстановление силы рода", "Разрешение системных проблем"],
    duration: "По запросу",
    format: "Очно / онлайн",
    icon: "leaf-circle-outline",
    color: "#6B8EAD",
  },
  "6": {
    title: "Обучение (курсы и мастер-классы)",
    description:
      "Обучение методам НЛП, системных расстановок, КПТ, гештальт-терапии и квантовым механизмам работы психики.",
    details: [
      "НЛП, системные расстановки, КПТ, гештальт-терапия",
      "Квантовые механизмы работы психики",
      "Формат: курсы и мастер-классы",
    ],
    duration: "По программе",
    format: "Дистанционно / очно",
    icon: "school-outline",
    color: "#D97A7A",
  },
};

export default function ServiceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const service = data[id] || data["1"];

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <View style={[styles.iconContainer, { backgroundColor: `${service.color}25` }]}>
              <MaterialCommunityIcons name={service.icon as any} size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.heroTitle}>{service.title}</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.description}>{service.description}</Text>
          
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="clock-outline" size={26} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Длительность</Text>
                <Text style={styles.infoValue}>{service.duration}</Text>
              </View>
            </View>
            
            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="map-marker-outline" size={26} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Формат</Text>
                <Text style={styles.infoValue}>{service.format}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.detailsSection}>
            <Text style={styles.detailsTitle}>Что включает:</Text>
            {service.details.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <MaterialCommunityIcons name="check-circle" size={22} color={service.color} />
                <Text style={styles.detailText}>{detail}</Text>
              </View>
            ))}
          </View>
          
          <Link href="/contact" asChild>
            <Pressable style={[styles.ctaButton, { backgroundColor: service.color }]}>
              <Text style={styles.ctaButtonText}>Записаться на консультацию</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
            </Pressable>
          </Link>
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
    paddingBottom: 40,
  },
  heroSection: {
    minHeight: height * 0.32,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  heroContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
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
  contentSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  description: {
    fontSize: 18,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 28,
    marginBottom: 32,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  infoSection: {
    gap: 14,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  infoContent: {
    marginLeft: 18,
  },
  infoLabel: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  infoValue: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  detailsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.3,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 14,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 26,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  ctaButton: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

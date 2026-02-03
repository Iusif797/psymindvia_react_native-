import { View, Text, Pressable, ScrollView, StyleSheet, StatusBar, Platform, Dimensions } from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../../components/BackgroundWrapper";

const { height } = Dimensions.get("window");

const services = [
  {
    id: "1",
    title: "Индивидуальные консультации",
    description:
      "Персональные сессии, направленные на работу с конкретными психологическими трудностями и достижение личностного роста.",
    icon: "account-outline",
    color: "#4A90A4",
  },
  {
    id: "2",
    title: "Регрессивная терапия",
    description:
      "Глубокое исследование прошлых опытов души (прошлые жизни, перинатальный период, детские воспоминания) для осознания корней проблем и исцеления травм.",
    icon: "history",
    color: "#7B6B8E",
  },
  {
    id: "3",
    title: "Системные расстановки",
    description:
      "Метод, позволяющий увидеть и разрешить невидимые связи и переплетения в семейной и родовой системе, влияющие на отношения, здоровье и судьбу.",
    icon: "family-tree",
    color: "#C08450",
  },
  {
    id: "4",
    title: "Консультации для подростков и семей",
    description:
      "Сессии, направленные на решение кризисов подросткового возраста, вопросов идентичности, внутренних конфликтов и улучшение семейных отношений.",
    icon: "account-child-outline",
    color: "#4A9D7A",
  },
  {
    id: "5",
    title: "Работа с родом и семейной системой",
    description: "Исцеление родовых травм, восстановление силы рода и разрешение системных проблем.",
    icon: "leaf-circle-outline",
    color: "#6B8EAD",
  },
  {
    id: "6",
    title: "Обучение (курсы и мастер-классы)",
    description:
      "Обучение методам НЛП, системных расстановок, КПТ, гештальт-терапии и квантовым механизмам работы психики.",
    icon: "school-outline",
    color: "#D97A7A",
  },
];

export default function Services() {
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Услуги</Text>
            <Text style={styles.heroSubtitle}>
              Я предлагаю широкий спектр психологических услуг, адаптированных под индивидуальные
              потребности каждого клиента.
            </Text>
          </View>
        </View>
        
        <View style={styles.servicesGrid}>
          {services.map((item) => (
            <Link key={item.id} href={`/services/${item.id}`} asChild>
              <Pressable style={styles.serviceCard}>
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                  <MaterialCommunityIcons name={item.icon as any} size={36} color={item.color} />
                </View>
                <Text style={styles.serviceTitle}>{item.title}</Text>
                <Text style={styles.serviceDescription}>{item.description}</Text>
                <View style={styles.arrowContainer}>
                  <MaterialCommunityIcons name="arrow-right" size={22} color={item.color} />
                </View>
              </Pressable>
            </Link>
          ))}
        </View>
        
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Готовы начать?</Text>
          <Text style={styles.ctaText}>
            Запишитесь на первую консультацию, и мы вместе определим наилучший подход для вашей ситуации.
          </Text>
          <Link href="/contact" asChild>
            <Pressable style={styles.ctaButton}>
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
    minHeight: height * 0.28,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  heroContent: {
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroSubtitle: {
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
  servicesGrid: {
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 18,
    marginBottom: 32,
  },
  serviceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 24,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.3,
  },
  serviceDescription: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  arrowContainer: {
    position: "absolute",
    top: 24,
    right: 24,
  },
  ctaSection: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 28,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.5,
  },
  ctaText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 26,
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  ctaButton: {
    backgroundColor: "#4A90A4",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
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

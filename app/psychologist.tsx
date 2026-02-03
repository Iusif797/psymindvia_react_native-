import { View, Text, StyleSheet, ScrollView, StatusBar, Platform, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../components/BackgroundWrapper";

const { height } = Dimensions.get("window");

export default function Psychologist() {
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>Психолог</Text>
            <Text style={styles.heroTitle}>Индивидуальный подход к решению ваших проблем</Text>
            <Text style={styles.heroQuote}>
              Моя миссия — быть вашим фонарем, который освещает дорогу в темные моменты, показывая вам
              свет
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Обо мне</Text>
          <Text style={styles.paragraph}>
            Я верю, что каждый человек заслуживает быть услышанным и понятым. Мой путь к профессии
            психолога начался с личного опыта преодоления трудностей, что дало мне глубокое понимание
            эмоциональных проблем и уникальную эмпатию.
          </Text>
          <Text style={styles.paragraph}>
            Я применяю научно обоснованные методики, адаптированные под индивидуальные потребности
            каждого клиента, создавая безопасное пространство для личностного роста и трансформации.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Принципы работы</Text>

          <View style={styles.featureCard}>
            <View style={[styles.iconWrap, { backgroundColor: "rgba(74, 144, 164, 0.1)" }]}>
              <MaterialCommunityIcons name="shield-check-outline" size={26} color="#4A90A4" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Безопасность и доверие</Text>
              <Text style={styles.featureText}>
                Создаю безопасное пространство, где вы можете свободно выражать свои мысли и чувства без
                страха осуждения.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.iconWrap, { backgroundColor: "rgba(123, 107, 142, 0.1)" }]}>
              <MaterialCommunityIcons name="account-cog-outline" size={26} color="#7B6B8E" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Индивидуальный подход</Text>
              <Text style={styles.featureText}>
                Разрабатываю стратегию работы, которая учитывает ваши уникальные потребности, особенности
                и жизненный опыт.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.iconWrap, { backgroundColor: "rgba(74, 157, 122, 0.1)" }]}>
              <MaterialCommunityIcons name="hand-heart-outline" size={26} color="#4A9D7A" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Поддержка и эмпатия</Text>
              <Text style={styles.featureText}>
                Сопровождаю вас на пути к изменениям с пониманием, терпением и безусловным принятием ваших
                чувств.
              </Text>
            </View>
          </View>
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
    minHeight: height * 0.36,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  heroContent: {
    justifyContent: "center",
  },
  heroEyebrow: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 10,
    letterSpacing: 1.5,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    fontStyle: "italic",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 40,
    marginBottom: 16,
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
  heroQuote: {
    fontSize: 17,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.95)",
    lineHeight: 26,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    fontStyle: "italic",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  section: { marginBottom: 32, paddingHorizontal: 24 },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 18,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 26,
    marginBottom: 14,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  featureCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 16,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  featureContent: { flex: 1 },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.2,
  },
  featureText: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

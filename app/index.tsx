import { View, Text, Pressable, StyleSheet, ScrollView, Dimensions, StatusBar, Platform } from "react-native";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../components/BackgroundWrapper";

const { width, height } = Dimensions.get("window");

export default function Home() {
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroSubtitle}>Психолог Теона Хаметова</Text>
            <Text style={styles.heroTitle}>Клинический психолог в Чехии и онлайн</Text>
            <Text style={styles.heroDescription}>
              Добро пожаловать в Школу MINDVIA — пространство роста, знаний и самопознания! Здесь
              начинается ваш путь в мир психологии.
            </Text>

            <View style={styles.heroButtonsRow}>
              <Link href="/contact" asChild>
                <Pressable style={styles.ctaButton}>
                  <Text style={styles.ctaButtonText}>Записаться</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </Pressable>
              </Link>
              <Pressable style={styles.secondaryHeroButton} onPress={() => router.push("/courses")}>
                <Text style={styles.secondaryHeroButtonText}>Курсы</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Основные разделы</Text>

          <View style={styles.menuGrid}>
            <Link href="/psychologist" asChild>
              <Pressable style={styles.menuCard}>
                <LinearGradient
                  colors={["rgba(126, 200, 227, 0.2)", "rgba(74, 144, 164, 0.05)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.menuCardGradient}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: "rgba(126, 200, 227, 0.25)" }]}>
                    <MaterialCommunityIcons name="account-star" size={34} color="#7EC8E3" />
                  </View>
                  <Text style={styles.menuCardTitle}>Психолог</Text>
                  <Text style={styles.menuCardDescription}>Миссия, подход, принципы работы</Text>
                  <View style={styles.menuCardArrow}>
                    <Ionicons name="arrow-forward-circle" size={24} color="rgba(126, 200, 227, 0.6)" />
                  </View>
                </LinearGradient>
              </Pressable>
            </Link>

            <Link href="/services" asChild>
              <Pressable style={styles.menuCard}>
                <LinearGradient
                  colors={["rgba(125, 206, 160, 0.2)", "rgba(74, 157, 122, 0.05)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.menuCardGradient}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: "rgba(125, 206, 160, 0.25)" }]}>
                    <MaterialCommunityIcons name="spa" size={34} color="#7DCEA0" />
                  </View>
                  <Text style={styles.menuCardTitle}>Услуги</Text>
                  <Text style={styles.menuCardDescription}>
                    Консультации, регрессия, расстановки
                  </Text>
                  <View style={styles.menuCardArrow}>
                    <Ionicons name="arrow-forward-circle" size={24} color="rgba(125, 206, 160, 0.6)" />
                  </View>
                </LinearGradient>
              </Pressable>
            </Link>

            <Link href="/courses" asChild>
              <Pressable style={styles.menuCard}>
                <LinearGradient
                  colors={["rgba(201, 160, 255, 0.2)", "rgba(147, 112, 219, 0.05)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.menuCardGradient}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: "rgba(201, 160, 255, 0.25)" }]}>
                    <MaterialCommunityIcons name="book-open-page-variant" size={34} color="#C9A0FF" />
                  </View>
                  <Text style={styles.menuCardTitle}>Обучение</Text>
                  <Text style={styles.menuCardDescription}>Курсы и мастер-классы MINDVIA</Text>
                  <View style={styles.menuCardArrow}>
                    <Ionicons name="arrow-forward-circle" size={24} color="rgba(201, 160, 255, 0.6)" />
                  </View>
                </LinearGradient>
              </Pressable>
            </Link>

            <Link href="/reviews" asChild>
              <Pressable style={styles.menuCard}>
                <LinearGradient
                  colors={["rgba(245, 183, 177, 0.2)", "rgba(240, 147, 131, 0.05)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.menuCardGradient}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: "rgba(245, 183, 177, 0.25)" }]}>
                    <MaterialCommunityIcons name="star-shooting" size={34} color="#F5B7B1" />
                  </View>
                  <Text style={styles.menuCardTitle}>Отзывы</Text>
                  <Text style={styles.menuCardDescription}>Что говорят клиенты о работе</Text>
                  <View style={styles.menuCardArrow}>
                    <Ionicons name="arrow-forward-circle" size={24} color="rgba(245, 183, 177, 0.6)" />
                  </View>
                </LinearGradient>
              </Pressable>
            </Link>
          </View>
        </View>
        
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Найди свой путь с MINDVIA</Text>
          <Text style={styles.aboutText}>
            Школа MINDVIA — это не просто обучение. Это путь к себе. Хочешь лучше понимать себя,
            других и выстраивать гармоничную жизнь?
          </Text>
          <Text style={styles.aboutText}>
            Мы создали MINDVIA, чтобы сделать психологию доступной, живой и глубокой.
          </Text>
          <Text style={styles.aboutText}>
            MINDVIA — не просто школа. Это путь к себе.
          </Text>
        </View>
        
        <View style={styles.approachSection}>
          <Text style={styles.sectionTitle}>Мой подход</Text>
          
          <View style={styles.approachGrid}>
            <LinearGradient
              colors={["rgba(74, 144, 164, 0.25)", "rgba(74, 144, 164, 0.08)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.approachCard}
            >
              <View style={styles.approachCardInner}>
                <View style={[styles.approachIconWrapper, { backgroundColor: "rgba(74, 144, 164, 0.3)" }]}>
                  <MaterialCommunityIcons name="shield-lock-outline" size={28} color="#7EC8E3" />
                </View>
                <Text style={styles.approachCardTitle}>Безопасность</Text>
                <Text style={styles.approachCardSubtitle}>и доверие</Text>
                <Text style={styles.approachCardText}>
                  Создаю безопасное пространство для свободного выражения мыслей и чувств
                </Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={["rgba(147, 112, 219, 0.25)", "rgba(147, 112, 219, 0.08)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.approachCard}
            >
              <View style={styles.approachCardInner}>
                <View style={[styles.approachIconWrapper, { backgroundColor: "rgba(147, 112, 219, 0.3)" }]}>
                  <MaterialCommunityIcons name="brain" size={28} color="#C9A0FF" />
                </View>
                <Text style={styles.approachCardTitle}>Наука</Text>
                <Text style={styles.approachCardSubtitle}>и доказательства</Text>
                <Text style={styles.approachCardText}>
                  Применяю научно обоснованные методики под ваши потребности
                </Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={["rgba(74, 157, 122, 0.25)", "rgba(74, 157, 122, 0.08)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.approachCard}
            >
              <View style={styles.approachCardInner}>
                <View style={[styles.approachIconWrapper, { backgroundColor: "rgba(74, 157, 122, 0.3)" }]}>
                  <MaterialCommunityIcons name="fingerprint" size={28} color="#7DCEA0" />
                </View>
                <Text style={styles.approachCardTitle}>Уникальность</Text>
                <Text style={styles.approachCardSubtitle}>каждого клиента</Text>
                <Text style={styles.approachCardText}>
                  Стратегия работы учитывает ваш опыт и особенности
                </Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={["rgba(240, 147, 131, 0.25)", "rgba(240, 147, 131, 0.08)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.approachCard}
            >
              <View style={styles.approachCardInner}>
                <View style={[styles.approachIconWrapper, { backgroundColor: "rgba(240, 147, 131, 0.3)" }]}>
                  <MaterialCommunityIcons name="heart-multiple-outline" size={28} color="#F5B7B1" />
                </View>
                <Text style={styles.approachCardTitle}>Эмпатия</Text>
                <Text style={styles.approachCardSubtitle}>и принятие</Text>
                <Text style={styles.approachCardText}>
                  Сопровождаю с пониманием и безусловным принятием
                </Text>
              </View>
            </LinearGradient>
          </View>
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
    minHeight: height * 0.5,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 48,
  },
  heroContent: {
    width: "100%",
    gap: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.95)",
    marginBottom: 12,
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    fontStyle: "italic",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    lineHeight: 42,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.5,
  },
  heroDescription: {
    fontSize: 17,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.95)",
    lineHeight: 26,
    marginBottom: 28,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  ctaButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  heroButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  secondaryHeroButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  secondaryHeroButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  menuSection: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.5,
  },
  menuGrid: {
    gap: 16,
  },
  menuCard: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  menuCardGradient: {
    padding: 22,
    position: "relative",
  },
  menuIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  menuCardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.3,
  },
  menuCardDescription: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 23,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    paddingRight: 36,
  },
  menuCardArrow: {
    position: "absolute",
    right: 18,
    bottom: 18,
  },
  aboutSection: {
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  aboutTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 18,
    lineHeight: 34,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.5,
  },
  aboutText: {
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
  },
  approachSection: {
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  approachGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  approachCard: {
    width: (width - 62) / 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
  },
  approachCardInner: {
    padding: 18,
    alignItems: "flex-start",
  },
  approachIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  approachCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.2,
  },
  approachCardSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  approachCardText: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.75)",
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

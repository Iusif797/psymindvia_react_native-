import { View, Text, StyleSheet, ScrollView, StatusBar, Platform, Dimensions, Pressable } from "react-native";
import { router, type Href } from "expo-router";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import { courses } from "../../constants/courses";
import { useCoursePurchases } from "../../hooks/useCoursePurchases";

const { height } = Dimensions.get("window");

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

export default function Courses() {
  const { priceByProductId, purchasedProductIds, restorePurchases } = useCoursePurchases();

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <View style={styles.heroSection}>
            <Text style={styles.heroEyebrow}>MINDVIA</Text>
            <Text style={styles.heroTitle}>Образовательные курсы</Text>
            <Text style={styles.heroText}>
              Программы открываются через покупку в приложении. После оплаты материалы доступны сразу.
            </Text>
          </View>

          <View style={styles.list}>
            {courses.map((course) => {
              const purchased = purchasedProductIds.includes(course.productId);
              const price = priceByProductId[course.productId] ?? `$${course.applePriceUsd}`;
              return (
                <Pressable
                  key={course.productId}
                  style={styles.card}
                  onPress={() => router.push(`/courses/${course.slug}` as Href)}
                >
                  <View style={styles.cardTop}>
                    <View style={[styles.accentDot, { backgroundColor: course.accent }]} />
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {course.title}
                    </Text>
                  </View>
                  <Text style={styles.cardSubtitle} numberOfLines={2}>
                    {course.subtitle}
                  </Text>
                  <View style={[styles.buyButton, purchased ? styles.purchasedButton : null]}>
                    <Text style={[styles.buyButtonText, purchased ? styles.purchasedButtonText : null]}>
                      {purchased ? "Открыть курс" : `Купить · ${price}`}
                    </Text>
                  </View>
                </Pressable>
              );
            })}

            <Pressable onPress={() => void restorePurchases()} hitSlop={12}>
              <Text style={styles.restoreLink}>Восстановить покупки</Text>
            </Pressable>
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
    minHeight: height * 0.28,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  heroEyebrow: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 1.5,
    marginBottom: 10,
    fontFamily: serifFont,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 42,
    marginBottom: 12,
    fontFamily: serifFont,
  },
  heroText: {
    fontSize: 17,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.95)",
    lineHeight: 26,
    fontFamily: serifFont,
  },
  list: { paddingHorizontal: 24, paddingTop: 8, gap: 20 },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 10 },
  accentDot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 24,
    fontFamily: serifFont,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.65)",
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: serifFont,
  },
  buyButton: {
    backgroundColor: "#4A9D7A",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  buyButtonText: { fontSize: 15, fontWeight: "700", color: "#FFFFFF", fontFamily: serifFont },
  purchasedButton: {
    backgroundColor: "rgba(74, 157, 122, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(74, 157, 122, 0.5)",
  },
  purchasedButtonText: { color: "#7ED9B2" },
  restoreLink: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
    textDecorationLine: "underline",
    fontFamily: serifFont,
    paddingVertical: 8,
  },
});

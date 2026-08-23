import { View, Text, StyleSheet, ScrollView, StatusBar, Platform, Pressable, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import { getCourseBySlug } from "../../constants/courses";
import { useCoursePurchases } from "../../hooks/useCoursePurchases";

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

export default function CourseDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const course = getCourseBySlug(slug);
  const { priceByProductId, purchasedProductIds, isPurchasing, buyCourse } = useCoursePurchases();

  if (!course) {
    return (
      <BackgroundWrapper>
        <View style={styles.centered}>
          <Text style={styles.missing}>Курс не найден</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  const purchased = purchasedProductIds.includes(course.productId);
  const price = priceByProductId[course.productId] ?? `$${course.applePriceUsd}`;

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable style={styles.back} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="rgba(255,255,255,0.8)" />
          </Pressable>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.subtitle}>{course.subtitle}</Text>
          <Text style={styles.description}>{course.description}</Text>

          <View style={styles.metaGrid}>
            {course.meta.map((item) => (
              <View key={item.label} style={styles.metaItem}>
                <Text style={styles.metaLabel}>{item.label}</Text>
                <Text style={styles.metaValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>{purchased ? "Материалы курса" : "Программа курса"}</Text>
          {course.modules.map((module) => (
            <View key={module.title} style={styles.moduleCard}>
              <MaterialCommunityIcons
                name={purchased ? "lock-open-outline" : "lock-outline"}
                size={20}
                color={purchased ? "#7ED9B2" : "rgba(255,255,255,0.45)"}
              />
              <View style={styles.moduleText}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleSummary}>
                  {purchased ? module.summary : "Откроется после покупки в приложении"}
                </Text>
              </View>
            </View>
          ))}

          {purchased ? (
            <View style={[styles.buyButton, styles.owned]}>
              <Text style={styles.ownedText}>Курс куплен · доступ открыт</Text>
            </View>
          ) : (
            <Pressable
              style={styles.buyButton}
              disabled={isPurchasing}
              onPress={() => void buyCourse(course.productId)}
            >
              {isPurchasing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buyText}>Купить · {price}</Text>
              )}
            </Pressable>
          )}
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  missing: { color: "#FFFFFF", fontSize: 18, fontFamily: serifFont },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 48 },
  back: { width: 44, height: 44, justifyContent: "center", marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "700", color: "#FFFFFF", lineHeight: 36, fontFamily: serifFont },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginTop: 10,
    lineHeight: 24,
    fontFamily: serifFont,
  },
  description: {
    fontSize: 16,
    color: "rgba(255,255,255,0.88)",
    marginTop: 16,
    lineHeight: 24,
    fontFamily: serifFont,
  },
  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 20 },
  metaItem: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 12,
  },
  metaLabel: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 6, fontFamily: serifFont },
  metaValue: { fontSize: 14, fontWeight: "700", color: "#FFFFFF", fontFamily: serifFont },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 28,
    marginBottom: 14,
    fontFamily: serifFont,
  },
  moduleCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  moduleText: { flex: 1 },
  moduleTitle: { fontSize: 15, fontWeight: "700", color: "#FFFFFF", fontFamily: serifFont },
  moduleSummary: { fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 4, fontFamily: serifFont },
  buyButton: {
    marginTop: 24,
    backgroundColor: "#4A9D7A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  buyText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", fontFamily: serifFont },
  owned: {
    backgroundColor: "rgba(74,157,122,0.25)",
    borderWidth: 1,
    borderColor: "rgba(74,157,122,0.5)",
  },
  ownedText: { color: "#7ED9B2", fontSize: 15, fontWeight: "700", fontFamily: serifFont },
});

import { View, Text, Pressable, ScrollView, StyleSheet, StatusBar, Platform, Dimensions } from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../../components/BackgroundWrapper";

const { height } = Dimensions.get("window");

const articles = [
  { 
    id: "1", 
    title: "Понимание тревожности", 
    excerpt: "Как распознать и справиться с тревожными состояниями",
    category: "Тревога",
    readTime: "5 мин"
  },
  { 
    id: "2", 
    title: "Эмоциональная устойчивость", 
    excerpt: "Развитие навыков эмоциональной регуляции",
    category: "Развитие",
    readTime: "7 мин"
  },
  { 
    id: "3", 
    title: "Здоровые отношения", 
    excerpt: "Ключевые принципы построения крепких отношений",
    category: "Отношения",
    readTime: "6 мин"
  },
  { 
    id: "4", 
    title: "Работа со стрессом", 
    excerpt: "Практические техники управления стрессом",
    category: "Стресс",
    readTime: "8 мин"
  },
  { 
    id: "5", 
    title: "Самопознание", 
    excerpt: "Путь к пониманию себя и своих потребностей",
    category: "Личность",
    readTime: "10 мин"
  },
  { 
    id: "6", 
    title: "Преодоление кризисов", 
    excerpt: "Как найти силы в сложные периоды жизни",
    category: "Кризис",
    readTime: "9 мин"
  }
];

export default function Articles() {
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Статьи</Text>
            <Text style={styles.heroSubtitle}>
              Полезные материалы и рекомендации по психологическому здоровью и личностному развитию
            </Text>
          </View>
        </View>
        
        <View style={styles.articlesGrid}>
          {articles.map((item) => (
            <Link key={item.id} href={`/articles/${item.id}`} asChild>
              <Pressable style={styles.articleCard}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.articleTitle}>{item.title}</Text>
                <Text style={styles.articleExcerpt}>{item.excerpt}</Text>
                <View style={styles.articleFooter}>
                  <View style={styles.readTimeContainer}>
                    <MaterialCommunityIcons name="clock-outline" size={18} color="#9CA3AF" />
                    <Text style={styles.readTimeText}>{item.readTime}</Text>
                  </View>
                  <MaterialCommunityIcons name="arrow-right" size={22} color="#4A90A4" />
                </View>
              </Pressable>
            </Link>
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
    letterSpacing: 0.5,
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
  articlesGrid: {
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 18,
  },
  articleCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  categoryBadge: {
    backgroundColor: "rgba(74, 144, 164, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4A90A4",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  articleTitle: {
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
  articleExcerpt: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 24,
    marginBottom: 18,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  articleFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  readTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  readTimeText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

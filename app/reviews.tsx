import { View, Text, StyleSheet, ScrollView, StatusBar, Platform, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../components/BackgroundWrapper";

const { height } = Dimensions.get("window");

type Review = {
  name: string;
  age: string;
  role: string;
  text: string;
};

const reviews: Review[] = [
  {
    name: "Лариса",
    age: "35 лет",
    role: "Клиент",
    text: "Я увидела, откуда пришла моя боль. Но самое важное — я почувствовала, как могу исцелиться. Не умом, а сердцем. Это был священный опыт, который изменил мою жизнь.",
  },
  {
    name: "Артём",
    age: "38 лет",
    role: "Клиент",
    text: "После регрессии пришло чувство, что я не один. Что за мной стоит род, дух, сила. Появилась внутренняя опора, которую я искал годами.",
  },
  {
    name: "Валентина",
    age: "42 года",
    role: "Клиент",
    text: "Это было как встреча с собой — настоящей. Со своей душой. Спокойствие, лёгкость, прощение. Я вышла с ощущением света внутри.",
  },
  {
    name: "Елена М.",
    age: "",
    role: "Клиент",
    text: "Теона помогла мне справиться с тревожностью, которая мучила меня годами. С ее поддержкой я научилась управлять своими эмоциями и не позволять страхам контролировать мою жизнь. Спасибо за профессионализм и душевное тепло!",
  },
  {
    name: "Александр К.",
    age: "",
    role: "Клиент",
    text: "Благодаря консультациям с Теоной, мы с женой смогли преодолеть кризис в отношениях и построить более глубокую эмоциональную связь. Теона показала нам, как важно слышать друг друга и выражать свои потребности без обвинений.",
  },
  {
    name: "Мария Н.",
    age: "",
    role: "Клиент",
    text: "После тяжелой утраты я думала, что никогда не смогу снова радоваться жизни. Теона помогла мне пройти через горе и найти внутренние ресурсы, чтобы продолжать жить полноценно. Ее поддержка была неоценима в этот трудный период.",
  },
];

export default function Reviews() {
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>Отзывы</Text>
            <Text style={styles.heroTitle}>Что говорят мои клиенты о нашей совместной работе</Text>
            <Text style={styles.heroText}>Видео-отзыв доступен на сайте</Text>
          </View>
        </View>

        <View style={styles.list}>
          {reviews.map((r, idx) => (
            <View key={`${r.name}-${idx}`} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.starRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <MaterialCommunityIcons key={i} name="star" size={18} color="#C08450" />
                  ))}
                </View>
                <Text style={styles.text}>{r.text}</Text>
              </View>
              <View style={styles.authorRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{r.name.slice(0, 1)}</Text>
                </View>
                <View style={styles.authorMeta}>
                  <Text style={styles.authorName}>
                    {r.name}
                    {r.age ? `, ${r.age}` : ""}
                  </Text>
                  <Text style={styles.authorRole}>{r.role}</Text>
                </View>
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
    minHeight: height * 0.28,
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
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 40,
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
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 24,
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
  list: { paddingHorizontal: 24, paddingTop: 32, gap: 18 },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cardTop: { gap: 14, marginBottom: 20 },
  starRow: { flexDirection: "row", gap: 4 },
  text: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 26,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  authorRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF4E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#C08450",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  authorMeta: { flex: 1 },
  authorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  authorRole: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

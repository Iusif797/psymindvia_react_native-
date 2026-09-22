import { useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { markGuideSeen } from "../services/guide";

type Section = {
  icon: string;
  color: string;
  title: string;
  body: string;
  route?: string;
};

const SECTIONS: Section[] = [
  {
    icon: "emoticon-outline",
    color: "#7EC8E3",
    title: "Я сегодня",
    body:
      "Отметьте эмоции, уровень тревоги и телесные ощущения. Это занимает минуту и создаёт историю, по которой видно динамику.",
    route: "/tracker",
  },
  {
    icon: "heart-pulse",
    color: "#E8A87C",
    title: "Антитревога",
    body:
      "Четыре коротких упражнения на случай, когда накрывает: дыхание, заземление, разбор мысли и работа с телом. Можно начать прямо сейчас, ничего не настраивая.",
    route: "/antianxiety",
  },
  {
    icon: "calendar-check-outline",
    color: "#7DCEA0",
    title: "Практика 7 дней",
    body:
      "Программа на неделю: каждый день одна тема и несколько вопросов. Ответы сохраняются, к ним можно вернуться.",
    route: "/program",
  },
  {
    icon: "meditation",
    color: "#B39DDB",
    title: "Медитации",
    body: "Подборка практик для расслабления и восстановления.",
    route: "/meditations",
  },
  {
    icon: "chart-line",
    color: "#8FC7D8",
    title: "Аналитика",
    body:
      "Сводка по вашим записям: сколько упражнений сделано, как менялся уровень тревоги, какие эмоции повторяются.",
    route: "/analytics",
  },
  {
    icon: "school-outline",
    color: "#C08450",
    title: "Обучение и услуги",
    body:
      "Информация о курсах и консультациях. Здесь можно оставить заявку — это именно заявка, а не оплата.",
    route: "/courses",
  },
];

export default function GuideScreen() {
  // Mark it seen as soon as it is shown, not only when "Начать" is pressed.
  // Otherwise a user who leaves via the drawer instead of the button would be
  // shown the guide again on every launch.
  useEffect(() => {
    void markGuideSeen();
  }, []);

  const finish = useCallback(() => {
    router.replace("/");
  }, []);

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Как пользоваться</Text>
            </View>
            <Text style={styles.title}>С чего начать</Text>
            <Text style={styles.subtitle}>
              Приложение — это набор самостоятельных практик для работы с
              тревогой и настроением. Ничего настраивать не нужно: откройте
              любой раздел и начните.
            </Text>
          </View>

          <View style={styles.factsCard}>
            <Fact
              icon="cash-remove"
              text="Приложение и все его материалы бесплатны. В приложении ничего не продаётся и не списывается."
            />
            <Fact
              icon="cellphone-lock"
              text="Ваши записи хранятся только на этом устройстве. Мы их не видим и никуда не отправляем."
            />
            <Fact
              icon="account-outline"
              text="Профиль нужен только для того, чтобы держать записи вместе. Регистрация не обязательна — все практики работают и без неё."
            />
            <Fact
              icon="lifebuoy"
              text="Кнопка помощи доступна на каждом экране, если станет тяжело."
            />
          </View>

          <Text style={styles.sectionHeading}>Разделы</Text>

          {SECTIONS.map((s) => (
            <Pressable
              key={s.title}
              style={styles.card}
              onPress={() => s.route && router.push(s.route as never)}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: `${s.color}33` },
                ]}
              >
                <MaterialCommunityIcons
                  name={s.icon as never}
                  size={26}
                  color={s.color}
                />
              </View>
              <View style={styles.flex}>
                <Text style={styles.cardTitle}>{s.title}</Text>
                <Text style={styles.cardBody}>{s.body}</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="rgba(255,255,255,0.45)"
              />
            </Pressable>
          ))}

          <View style={styles.disclaimerCard}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={20}
              color="#E8A87C"
            />
            <Text style={styles.disclaimerText}>
              Приложение не заменяет диагностику и лечение. Если вам плохо и
              состояние не улучшается, обратитесь к специалисту, а в неотложной
              ситуации — в экстренные службы.
            </Text>
          </View>

          <Pressable style={styles.primary} onPress={finish}>
            <Text style={styles.primaryText}>Начать</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={18}
              color="#FFFFFF"
            />
          </Pressable>

          <Text style={styles.footnote}>
            Этот экран всегда доступен в меню — «Как пользоваться».
          </Text>
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
}

function Fact({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.factRow}>
      <MaterialCommunityIcons
        name={icon as never}
        size={20}
        color="#8FC7D8"
      />
      <Text style={styles.factText}>{text}</Text>
    </View>
  );
}

const serif = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  flex: { flex: 1 },
  content: { paddingBottom: 48, paddingHorizontal: 24 },
  hero: { paddingTop: 24, paddingBottom: 20 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(74, 144, 164, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: "#8FC7D8",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: serif,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: serif,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 24,
    fontFamily: serif,
  },
  factsCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 18,
    gap: 14,
    marginBottom: 28,
  },
  factRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  factText: {
    flex: 1,
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    lineHeight: 21,
    fontFamily: serif,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 14,
    fontFamily: serif,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "rgba(255,255,255,0.09)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    padding: 16,
    marginBottom: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: serif,
  },
  cardBody: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    lineHeight: 20,
    fontFamily: serif,
  },
  disclaimerCard: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    backgroundColor: "rgba(232, 168, 124, 0.14)",
    borderColor: "rgba(232, 168, 124, 0.4)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  disclaimerText: {
    flex: 1,
    color: "rgba(255,255,255,0.88)",
    fontSize: 13,
    lineHeight: 20,
    fontFamily: serif,
  },
  primary: {
    marginTop: 24,
    backgroundColor: "#4A90A4",
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: serif,
  },
  footnote: {
    marginTop: 14,
    textAlign: "center",
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontFamily: serif,
  },
});

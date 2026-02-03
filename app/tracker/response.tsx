import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundWrapper from "../../components/BackgroundWrapper";

type EntryData = {
  emotions: string[];
  anxietyLevel: number;
  bodySensations: string[];
  thought: string;
};

type ResponseType = "cbt" | "body" | "systemic";

type ResponseContent = {
  type: ResponseType;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  questions: string[];
  practice?: {
    title: string;
    steps: string[];
  };
};

const CBT_QUESTIONS = [
  "Какие доказательства подтверждают эту мысль?",
  "Какие доказательства опровергают её?",
  "Как бы ты отнёсся к этой ситуации через год?",
  "Что бы ты сказал другу в такой же ситуации?",
  "Есть ли другой способ посмотреть на это?",
];

const SYSTEMIC_QUESTIONS = [
  "Это чувство может быть не только твоим?",
  "Кого из твоей семьи ты напоминаешь себе в этом состоянии?",
  "Какое послание несёт это чувство?",
  "Это про сейчас или про что-то давнее?",
  "Чьи ожидания ты пытаешься оправдать?",
];

const BODY_PRACTICE = {
  title: "Короткая телесная практика",
  steps: [
    "Почувствуй опору под ногами. Ощути пол или землю.",
    "Сделай три глубоких вдоха. Выдох длиннее вдоха.",
    "Положи руку на грудь. Почувствуй тепло своей ладони.",
    "Назови пять вещей, которые видишь прямо сейчас.",
    "Мягко верни внимание в настоящий момент.",
  ],
};

const getResponseContent = (entry: EntryData): ResponseContent => {
  const hasHighAnxiety = entry.anxietyLevel >= 7;
  const hasBodySensations = entry.bodySensations.length > 0;
  const hasThought = entry.thought.trim().length > 0;

  const hasSadnessOrFear =
    entry.emotions.includes("sadness") ||
    entry.emotions.includes("fear") ||
    entry.emotions.includes("emptiness");

  if (hasHighAnxiety || entry.emotions.includes("anxiety")) {
    return {
      type: "body",
      title: "Давай сначала успокоим тело",
      icon: "meditation",
      color: "#4A9D7A",
      questions: [
        "Где именно в теле ты чувствуешь тревогу?",
        "Эта тревога о чём-то конкретном или размытая?",
      ],
      practice: BODY_PRACTICE,
    };
  }

  if (hasThought && (hasSadnessOrFear || entry.emotions.includes("anger"))) {
    return {
      type: "cbt",
      title: "Посмотрим на мысли вместе",
      icon: "head-lightbulb-outline",
      color: "#4A90A4",
      questions: CBT_QUESTIONS.slice(0, 3),
    };
  }

  return {
    type: "systemic",
    title: "Глубже в чувство",
    icon: "heart-outline",
    color: "#7B6B8E",
    questions: SYSTEMIC_QUESTIONS.slice(0, 3),
  };
};

const EMOTION_LABELS: Record<string, string> = {
  calm: "Спокойствие",
  joy: "Радость",
  sadness: "Грусть",
  anxiety: "Тревога",
  anger: "Злость",
  fear: "Страх",
  emptiness: "Пустота",
  hope: "Надежда",
};

export default function TrackerResponseScreen() {
  const [entry, setEntry] = useState<EntryData | null>(null);
  const [response, setResponse] = useState<ResponseContent | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showPractice, setShowPractice] = useState(false);

  useEffect(() => {
    const loadEntry = async () => {
      const data = await AsyncStorage.getItem("last_entry");
      if (data) {
        const parsed = JSON.parse(data) as EntryData;
        setEntry(parsed);
        setResponse(getResponseContent(parsed));
      }
    };
    loadEntry();
  }, []);

  const handleNextQuestion = () => {
    if (response && currentQuestionIndex < response.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (response?.practice) {
      setShowPractice(true);
    }
  };

  const handleFinish = () => {
    router.replace("/tracker");
  };

  const handleGoHome = () => {
    router.replace("/");
  };

  if (!entry || !response) {
    return (
      <BackgroundWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <View style={[styles.iconWrapper, { backgroundColor: `${response.color}20` }]}>
              <MaterialCommunityIcons
                name={response.icon}
                size={40}
                color={response.color}
              />
            </View>
            <Text style={styles.thankYou}>Спасибо, что поделился</Text>
            <Text style={styles.subtitle}>
              Ты отметил: {entry.emotions.map((e) => EMOTION_LABELS[e]).join(", ")}
            </Text>
          </View>

          <View style={styles.responseCard}>
            <Text style={styles.responseTitle}>{response.title}</Text>

            {!showPractice ? (
              <View style={styles.questionSection}>
                <Text style={styles.questionLabel}>
                  Вопрос {currentQuestionIndex + 1} из {response.questions.length}
                </Text>
                <Text style={styles.questionText}>
                  {response.questions[currentQuestionIndex]}
                </Text>
                <Text style={styles.questionHint}>
                  Не нужно отвечать вслух. Просто побудь с этим вопросом.
                </Text>

                <Pressable
                  style={[styles.nextButton, { backgroundColor: response.color }]}
                  onPress={handleNextQuestion}
                >
                  <Text style={styles.nextButtonText}>
                    {currentQuestionIndex < response.questions.length - 1
                      ? "Следующий вопрос"
                      : response.practice
                      ? "К практике"
                      : "Завершить"}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.practiceSection}>
                <Text style={styles.practiceTitle}>{response.practice?.title}</Text>
                {response.practice?.steps.map((step, index) => (
                  <View key={index} style={styles.practiceStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.closingSection}>
            <Text style={styles.closingText}>
              Помни: замечать своё состояние — уже шаг к себе.
            </Text>
            <Text style={styles.closingDisclaimer}>
              Это не заменяет работу с психологом, но помогает быть ближе к себе.
            </Text>
          </View>

          <View style={styles.buttonsRow}>
            <Pressable style={styles.finishButton} onPress={handleFinish}>
              <MaterialCommunityIcons
                name="refresh"
                size={20}
                color="rgba(255, 255, 255, 0.7)"
              />
              <Text style={styles.finishButtonText}>Новая запись</Text>
            </Pressable>

            <Pressable style={styles.homeButton} onPress={handleGoHome}>
              <MaterialCommunityIcons
                name="home-outline"
                size={20}
                color="rgba(255, 255, 255, 0.7)"
              />
              <Text style={styles.homeButtonText}>На главную</Text>
            </Pressable>
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  thankYou: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    lineHeight: 22,
  },
  responseCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginBottom: 24,
  },
  responseTitle: {
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
  questionSection: {
    gap: 16,
  },
  questionLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  questionText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#FFFFFF",
    lineHeight: 30,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  questionHint: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    fontStyle: "italic",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    lineHeight: 22,
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.3,
  },
  practiceSection: {
    gap: 16,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  practiceStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(74, 157, 122, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A9D7A",
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  closingSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  closingText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    lineHeight: 24,
  },
  closingDisclaimer: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.4)",
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    lineHeight: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  finishButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  finishButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  homeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

import { useState } from "react";
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
import BackgroundWrapper from "../../components/BackgroundWrapper";

const REFLECTION_QUESTIONS = [
  {
    id: "now_or_past",
    question: "Это реакция на ситуацию или на старый сценарий?",
    hint: "Иногда мы реагируем не на то, что происходит сейчас, а на то, что напоминает нам прошлое.",
  },
  {
    id: "whose",
    question: "Это про сейчас или про раньше?",
    hint: "Тревога часто связана с событиями, которые уже произошли или ещё не случились.",
  },
  {
    id: "pattern",
    question: "Знакомо ли тебе это состояние?",
    hint: "Если да — возможно, это паттерн, который стоит исследовать глубже.",
  },
];

export default function ReflectionScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleNext = () => {
    if (currentIndex < REFLECTION_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleSkip = () => {
    setIsComplete(true);
  };

  const handleBack = () => {
    router.back();
  };

  const handleFinish = () => {
    router.replace("/antianxiety");
  };

  const handleGoHome = () => {
    router.replace("/");
  };

  const handleContact = () => {
    router.push("/contact");
  };

  const currentQuestion = REFLECTION_QUESTIONS[currentIndex];

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="rgba(255, 255, 255, 0.7)"
            />
          </Pressable>
          <Text style={styles.headerTitle}>Осмысление</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {!isComplete ? (
            <View style={styles.questionSection}>
              <View style={styles.progressIndicator}>
                {REFLECTION_QUESTIONS.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.progressDot,
                      index === currentIndex && styles.progressDotActive,
                      index < currentIndex && styles.progressDotComplete,
                    ]}
                  />
                ))}
              </View>

              <View style={styles.questionIconWrapper}>
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  size={40}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </View>

              <Text style={styles.questionText}>{currentQuestion.question}</Text>
              <Text style={styles.questionHint}>{currentQuestion.hint}</Text>

              <Text style={styles.noAnswerNeeded}>
                Не нужно отвечать вслух. Просто побудь с этим вопросом.
              </Text>
            </View>
          ) : (
            <View style={styles.completeSection}>
              <View style={styles.completeIconWrapper}>
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={56}
                  color="#4A9D7A"
                />
              </View>

              <Text style={styles.completeTitle}>Ты молодец</Text>
              <Text style={styles.completeText}>
                Ты уделил время себе. Это важно и ценно.
              </Text>

              <View style={styles.reminderCard}>
                <Text style={styles.reminderTitle}>Помни</Text>
                <Text style={styles.reminderText}>
                  Эти практики — поддержка в моменте. Они не заменяют работу с
                  психологом, но помогают быть ближе к себе.
                </Text>
                <Text style={styles.reminderText}>
                  Если тревога возвращается часто — это сигнал, что стоит
                  обратиться за помощью.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {!isComplete ? (
            <View style={styles.questionButtons}>
              <Pressable style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>Пропустить</Text>
              </Pressable>
              <Pressable style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {currentIndex < REFLECTION_QUESTIONS.length - 1
                    ? "Следующий"
                    : "Завершить"}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.completeButtons}>
              <Pressable style={styles.homeButton} onPress={handleGoHome}>
                <MaterialCommunityIcons
                  name="home-outline"
                  size={20}
                  color="rgba(255, 255, 255, 0.7)"
                />
                <Text style={styles.homeButtonText}>На главную</Text>
              </Pressable>

              <Pressable style={styles.practicesButton} onPress={handleFinish}>
                <Text style={styles.practicesButtonText}>К практикам</Text>
              </Pressable>
            </View>
          )}

          {isComplete && (
            <Pressable style={styles.contactButton} onPress={handleContact}>
              <Text style={styles.contactButtonText}>Записаться к психологу</Text>
            </Pressable>
          )}
        </View>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    flexGrow: 1,
    justifyContent: "center",
  },
  questionSection: {
    alignItems: "center",
  },
  progressIndicator: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 40,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  progressDotActive: {
    backgroundColor: "#FFFFFF",
    transform: [{ scale: 1.2 }],
  },
  progressDotComplete: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  questionIconWrapper: {
    marginBottom: 32,
  },
  questionText: {
    fontSize: 26,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 38,
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  questionHint: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 32,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  noAnswerNeeded: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.4)",
    textAlign: "center",
    fontStyle: "italic",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  completeSection: {
    alignItems: "center",
  },
  completeIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(74, 157, 122, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  completeText: {
    fontSize: 17,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 32,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  reminderCard: {
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  reminderText: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 24,
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    gap: 12,
  },
  questionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  skipButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#4A9D7A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
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
  },
  completeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  homeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  practicesButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  practicesButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  contactButton: {
    backgroundColor: "rgba(74, 157, 122, 0.2)",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(74, 157, 122, 0.3)",
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A9D7A",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

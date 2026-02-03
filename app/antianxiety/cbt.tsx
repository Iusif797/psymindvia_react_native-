import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import { database } from "../../services/database";

type Step = {
  id: string;
  title: string;
  prompt: string;
  placeholder: string;
};

const STEPS: Step[] = [
  {
    id: "thought",
    title: "Мысль",
    prompt: "Какая мысль тебя тревожит прямо сейчас?",
    placeholder: "Например: «Я не справлюсь», «Это катастрофа»...",
  },
  {
    id: "emotion",
    title: "Эмоция",
    prompt: "Что ты чувствуешь, когда думаешь об этом?",
    placeholder: "Тревога, страх, грусть, злость...",
  },
  {
    id: "evidence_for",
    title: "Доказательства «за»",
    prompt: "Какие факты подтверждают эту мысль?",
    placeholder: "Только факты, не интерпретации...",
  },
  {
    id: "evidence_against",
    title: "Доказательства «против»",
    prompt: "Какие факты опровергают эту мысль?",
    placeholder: "Что говорит о том, что это не совсем так?",
  },
  {
    id: "alternative",
    title: "Альтернатива",
    prompt: "Как можно посмотреть на это иначе?",
    placeholder: "Более сбалансированный взгляд...",
  },
];

export default function CBTScreen() {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const handleStart = () => {
    setCurrentStepIndex(0);
    setAnswers({});
    setCurrentAnswer("");
    setIsComplete(false);
  };

  const handleNext = () => {
    const updatedAnswers = { ...answers };
    if (currentAnswer.trim()) {
      updatedAnswers[STEPS[currentStepIndex].id] = currentAnswer.trim();
    }
    setAnswers(updatedAnswers);

    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setCurrentAnswer("");
    } else {
      setIsComplete(true);
      database
        .saveAntianxietySession({
          exerciseType: "cbt",
          completedAt: new Date().toISOString(),
          cbtAnswers: updatedAnswers,
        })
        .catch(() => {});
    }
  };

  const handleSkip = () => {
    const updatedAnswers = { ...answers };
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setCurrentAnswer("");
    } else {
      setIsComplete(true);
      database
        .saveAntianxietySession({
          exerciseType: "cbt",
          completedAt: new Date().toISOString(),
          cbtAnswers: updatedAnswers,
        })
        .catch(() => {});
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleFinish = () => {
    router.push("/antianxiety/reflection" as any);
  };

  const currentStep = currentStepIndex >= 0 ? STEPS[currentStepIndex] : null;

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
          <Text style={styles.headerTitle}>Разбор мысли</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {currentStepIndex === -1 && !isComplete && (
            <View style={styles.introSection}>
              <View style={styles.introIconWrapper}>
                <MaterialCommunityIcons
                  name="head-lightbulb-outline"
                  size={48}
                  color="#7B6B8E"
                />
              </View>
              <Text style={styles.introTitle}>Когнитивный разбор</Text>
              <Text style={styles.introText}>
                Когда тревожные мысли захватывают, полезно остановиться и рассмотреть
                их внимательнее.
              </Text>
              <Text style={styles.introSubtext}>
                Это не про то, чтобы «думать позитивно». Это про то, чтобы видеть
                картину целиком.
              </Text>

              <View style={styles.disclaimer}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={20}
                  color="rgba(255, 255, 255, 0.5)"
                />
                <Text style={styles.disclaimerText}>
                  Записывать не обязательно. Можно просто подумать над вопросами.
                </Text>
              </View>
            </View>
          )}

          {currentStep && !isComplete && (
            <View style={styles.stepSection}>
              <View style={styles.progressBar}>
                {STEPS.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.progressDot,
                      index <= currentStepIndex && styles.progressDotActive,
                    ]}
                  />
                ))}
              </View>

              <Text style={styles.stepNumber}>
                {currentStepIndex + 1} из {STEPS.length}
              </Text>
              <Text style={styles.stepTitle}>{currentStep.title}</Text>
              <Text style={styles.stepPrompt}>{currentStep.prompt}</Text>

              <TextInput
                style={styles.input}
                placeholder={currentStep.placeholder}
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={currentAnswer}
                onChangeText={setCurrentAnswer}
              />

              <Text style={styles.stepHint}>
                Пиши как есть. Здесь нет правильных ответов.
              </Text>
            </View>
          )}

          {isComplete && (
            <View style={styles.completeSection}>
              <View style={styles.completeIconWrapper}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={64}
                  color="#7B6B8E"
                />
              </View>
              <Text style={styles.completeTitle}>Ты разобрал мысль</Text>
              <Text style={styles.completeText}>
                Посмотри, что получилось. Иногда когда мы записываем мысли, они
                теряют часть своей силы.
              </Text>

              {Object.keys(answers).length > 0 && (
                <View style={styles.summaryCard}>
                  {STEPS.map((step) =>
                    answers[step.id] ? (
                      <View key={step.id} style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{step.title}</Text>
                        <Text style={styles.summaryText}>{answers[step.id]}</Text>
                      </View>
                    ) : null
                  )}
                </View>
              )}

              <Text style={styles.reflectionPrompt}>
                Как ты себя чувствуешь, посмотрев на это со стороны?
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {currentStepIndex === -1 && !isComplete && (
            <Pressable style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Начать разбор</Text>
            </Pressable>
          )}

          {currentStep && !isComplete && (
            <View style={styles.stepButtons}>
              <Pressable style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>Пропустить</Text>
              </Pressable>
              <Pressable style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {currentStepIndex < STEPS.length - 1 ? "Дальше" : "Завершить"}
                </Text>
              </Pressable>
            </View>
          )}

          {isComplete && (
            <View style={styles.completeButtons}>
              <Pressable style={styles.repeatButton} onPress={handleStart}>
                <MaterialCommunityIcons
                  name="refresh"
                  size={20}
                  color="rgba(255, 255, 255, 0.7)"
                />
                <Text style={styles.repeatButtonText}>Новый разбор</Text>
              </Pressable>
              <Pressable style={styles.finishButton} onPress={handleFinish}>
                <Text style={styles.finishButtonText}>Осмыслить</Text>
              </Pressable>
            </View>
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
    paddingTop: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  introSection: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  introIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(123, 107, 142, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  introText: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  introSubtext: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
    fontStyle: "italic",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  stepSection: {
    flex: 1,
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  progressDotActive: {
    backgroundColor: "#7B6B8E",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  stepPrompt: {
    fontSize: 18,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 28,
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 18,
    minHeight: 140,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    lineHeight: 26,
    marginBottom: 16,
  },
  stepHint: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.4)",
    fontStyle: "italic",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  completeSection: {
    alignItems: "center",
    flex: 1,
  },
  completeIconWrapper: {
    marginBottom: 24,
  },
  completeTitle: {
    fontSize: 28,
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
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  summaryCard: {
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 18,
    gap: 16,
    marginBottom: 24,
  },
  summaryItem: {
    gap: 4,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  summaryText: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  reflectionPrompt: {
    fontSize: 17,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontStyle: "italic",
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
  },
  startButton: {
    backgroundColor: "#7B6B8E",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  stepButtons: {
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
    backgroundColor: "#7B6B8E",
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
  repeatButton: {
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
  repeatButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  finishButton: {
    flex: 1,
    backgroundColor: "#7B6B8E",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

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
import { database } from "../../services/database";

type Step = {
  sense: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  count: number;
  prompt: string;
  color: string;
};

const STEPS: Step[] = [
  {
    sense: "Зрение",
    icon: "eye-outline",
    count: 5,
    prompt: "Назови 5 вещей, которые ты видишь прямо сейчас",
    color: "#4A90A4",
  },
  {
    sense: "Осязание",
    icon: "hand-back-left-outline",
    count: 4,
    prompt: "Назови 4 вещи, которые ты можешь потрогать",
    color: "#4A9D7A",
  },
  {
    sense: "Слух",
    icon: "ear-hearing",
    count: 3,
    prompt: "Назови 3 звука, которые ты слышишь",
    color: "#7B6B8E",
  },
  {
    sense: "Обоняние",
    icon: "flower-outline",
    count: 2,
    prompt: "Назови 2 запаха, которые ты ощущаешь",
    color: "#C08450",
  },
  {
    sense: "Вкус",
    icon: "food-apple-outline",
    count: 1,
    prompt: "Назови 1 вкус, который ты чувствуешь",
    color: "#C75450",
  },
];

export default function GroundingScreen() {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);

  const handleStart = () => {
    setCurrentStepIndex(0);
    setIsComplete(false);
  };

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
      database
        .saveAntianxietySession({
          exerciseType: "grounding",
          completedAt: new Date().toISOString(),
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
          <Text style={styles.headerTitle}>Заземление 5-4-3-2-1</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {currentStepIndex === -1 && !isComplete && (
            <View style={styles.introSection}>
              <View style={styles.introIconWrapper}>
                <MaterialCommunityIcons
                  name="leaf"
                  size={48}
                  color="#4A9D7A"
                />
              </View>
              <Text style={styles.introTitle}>Техника заземления</Text>
              <Text style={styles.introText}>
                Эта практика помогает вернуться в настоящий момент, когда тревога
                уносит в мысли о будущем или прошлом.
              </Text>
              <Text style={styles.introSubtext}>
                Мы пройдём через пять чувств, постепенно возвращая внимание в тело
                и пространство вокруг.
              </Text>

              <View style={styles.stepsPreview}>
                {STEPS.map((step, index) => (
                  <View key={index} style={styles.stepPreviewItem}>
                    <View
                      style={[
                        styles.stepPreviewIcon,
                        { backgroundColor: `${step.color}20` },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={step.icon}
                        size={20}
                        color={step.color}
                      />
                    </View>
                    <Text style={styles.stepPreviewText}>
                      {step.count} — {step.sense}
                    </Text>
                  </View>
                ))}
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
                      index <= currentStepIndex && {
                        backgroundColor: STEPS[index].color,
                      },
                    ]}
                  />
                ))}
              </View>

              <View
                style={[
                  styles.stepIconWrapper,
                  { backgroundColor: `${currentStep.color}20` },
                ]}
              >
                <MaterialCommunityIcons
                  name={currentStep.icon}
                  size={56}
                  color={currentStep.color}
                />
              </View>

              <Text style={styles.stepCount}>{currentStep.count}</Text>
              <Text style={styles.stepSense}>{currentStep.sense}</Text>
              <Text style={styles.stepPrompt}>{currentStep.prompt}</Text>

              <Text style={styles.stepHint}>
                Не торопись. Действительно посмотри, прислушайся, почувствуй.
              </Text>
            </View>
          )}

          {isComplete && (
            <View style={styles.completeSection}>
              <View style={styles.completeIconWrapper}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={64}
                  color="#4A9D7A"
                />
              </View>
              <Text style={styles.completeTitle}>Ты здесь</Text>
              <Text style={styles.completeText}>
                Ты вернулся в настоящий момент. Почувствуй, как ты стоишь или
                сидишь. Ощути своё тело.
              </Text>
              <Text style={styles.completeQuestion}>
                Как сейчас твоя тревога по сравнению с началом?
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {currentStepIndex === -1 && !isComplete && (
            <Pressable style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Начать практику</Text>
            </Pressable>
          )}

          {currentStep && !isComplete && (
            <Pressable
              style={[styles.nextButton, { backgroundColor: currentStep.color }]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {currentStepIndex < STEPS.length - 1 ? "Готово, дальше" : "Завершить"}
              </Text>
            </Pressable>
          )}

          {isComplete && (
            <View style={styles.completeButtons}>
              <Pressable style={styles.repeatButton} onPress={handleStart}>
                <MaterialCommunityIcons
                  name="refresh"
                  size={20}
                  color="rgba(255, 255, 255, 0.7)"
                />
                <Text style={styles.repeatButtonText}>Ещё раз</Text>
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
    justifyContent: "center",
  },
  introSection: {
    alignItems: "center",
  },
  introIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(74, 157, 122, 0.15)",
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
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  stepsPreview: {
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  stepPreviewItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepPreviewIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  stepPreviewText: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  stepSection: {
    alignItems: "center",
  },
  progressBar: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  stepIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  stepCount: {
    fontSize: 72,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  stepSense: {
    fontSize: 24,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  stepPrompt: {
    fontSize: 18,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  stepHint: {
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
    marginBottom: 24,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
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
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  completeQuestion: {
    fontSize: 17,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.85)",
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
    backgroundColor: "#4A9D7A",
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
  nextButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 18,
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
    backgroundColor: "#4A9D7A",
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

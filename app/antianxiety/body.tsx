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
  title: string;
  instruction: string;
  duration: string;
};

const STEPS: Step[] = [
  {
    title: "Почувствуй опору",
    instruction:
      "Поставь ноги на пол. Почувствуй, как стопы касаются поверхности. Ощути вес своего тела.",
    duration: "30 сек",
  },
  {
    title: "Руки",
    instruction:
      "Сожми кулаки на 5 секунд. Почувствуй напряжение. Теперь отпусти и почувствуй расслабление.",
    duration: "20 сек",
  },
  {
    title: "Плечи",
    instruction:
      "Подними плечи к ушам. Задержи на 5 секунд. Теперь резко опусти и позволь им расслабиться.",
    duration: "20 сек",
  },
  {
    title: "Лицо",
    instruction:
      "Сожми все мышцы лица: зажмурься, сожми губы. Задержи. Теперь расслабь и почувствуй разницу.",
    duration: "20 сек",
  },
  {
    title: "Дыхание в живот",
    instruction:
      "Положи руку на живот. Дыши так, чтобы рука поднималась на вдохе. Три медленных вдоха-выдоха.",
    duration: "30 сек",
  },
  {
    title: "Сканирование",
    instruction:
      "Пройдись вниманием по телу от макушки до стоп. Отметь, где есть напряжение. Просто отметь, не меняй.",
    duration: "40 сек",
  },
];

export default function BodyScreen() {
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
          exerciseType: "body",
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
          <Text style={styles.headerTitle}>Телесная стабилизация</Text>
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
                  name="human-handsup"
                  size={48}
                  color="#C08450"
                />
              </View>
              <Text style={styles.introTitle}>Телесная практика</Text>
              <Text style={styles.introText}>
                Тревога живёт в теле. Когда мы мягко работаем с телом, мы
                помогаем нервной системе успокоиться.
              </Text>
              <Text style={styles.introSubtext}>
                Эта практика использует технику прогрессивной мышечной релаксации
                и осознанности.
              </Text>

              <View style={styles.timeInfo}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="rgba(255, 255, 255, 0.5)"
                />
                <Text style={styles.timeText}>Около 3-4 минут</Text>
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
                      styles.progressSegment,
                      index <= currentStepIndex && styles.progressSegmentActive,
                    ]}
                  />
                ))}
              </View>

              <Text style={styles.stepCounter}>
                {currentStepIndex + 1} / {STEPS.length}
              </Text>

              <View style={styles.stepCard}>
                <Text style={styles.stepTitle}>{currentStep.title}</Text>
                <Text style={styles.stepInstruction}>
                  {currentStep.instruction}
                </Text>
                <View style={styles.durationBadge}>
                  <MaterialCommunityIcons
                    name="timer-outline"
                    size={16}
                    color="rgba(255, 255, 255, 0.5)"
                  />
                  <Text style={styles.durationText}>{currentStep.duration}</Text>
                </View>
              </View>

              <Text style={styles.stepHint}>
                Не торопись. Дай себе время прочувствовать.
              </Text>
            </View>
          )}

          {isComplete && (
            <View style={styles.completeSection}>
              <View style={styles.completeIconWrapper}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={64}
                  color="#C08450"
                />
              </View>
              <Text style={styles.completeTitle}>Тело спокойнее</Text>
              <Text style={styles.completeText}>
                Ты прошёл через практику телесной стабилизации. Почувствуй, как
                изменилось твоё состояние.
              </Text>
              <Text style={styles.completeQuestion}>
                Где в теле сейчас больше расслабления?
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
            <Pressable style={styles.nextButton} onPress={handleNext}>
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
    backgroundColor: "rgba(192, 132, 80, 0.15)",
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
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  timeText: {
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
    alignItems: "center",
  },
  progressBar: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
    alignSelf: "stretch",
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  progressSegmentActive: {
    backgroundColor: "#C08450",
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  stepCard: {
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  stepInstruction: {
    fontSize: 17,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 28,
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  durationText: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
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
    backgroundColor: "#C08450",
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
    backgroundColor: "#C08450",
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
    backgroundColor: "#C08450",
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

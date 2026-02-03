import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import { database } from "../../services/database";

type Phase = "inhale" | "hold" | "exhale" | "rest";

const PHASES: { phase: Phase; duration: number; label: string }[] = [
  { phase: "inhale", duration: 4000, label: "Вдох" },
  { phase: "hold", duration: 7000, label: "Задержка" },
  { phase: "exhale", duration: 8000, label: "Выдох" },
  { phase: "rest", duration: 1000, label: "Пауза" },
];

const TOTAL_CYCLES = 4;

export default function BreathingScreen() {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>("inhale");
  const [cycle, setCycle] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!isActive || isComplete) return;

    const currentPhaseData = PHASES.find((p) => p.phase === currentPhase);
    if (!currentPhaseData) return;

    const duration = currentPhaseData.duration;
    const countdownStart = Math.ceil(duration / 1000);
    setCountdown(countdownStart);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : prev));
    }, 1000);

    let targetScale = 1;
    let targetOpacity = 0.3;

    if (currentPhase === "inhale") {
      targetScale = 1.5;
      targetOpacity = 0.8;
    } else if (currentPhase === "hold") {
      targetScale = 1.5;
      targetOpacity = 0.8;
    } else if (currentPhase === "exhale") {
      targetScale = 1;
      targetOpacity = 0.3;
    }

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: targetScale,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: targetOpacity,
        duration: duration,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      const currentIndex = PHASES.findIndex((p) => p.phase === currentPhase);
      const nextIndex = (currentIndex + 1) % PHASES.length;

      if (nextIndex === 0) {
        if (cycle + 1 >= TOTAL_CYCLES) {
          setIsComplete(true);
          setIsActive(false);
          database
            .saveAntianxietySession({
              exerciseType: "breathing",
              completedAt: new Date().toISOString(),
            })
            .catch(() => {});
        } else {
          setCycle((prev) => prev + 1);
        }
      }

      if (!isComplete && !(nextIndex === 0 && cycle + 1 >= TOTAL_CYCLES)) {
        setCurrentPhase(PHASES[nextIndex].phase);
      }
    }, duration);

    return () => {
      clearTimeout(timeout);
      clearInterval(countdownInterval);
    };
  }, [isActive, currentPhase, cycle, isComplete, scaleAnim, opacityAnim]);

  const handleStart = () => {
    setIsActive(true);
    setIsComplete(false);
    setCycle(0);
    setCurrentPhase("inhale");
    scaleAnim.setValue(1);
    opacityAnim.setValue(0.3);
  };

  const handleStop = () => {
    setIsActive(false);
    scaleAnim.setValue(1);
    opacityAnim.setValue(0.3);
  };

  const handleFinish = () => {
    router.push("/antianxiety/reflection" as any);
  };

  const handleBack = () => {
    router.back();
  };

  const currentPhaseData = PHASES.find((p) => p.phase === currentPhase);

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
          <Text style={styles.headerTitle}>Дыхание 4-7-8</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {!isActive && !isComplete && (
            <View style={styles.introSection}>
              <Text style={styles.introTitle}>Техника дыхания 4-7-8</Text>
              <Text style={styles.introText}>
                Эта техника активирует парасимпатическую нервную систему и помогает
                быстро успокоиться.
              </Text>
              <View style={styles.instructionsList}>
                <Text style={styles.instructionItem}>• Вдох через нос — 4 секунды</Text>
                <Text style={styles.instructionItem}>• Задержка дыхания — 7 секунд</Text>
                <Text style={styles.instructionItem}>• Выдох через рот — 8 секунд</Text>
              </View>
              <Text style={styles.cycleInfo}>Мы сделаем {TOTAL_CYCLES} цикла</Text>
            </View>
          )}

          {isActive && (
            <View style={styles.breathingSection}>
              <Text style={styles.cycleCounter}>
                Цикл {cycle + 1} из {TOTAL_CYCLES}
              </Text>

              <View style={styles.circleContainer}>
                <Animated.View
                  style={[
                    styles.breathCircle,
                    {
                      transform: [{ scale: scaleAnim }],
                      opacity: opacityAnim,
                    },
                  ]}
                />
                <View style={styles.circleContent}>
                  <Text style={styles.phaseLabel}>{currentPhaseData?.label}</Text>
                  <Text style={styles.countdownText}>{countdown}</Text>
                </View>
              </View>
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
              <Text style={styles.completeTitle}>Отлично</Text>
              <Text style={styles.completeText}>
                Ты завершил практику дыхания. Как ты себя чувствуешь сейчас?
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {!isActive && !isComplete && (
            <Pressable style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Начать</Text>
            </Pressable>
          )}

          {isActive && (
            <Pressable style={styles.stopButton} onPress={handleStop}>
              <Text style={styles.stopButtonText}>Остановить</Text>
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
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  introSection: {
    alignItems: "center",
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
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  instructionsList: {
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    marginBottom: 20,
  },
  instructionItem: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  cycleInfo: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  breathingSection: {
    alignItems: "center",
  },
  cycleCounter: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 40,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  circleContainer: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  breathCircle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#4A90A4",
  },
  circleContent: {
    alignItems: "center",
  },
  phaseLabel: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  countdownText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
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
    backgroundColor: "#4A90A4",
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
  stopButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  stopButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
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

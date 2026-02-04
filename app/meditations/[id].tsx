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
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import { MEDITATIONS } from "../../constants/meditations";
import { audioService } from "../../services/audio";

export default function MeditationPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const meditation = MEDITATIONS.find((m) => m.id === id);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = meditation ? meditation.duration * 60 : 0;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 30000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.stopAnimation();
      rotateAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isPlaying, pulseAnim, rotateAnim]);

  const handlePlay = () => {
    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;
        progressAnim.setValue(next / totalSeconds);
        if (next >= totalSeconds) {
          handleComplete();
          return totalSeconds;
        }
        return next;
      });
    }, 1000);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleComplete = async () => {
    setIsPlaying(false);
    setIsComplete(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (meditation) {
      await audioService.saveMeditationSession(meditation.id, meditation.duration);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsComplete(false);
    progressAnim.setValue(0);
    handlePlay();
  };

  const handleBack = () => {
    handlePause();
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!meditation) {
    return (
      <BackgroundWrapper>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Медитация не найдена</Text>
            <Pressable style={styles.backButtonLarge} onPress={handleBack}>
              <Text style={styles.backButtonLargeText}>Назад</Text>
            </Pressable>
          </View>
        </View>
      </BackgroundWrapper>
    );
  }

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
          <Text style={styles.headerTitle}>Медитация</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.playerSection}>
            <View style={styles.circleContainer}>
              <Animated.View
                style={[
                  styles.outerRing,
                  {
                    transform: [{ rotate: spin }],
                    borderColor: `${meditation.color}40`,
                  },
                ]}
              />
              <View
                style={[
                  styles.progressRing,
                  { borderColor: `${meditation.color}20` },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: meditation.color,
                      transform: [
                        {
                          rotate: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "360deg"],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </View>
              <Animated.View
                style={[
                  styles.innerCircle,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <LinearGradient
                  colors={[`${meditation.color}50`, `${meditation.color}30`]}
                  style={styles.innerCircleGradient}
                >
                  <MaterialCommunityIcons
                    name={meditation.icon as any}
                    size={56}
                    color={meditation.color}
                  />
                </LinearGradient>
              </Animated.View>
            </View>

            <Text style={styles.meditationTitle}>{meditation.title}</Text>
            <Text style={styles.meditationDesc}>{meditation.description}</Text>

            <View style={styles.timeContainer}>
              <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
              <View style={styles.timeDivider} />
              <Text style={styles.totalTime}>{formatTime(totalSeconds)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          {isComplete ? (
            <View style={styles.completeSection}>
              <View style={styles.completeIconWrapper}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={56}
                  color="#4A9D7A"
                />
              </View>
              <Text style={styles.completeTitle}>Медитация завершена</Text>
              <Text style={styles.completeText}>
                Ты уделил время себе. Это важно.
              </Text>
              <View style={styles.completeButtons}>
                <Pressable style={styles.repeatButton} onPress={handleRestart}>
                  <MaterialCommunityIcons
                    name="refresh"
                    size={20}
                    color="rgba(255, 255, 255, 0.7)"
                  />
                  <Text style={styles.repeatButtonText}>Повторить</Text>
                </Pressable>
                <Pressable style={styles.doneButton} onPress={handleBack}>
                  <Text style={styles.doneButtonText}>Готово</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.controlsRow}>
              <Pressable
                style={styles.skipButton}
                onPress={() => {
                  const newTime = Math.max(0, currentTime - 15);
                  setCurrentTime(newTime);
                  progressAnim.setValue(newTime / totalSeconds);
                }}
              >
                <MaterialCommunityIcons
                  name="rewind-15"
                  size={28}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </Pressable>

              <Pressable
                style={[styles.playButton, { backgroundColor: meditation.color }]}
                onPress={isPlaying ? handlePause : handlePlay}
              >
                <MaterialCommunityIcons
                  name={isPlaying ? "pause" : "play"}
                  size={40}
                  color="#FFFFFF"
                />
              </Pressable>

              <Pressable
                style={styles.skipButton}
                onPress={() => {
                  const newTime = Math.min(totalSeconds, currentTime + 15);
                  setCurrentTime(newTime);
                  progressAnim.setValue(newTime / totalSeconds);
                }}
              >
                <MaterialCommunityIcons
                  name="fast-forward-15"
                  size={28}
                  color="rgba(255, 255, 255, 0.6)"
                />
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
  playerSection: {
    alignItems: "center",
  },
  circleContainer: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  outerRing: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  progressRing: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
  },
  progressFill: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    top: -4,
    left: "50%",
    marginLeft: -4,
  },
  innerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: "hidden",
  },
  innerCircleGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  meditationTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  meditationDesc: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 16,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  currentTime: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  timeDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  totalTime: {
    fontSize: 20,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
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
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  skipButton: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 10 },
      default: {},
    }),
  },
  completeSection: {
    alignItems: "center",
    paddingTop: 20,
  },
  completeIconWrapper: {
    marginBottom: 16,
  },
  completeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  completeText: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  completeButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
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
  doneButton: {
    flex: 1,
    backgroundColor: "#4A9D7A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  backButtonLarge: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  backButtonLargeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

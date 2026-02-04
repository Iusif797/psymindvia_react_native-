import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  Modal,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import {
  MEDITATIONS,
  AMBIENT_SOUNDS,
  MEDITATION_CATEGORIES,
  SLEEP_TIMER_OPTIONS,
  type MeditationCategory,
  type Meditation,
  type AmbientSound,
} from "../../constants/meditations";
import { audioService } from "../../services/audio";
import Slider from "../../components/Slider";

const { width } = Dimensions.get("window");

export default function MeditationsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<MeditationCategory | "all">("all");
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [totalMinutes, setTotalMinutes] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadStats();
      return () => {};
    }, [])
  );

  useEffect(() => {
    const soundId = audioService.getCurrentSoundId();
    setPlayingSound(soundId);
    setVolume(audioService.getVolume());
  }, []);

  const loadStats = async () => {
    const minutes = await audioService.getTotalMeditationMinutes();
    setTotalMinutes(minutes);
  };

  const filteredMeditations = selectedCategory === "all"
    ? MEDITATIONS
    : MEDITATIONS.filter((m) => m.category === selectedCategory);

  const handleMeditationPress = (meditation: Meditation) => {
    router.push(`/meditations/${meditation.id}` as any);
  };

  const handleSoundPress = async (sound: AmbientSound) => {
    if (playingSound === sound.id) {
      await audioService.stopSound();
      setPlayingSound(null);
    } else {
      await audioService.playSound(sound.id);
      setPlayingSound(sound.id);
    }
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    await audioService.setVolume(value);
  };

  const handleSetTimer = (minutes: number) => {
    setSleepTimer(minutes);
    if (minutes > 0 && playingSound) {
      audioService.setSleepTimer(minutes, () => {
        setPlayingSound(null);
        setSleepTimer(0);
      });
    } else {
      audioService.clearSleepTimer();
    }
    setShowTimerModal(false);
  };

  const handleStopAll = async () => {
    await audioService.stopSound();
    setPlayingSound(null);
    setSleepTimer(0);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} мин`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Медитации</Text>
            <Text style={styles.subtitle}>Расслабление и внутренний покой</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <LinearGradient
                colors={["rgba(147, 112, 219, 0.3)", "rgba(147, 112, 219, 0.1)"]}
                style={styles.statIcon}
              >
                <MaterialCommunityIcons name="meditation" size={20} color="#C9A0FF" />
              </LinearGradient>
              <View>
                <Text style={styles.statValue}>{formatDuration(totalMinutes)}</Text>
                <Text style={styles.statLabel}>практики</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Категории</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              <Pressable
                style={[
                  styles.categoryChip,
                  selectedCategory === "all" && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory("all")}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === "all" && styles.categoryChipTextActive,
                  ]}
                >
                  Все
                </Text>
              </Pressable>
              {(Object.keys(MEDITATION_CATEGORIES) as MeditationCategory[]).map((cat) => {
                const { label, icon, color } = MEDITATION_CATEGORIES[cat];
                const isActive = selectedCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    style={[
                      styles.categoryChip,
                      isActive && { backgroundColor: `${color}30`, borderColor: color },
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <MaterialCommunityIcons
                      name={icon as any}
                      size={16}
                      color={isActive ? color : "rgba(255, 255, 255, 0.6)"}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        isActive && { color },
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Медитации</Text>
            <View style={styles.meditationsGrid}>
              {filteredMeditations.map((meditation) => (
                <Pressable
                  key={meditation.id}
                  style={styles.meditationCard}
                  onPress={() => handleMeditationPress(meditation)}
                >
                  <LinearGradient
                    colors={[`${meditation.color}30`, `${meditation.color}10`]}
                    style={styles.meditationGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={[styles.meditationIcon, { backgroundColor: `${meditation.color}40` }]}>
                      <MaterialCommunityIcons
                        name={meditation.icon as any}
                        size={28}
                        color={meditation.color}
                      />
                    </View>
                    <Text style={styles.meditationTitle} numberOfLines={1}>
                      {meditation.title}
                    </Text>
                    <Text style={styles.meditationDesc} numberOfLines={2}>
                      {meditation.description}
                    </Text>
                    <View style={styles.meditationFooter}>
                      <View style={styles.durationBadge}>
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={12}
                          color="rgba(255, 255, 255, 0.6)"
                        />
                        <Text style={styles.durationText}>{meditation.duration} мин</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ambient звуки</Text>
              {playingSound && (
                <Pressable style={styles.stopButton} onPress={handleStopAll}>
                  <MaterialCommunityIcons name="stop" size={16} color="#E05555" />
                  <Text style={styles.stopButtonText}>Стоп</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.soundsGrid}>
              {AMBIENT_SOUNDS.map((sound) => {
                const isPlaying = playingSound === sound.id;
                return (
                  <Pressable
                    key={sound.id}
                    style={[
                      styles.soundCard,
                      isPlaying && { borderColor: sound.color, backgroundColor: `${sound.color}20` },
                    ]}
                    onPress={() => handleSoundPress(sound)}
                  >
                    <View
                      style={[
                        styles.soundIcon,
                        { backgroundColor: `${sound.color}30` },
                        isPlaying && { backgroundColor: `${sound.color}50` },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={sound.icon as any}
                        size={24}
                        color={sound.color}
                      />
                      {isPlaying && (
                        <View style={styles.playingIndicator}>
                          <View style={[styles.playingDot, { backgroundColor: sound.color }]} />
                        </View>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.soundTitle,
                        isPlaying && { color: sound.color },
                      ]}
                    >
                      {sound.title}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {playingSound && (
            <View style={styles.controlsSection}>
              <View style={styles.controlRow}>
                <MaterialCommunityIcons
                  name="volume-low"
                  size={20}
                  color="rgba(255, 255, 255, 0.6)"
                />
                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  minimumValue={0}
                  maximumValue={1}
                  style={styles.volumeSlider}
                />
                <MaterialCommunityIcons
                  name="volume-high"
                  size={20}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </View>

              <Pressable
                style={styles.timerButton}
                onPress={() => setShowTimerModal(true)}
              >
                <MaterialCommunityIcons
                  name="timer-outline"
                  size={20}
                  color={sleepTimer > 0 ? "#F4C542" : "rgba(255, 255, 255, 0.6)"}
                />
                <Text
                  style={[
                    styles.timerButtonText,
                    sleepTimer > 0 && { color: "#F4C542" },
                  ]}
                >
                  {sleepTimer > 0 ? `Таймер: ${sleepTimer} мин` : "Таймер сна"}
                </Text>
              </Pressable>
            </View>
          )}

          <View style={styles.footerSpace} />
        </ScrollView>

        <Modal
          visible={showTimerModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTimerModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowTimerModal(false)}
          >
            <Pressable style={styles.modalContent} onPress={() => {}}>
              <Text style={styles.modalTitle}>Таймер засыпания</Text>
              <Text style={styles.modalSubtitle}>
                Звук автоматически выключится
              </Text>

              <View style={styles.timerOptions}>
                {SLEEP_TIMER_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    style={[
                      styles.timerOption,
                      sleepTimer === option.value && styles.timerOptionActive,
                    ]}
                    onPress={() => handleSetTimer(option.value)}
                  >
                    <Text
                      style={[
                        styles.timerOptionText,
                        sleepTimer === option.value && styles.timerOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Pressable>
        </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 28,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.3,
  },
  categoriesContainer: {
    gap: 10,
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  categoryChipActive: {
    backgroundColor: "rgba(147, 112, 219, 0.25)",
    borderColor: "#C9A0FF",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  categoryChipTextActive: {
    color: "#C9A0FF",
  },
  meditationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  meditationCard: {
    width: (width - 54) / 2,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  meditationGradient: {
    padding: 16,
    minHeight: 170,
  },
  meditationIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  meditationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  meditationDesc: {
    fontSize: 12,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 18,
    flex: 1,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  meditationFooter: {
    marginTop: 8,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
  },
  durationText: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  soundsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  soundCard: {
    width: (width - 56) / 4,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  soundIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  playingIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  playingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  soundTitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  stopButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "rgba(224, 85, 85, 0.15)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(224, 85, 85, 0.3)",
  },
  stopButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#E05555",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  controlsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 20,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  volumeSlider: {
    flex: 1,
  },
  timerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  timerButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  footerSpace: {
    height: 60,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#1a1a2e",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  timerOptions: {
    gap: 10,
  },
  timerOption: {
    paddingVertical: 16,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  timerOptionActive: {
    backgroundColor: "rgba(244, 197, 66, 0.15)",
    borderColor: "#F4C542",
  },
  timerOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  timerOptionTextActive: {
    color: "#F4C542",
  },
});

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
  KeyboardAvoidingView,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundWrapper from "../../components/BackgroundWrapper";

type Emotion = {
  id: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  color: string;
};

const EMOTIONS: Emotion[] = [
  { id: "calm", icon: "emoticon-happy-outline", label: "Спокойствие", color: "#4A9D7A" },
  { id: "joy", icon: "emoticon-excited-outline", label: "Радость", color: "#F4C542" },
  { id: "sadness", icon: "emoticon-sad-outline", label: "Грусть", color: "#6B8EAD" },
  { id: "anxiety", icon: "emoticon-confused-outline", label: "Тревога", color: "#C08450" },
  { id: "anger", icon: "emoticon-angry-outline", label: "Злость", color: "#C75450" },
  { id: "fear", icon: "emoticon-dead-outline", label: "Страх", color: "#7B6B8E" },
  { id: "emptiness", icon: "emoticon-neutral-outline", label: "Пустота", color: "#8A8A8A" },
  { id: "hope", icon: "emoticon-cool-outline", label: "Надежда", color: "#4A90A4" },
];

const BODY_SENSATIONS = [
  { id: "tension", label: "Напряжение в теле" },
  { id: "heaviness", label: "Тяжесть" },
  { id: "lightness", label: "Лёгкость" },
  { id: "pain", label: "Боль или дискомфорт" },
  { id: "warmth", label: "Тепло" },
  { id: "cold", label: "Холод" },
  { id: "numbness", label: "Онемение" },
  { id: "energy", label: "Прилив энергии" },
];

const ANXIETY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function TrackerScreen() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [anxietyLevel, setAnxietyLevel] = useState<number>(5);
  const [selectedSensations, setSelectedSensations] = useState<string[]>([]);
  const [thought, setThought] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const toggleEmotion = (emotionId: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotionId)
        ? prev.filter((id) => id !== emotionId)
        : [...prev, emotionId]
    );
  };

  const toggleSensation = (sensationId: string) => {
    setSelectedSensations((prev) =>
      prev.includes(sensationId)
        ? prev.filter((id) => id !== sensationId)
        : [...prev, sensationId]
    );
  };

  const handleSave = async () => {
    if (selectedEmotions.length === 0) return;

    setIsSaving(true);

    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      emotions: selectedEmotions,
      anxietyLevel,
      bodySensations: selectedSensations,
      thought: thought.trim(),
    };

    try {
      const existingData = await AsyncStorage.getItem("tracker_entries");
      const entries = existingData ? JSON.parse(existingData) : [];
      entries.unshift(entry);
      await AsyncStorage.setItem("tracker_entries", JSON.stringify(entries));
      await AsyncStorage.setItem("last_entry", JSON.stringify(entry));

      router.push("/tracker/response");
    } catch {
      setIsSaving(false);
    }
  };

  const getAnxietyColor = (level: number) => {
    if (level <= 3) return "#4A9D7A";
    if (level <= 6) return "#C08450";
    return "#C75450";
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerSection}>
            <Text style={styles.greeting}>Как ты сегодня?</Text>
            <Text style={styles.subtitle}>
              Отметь своё состояние. Это только для тебя.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Что ты чувствуешь?</Text>
            <Text style={styles.sectionHint}>Можно выбрать несколько</Text>
            <View style={styles.emotionsGrid}>
              {EMOTIONS.map((emotion) => {
                const isSelected = selectedEmotions.includes(emotion.id);
                return (
                  <Pressable
                    key={emotion.id}
                    style={[
                      styles.emotionCard,
                      isSelected && {
                        borderColor: emotion.color,
                        backgroundColor: `${emotion.color}20`,
                      },
                    ]}
                    onPress={() => toggleEmotion(emotion.id)}
                  >
                    <MaterialCommunityIcons
                      name={emotion.icon}
                      size={32}
                      color={isSelected ? emotion.color : "rgba(255, 255, 255, 0.6)"}
                    />
                    <Text
                      style={[
                        styles.emotionLabel,
                        isSelected && { color: emotion.color },
                      ]}
                    >
                      {emotion.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Уровень тревоги</Text>
            <Text style={styles.sectionHint}>От 1 (спокойно) до 10 (очень тревожно)</Text>
            <View style={styles.anxietyContainer}>
              <View style={styles.anxietyScale}>
                {ANXIETY_LEVELS.map((level) => (
                  <Pressable
                    key={level}
                    style={[
                      styles.anxietyDot,
                      anxietyLevel === level && {
                        backgroundColor: getAnxietyColor(level),
                        transform: [{ scale: 1.3 }],
                      },
                    ]}
                    onPress={() => setAnxietyLevel(level)}
                  >
                    <Text
                      style={[
                        styles.anxietyNumber,
                        anxietyLevel === level && styles.anxietyNumberActive,
                      ]}
                    >
                      {level}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.anxietyLabels}>
                <Text style={styles.anxietyLabelText}>Спокойно</Text>
                <Text style={styles.anxietyLabelText}>Тревожно</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ощущения в теле</Text>
            <Text style={styles.sectionHint}>Что замечаешь прямо сейчас?</Text>
            <View style={styles.sensationsGrid}>
              {BODY_SENSATIONS.map((sensation) => {
                const isSelected = selectedSensations.includes(sensation.id);
                return (
                  <Pressable
                    key={sensation.id}
                    style={[
                      styles.sensationChip,
                      isSelected && styles.sensationChipActive,
                    ]}
                    onPress={() => toggleSensation(sensation.id)}
                  >
                    <Text
                      style={[
                        styles.sensationText,
                        isSelected && styles.sensationTextActive,
                      ]}
                    >
                      {sensation.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Мысль дня</Text>
            <Text style={styles.sectionHint}>
              Что крутится в голове? Запиши, если хочешь.
            </Text>
            <TextInput
              style={styles.thoughtInput}
              placeholder="Напиши здесь..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={thought}
              onChangeText={setThought}
            />
          </View>

          <Pressable
            style={[
              styles.saveButton,
              selectedEmotions.length === 0 && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={selectedEmotions.length === 0 || isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? "Сохраняю..." : "Сохранить"}
            </Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            Это не диагностика и не терапия. Просто способ замечать себя.
          </Text>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  headerSection: {
    marginBottom: 32,
  },
  greeting: {
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
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.3,
  },
  sectionHint: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  emotionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  emotionCard: {
    width: "47%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.12)",
    gap: 8,
  },
  emotionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  anxietyContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  anxietyScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  anxietyDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  anxietyNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
  },
  anxietyNumberActive: {
    color: "#FFFFFF",
  },
  anxietyLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  anxietyLabelText: {
    fontSize: 12,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  sensationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sensationChip: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  sensationChipActive: {
    backgroundColor: "rgba(74, 157, 122, 0.2)",
    borderColor: "#4A9D7A",
  },
  sensationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  sensationTextActive: {
    color: "#4A9D7A",
  },
  thoughtInput: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    lineHeight: 24,
  },
  saveButton: {
    backgroundColor: "rgba(74, 157, 122, 0.9)",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.5,
  },
  disclaimer: {
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
});

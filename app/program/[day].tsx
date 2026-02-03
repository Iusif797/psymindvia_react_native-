import { useState, useEffect, useCallback } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import {
  PROGRAM_DAYS,
  getProgramStorageKey,
  type ProgramSection,
} from "../../constants/program";

function parseDayParam(day: string | undefined): number | null {
  if (day == null) return null;
  const n = parseInt(day, 10);
  return Number.isNaN(n) ? null : n;
}

export default function ProgramDayScreen() {
  const { day: dayParam } = useLocalSearchParams<{ day: string }>();
  const dayId = parseDayParam(dayParam);
  const dayData = dayId != null ? PROGRAM_DAYS.find((d) => d.id === dayId) : null;

  const [values, setValues] = useState<Record<string, string | string[]>>({});

  const loadStored = useCallback(async () => {
    if (dayData == null) return;
    const keys = dayData.sections
      .filter(
        (s): s is ProgramSection & { key: string } =>
          "key" in s && typeof (s as { key?: string }).key === "string"
      )
      .map((s) => getProgramStorageKey(dayData.id, s.key));
    const stored: Record<string, string | string[]> = {};
    await Promise.all(
      keys.map(async (key) => {
        const raw = await AsyncStorage.getItem(key);
        if (raw == null) return;
        const baseKey = key.replace(`program_day_${dayData.id}_`, "");
        try {
          const parsed = JSON.parse(raw);
          stored[baseKey] = Array.isArray(parsed) ? parsed : raw;
        } catch {
          stored[baseKey] = raw;
        }
      })
    );
    setValues((prev) => ({ ...prev, ...stored }));
  }, [dayData]);

  useEffect(() => {
    loadStored();
  }, [loadStored]);

  const saveValue = useCallback(
    async (key: string, value: string | string[]) => {
      if (dayData == null) return;
      const storageKey = getProgramStorageKey(dayData.id, key);
      await AsyncStorage.setItem(
        storageKey,
        typeof value === "string" ? value : JSON.stringify(value)
      );
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    [dayData]
  );

  const handlePromptChange = useCallback(
    (key: string, text: string) => {
      setValues((prev) => ({ ...prev, [key]: text }));
      saveValue(key, text);
    },
    [saveValue]
  );

  const handleListChange = useCallback(
    (key: string, index: number, text: string) => {
      const arr = Array.isArray(values[key]) ? [...(values[key] as string[])] : [];
      while (arr.length <= index) arr.push("");
      arr[index] = text;
      saveValue(key, arr);
      setValues((prev) => ({ ...prev, [key]: arr }));
    },
    [values, saveValue]
  );

  const addListItem = useCallback(
    (key: string) => {
      const arr = Array.isArray(values[key]) ? [...(values[key] as string[])] : [];
      arr.push("");
      saveValue(key, arr);
      setValues((prev) => ({ ...prev, [key]: arr }));
    },
    [values, saveValue]
  );

  if (dayData == null) {
    return (
      <BackgroundWrapper>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="rgba(255, 255, 255, 0.7)"
            />
          </Pressable>
          <Text style={styles.errorText}>День не найден</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="rgba(255, 255, 255, 0.7)"
            />
          </Pressable>
          <Text style={styles.headerTitle}>
            {dayData.title} · {dayData.subtitle}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.ruleBadge}>
              <MaterialCommunityIcons name="timer-sand" size={16} color="#4A9D7A" />
              <Text style={styles.ruleBadgeText}>{dayData.rule}</Text>
            </View>

            {dayData.sections.map((section, idx) => (
              <View key={idx} style={styles.section}>
                {section.type === "text" && (
                  <>
                    {section.paragraphs.map((p, i) => (
                      <Text key={i} style={styles.paragraph}>
                        {p}
                      </Text>
                    ))}
                  </>
                )}

                {section.type === "bullet" && (
                  <View style={styles.bulletList}>
                    {section.items.map((item, i) => (
                      <Text key={i} style={styles.bulletItem}>
                        • {item}
                      </Text>
                    ))}
                  </View>
                )}

                {section.type === "markers" && (
                  <>
                    <Text style={styles.markersTitle}>{section.title}</Text>
                    <View style={styles.markersList}>
                      {section.items.map((item, i) => (
                        <Text key={i} style={styles.markerItem}>
                          — {item}
                        </Text>
                      ))}
                    </View>
                  </>
                )}

                {section.type === "prompt" && (
                  <View style={styles.promptBlock}>
                    <Text style={styles.promptQuestion}>{section.question}</Text>
                    <TextInput
                      style={[styles.input, section.multiline && styles.inputMultiline]}
                      placeholder={section.placeholder}
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      multiline={section.multiline}
                      numberOfLines={section.multiline ? 4 : 1}
                      textAlignVertical={section.multiline ? "top" : "center"}
                      value={(values[section.key] as string) ?? ""}
                      onChangeText={(text) => handlePromptChange(section.key, text)}
                    />
                  </View>
                )}

                {section.type === "list" && (() => {
                  const raw = values[section.key];
                  const listItems = Array.isArray(raw) ? [...(raw as string[])] : [];
                  const minLen = section.minItems ?? 1;
                  while (listItems.length < minLen) listItems.push("");
                  return (
                  <View style={styles.listBlock}>
                    <Text style={styles.listQuestion}>{section.question}</Text>
                    {listItems.map((item, i) => (
                      <TextInput
                        key={i}
                        style={styles.listInput}
                        placeholder={section.itemPlaceholder ?? `Пункт ${i + 1}`}
                        placeholderTextColor="rgba(255, 255, 255, 0.3)"
                        value={item}
                        onChangeText={(text) =>
                          handleListChange(section.key, i, text)
                        }
                      />
                    ))}
                    <Pressable
                      style={styles.addItemButton}
                      onPress={() => addListItem(section.key)}
                    >
                      <MaterialCommunityIcons
                        name="plus-circle-outline"
                        size={22}
                        color="#4A9D7A"
                      />
                      <Text style={styles.addItemText}>Добавить пункт</Text>
                    </Pressable>
                  </View>
                  );
                })()}

                {section.type === "timer" && (
                  <View style={styles.timerBlock}>
                    <Text style={styles.timerLabel}>{section.label}</Text>
                    <Text style={styles.timerNote}>
                      Включите таймер на телефоне на {section.durationMinutes} мин и
                      выполните упражнение.
                    </Text>
                  </View>
                )}

                {section.type === "affirmation" && (
                  <View style={styles.affirmationBlock}>
                    <Text style={styles.affirmationText}>«{section.text}»</Text>
                    <Text style={styles.affirmationNote}>
                      Говорите себе {section.timesPerDay} раза в день.
                    </Text>
                  </View>
                )}
              </View>
            ))}
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
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
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
    paddingTop: 8,
    paddingBottom: 40,
  },
  ruleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(74, 157, 122, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 24,
  },
  ruleBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A9D7A",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  section: {
    marginBottom: 28,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 26,
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  bulletList: {
    marginTop: 8,
  },
  bulletItem: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  markersTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  markersList: {
    gap: 6,
  },
  markerItem: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  promptBlock: {
    marginTop: 8,
  },
  promptQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 14,
  },
  listBlock: {
    marginTop: 8,
  },
  listQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  listInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    paddingVertical: 10,
  },
  addItemText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A9D7A",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  timerBlock: {
    backgroundColor: "rgba(74, 157, 122, 0.15)",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(74, 157, 122, 0.3)",
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  timerNote: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.75)",
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  affirmationBlock: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  affirmationText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A9D7A",
    fontStyle: "italic",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  affirmationNote: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  errorText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginTop: 40,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

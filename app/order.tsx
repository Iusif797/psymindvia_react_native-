import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { courses, findCourse } from "../constants/courses";
import {
  submitCourseOrder,
  type ContactPref,
} from "../services/courseOrders";

const CONTACT_OPTIONS: { key: ContactPref; label: string; icon: string }[] = [
  { key: "email", label: "Email", icon: "email-outline" },
  { key: "phone", label: "Телефон", icon: "phone-outline" },
  { key: "whatsapp", label: "WhatsApp", icon: "whatsapp" },
  { key: "telegram", label: "Telegram", icon: "send-outline" },
];

const FALLBACK_WHATSAPP = "https://wa.me/994505252509";

export default function OrderScreen() {
  const params = useLocalSearchParams<{ courseId?: string }>();

  const [courseId, setCourseId] = useState<string>(
    () => findCourse(params.courseId)?.id ?? courses[0].id
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactPref, setContactPref] = useState<ContactPref>("email");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const course = useMemo(
    () => findCourse(courseId) ?? courses[0],
    [courseId]
  );

  const handleSubmit = useCallback(async () => {
    setErrors({});
    setSubmitting(true);

    const result = await submitCourseOrder(
      {
        courseId: course.id,
        courseTitle: course.title,
        coursePrice: course.price,
        name,
        email,
        phone,
        contactPref,
        note,
      },
      {
        platform: Platform.OS,
        appVersion: Constants.expoConfig?.version ?? undefined,
      }
    );

    setSubmitting(false);

    if (result.status === "invalid") {
      setErrors(result.fields);
      return;
    }

    if (result.status === "sent") {
      Alert.alert(
        "Заявка отправлена",
        "Мы получили вашу заявку и свяжемся с вами удобным для вас способом. Оплата в приложении не производится — все условия обсуждаются отдельно.",
        [{ text: "Хорошо", onPress: () => router.back() }]
      );
      return;
    }

    Alert.alert(
      "Заявка сохранена",
      "Сейчас нет связи с сервером. Заявка сохранена на устройстве и будет отправлена автоматически, как только появится интернет. Если вопрос срочный — напишите в WhatsApp.",
      [
        { text: "Хорошо", onPress: () => router.back() },
        {
          text: "WhatsApp",
          onPress: () => {
            void Linking.openURL(FALLBACK_WHATSAPP);
            router.back();
          },
        },
      ]
    );
  }, [course, name, email, phone, contactPref, note]);

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.hero}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Заявка на обучение</Text>
              </View>
              <Text style={styles.heroTitle}>Оставить заявку</Text>
              <Text style={styles.heroSubtitle}>
                Заполните форму — и психолог свяжется с вами, чтобы рассказать о
                программе, ответить на вопросы и обсудить условия участия.
              </Text>
            </View>

            {/* This notice is load-bearing: it is what makes the screen honest
                about the business model. Do not remove it. */}
            <View style={styles.noticeCard}>
              <MaterialCommunityIcons
                name="information-outline"
                size={22}
                color="#8FC7D8"
              />
              <Text style={styles.noticeText}>
                Это <Text style={styles.noticeStrong}>заявка, а не оплата</Text>.
                В приложении ничего не продаётся и не списывается. Обучение
                оплачивается отдельно, вне приложения, после того как вы
                обсудите условия с психологом. Все материалы приложения
                доступны бесплатно и остаются бесплатными.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Курс</Text>
              <Pressable
                style={styles.coursePicker}
                onPress={() => setShowPicker((v) => !v)}
              >
                <View style={styles.flex}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.coursePrice}>
                    Ориентировочная стоимость: {course.price}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name={showPicker ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#FFFFFF"
                />
              </Pressable>

              {showPicker && (
                <View style={styles.pickerList}>
                  {courses.map((c) => (
                    <Pressable
                      key={c.id}
                      style={[
                        styles.pickerItem,
                        c.id === course.id && styles.pickerItemActive,
                      ]}
                      onPress={() => {
                        setCourseId(c.id);
                        setShowPicker(false);
                      }}
                    >
                      <View
                        style={[styles.dot, { backgroundColor: c.accent }]}
                      />
                      <Text style={styles.pickerItemText} numberOfLines={2}>
                        {c.title}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
              {errors.course ? (
                <Text style={styles.error}>{errors.course}</Text>
              ) : null}

              <Text style={styles.label}>Ваше имя *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Введите ваше имя"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={name}
                onChangeText={setName}
              />
              {errors.name ? (
                <Text style={styles.error}>{errors.name}</Text>
              ) : null}

              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="example@email.com"
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
              {errors.email ? (
                <Text style={styles.error}>{errors.email}</Text>
              ) : null}

              <Text style={styles.label}>Телефон</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="+994 XX XXX XX XX"
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              {errors.phone ? (
                <Text style={styles.error}>{errors.phone}</Text>
              ) : null}

              <Text style={styles.label}>Как с вами связаться</Text>
              <View style={styles.prefRow}>
                {CONTACT_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt.key}
                    style={[
                      styles.prefChip,
                      contactPref === opt.key && styles.prefChipActive,
                    ]}
                    onPress={() => setContactPref(opt.key)}
                  >
                    <MaterialCommunityIcons
                      name={opt.icon as never}
                      size={16}
                      color={
                        contactPref === opt.key
                          ? "#FFFFFF"
                          : "rgba(255,255,255,0.65)"
                      }
                    />
                    <Text
                      style={[
                        styles.prefChipText,
                        contactPref === opt.key && styles.prefChipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.label}>Комментарий</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Что вам важно узнать о курсе?"
                placeholderTextColor="rgba(255,255,255,0.5)"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={note}
                onChangeText={setNote}
              />
              {errors.note ? (
                <Text style={styles.error}>{errors.note}</Text>
              ) : null}

              <Pressable
                style={[styles.submit, submitting && styles.submitDisabled]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.submitText}>Отправить заявку</Text>
                    <MaterialCommunityIcons
                      name="send"
                      size={18}
                      color="#FFFFFF"
                    />
                  </>
                )}
              </Pressable>

              <Text style={styles.privacy}>
                Отправляя заявку, вы передаёте нам указанные контактные данные
                исключительно для ответа на эту заявку. Вашу заявку получает
                психолог, к которому вы обращаетесь. Больше мы не передаём эти
                данные никому и не используем их для рекламы. Чтобы удалить свои
                данные, напишите нам — контакты в разделе «Контакты».
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </BackgroundWrapper>
  );
}

const serif = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  flex: { flex: 1 },
  content: { paddingBottom: 48 },
  hero: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(74, 144, 164, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: "#8FC7D8",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: serif,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: serif,
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 24,
    fontFamily: serif,
  },
  noticeCard: {
    marginHorizontal: 24,
    marginBottom: 20,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(74, 144, 164, 0.16)",
    borderColor: "rgba(143, 199, 216, 0.45)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  noticeText: {
    flex: 1,
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    lineHeight: 21,
    fontFamily: serif,
  },
  noticeStrong: { fontWeight: "700", color: "#FFFFFF" },
  card: {
    marginHorizontal: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 10,
    marginTop: 16,
    fontFamily: serif,
  },
  coursePicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 12,
    padding: 16,
  },
  courseTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: serif,
  },
  coursePrice: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    marginTop: 4,
    fontFamily: serif,
  },
  pickerList: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  pickerItemActive: { backgroundColor: "rgba(74,144,164,0.35)" },
  pickerItemText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: serif,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: serif,
  },
  inputError: { borderColor: "#E8A87C" },
  textarea: { height: 110, paddingTop: 16 },
  error: {
    color: "#E8A87C",
    fontSize: 13,
    marginTop: 6,
    fontFamily: serif,
  },
  prefRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  prefChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  prefChipActive: {
    backgroundColor: "#4A90A4",
    borderColor: "#4A90A4",
  },
  prefChipText: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
    fontFamily: serif,
  },
  prefChipTextActive: { color: "#FFFFFF", fontWeight: "700" },
  submit: {
    marginTop: 24,
    backgroundColor: "#4A90A4",
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 54,
  },
  submitDisabled: { opacity: 0.6 },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: serif,
  },
  privacy: {
    marginTop: 16,
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: serif,
  },
});

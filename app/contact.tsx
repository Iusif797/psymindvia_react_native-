import { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet, ScrollView, StatusBar, Linking, Platform, Dimensions, KeyboardAvoidingView, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../components/BackgroundWrapper";

const { height } = Dimensions.get("window");

const CONTACT_EMAIL = "teonaxametova5@gmail.com";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * У приложения нет собственного сервера, поэтому форма не «отправляет»
 * сообщение сама — она собирает его и передаёт в почтовый клиент
 * устройства. Так письмо реально уходит и остаётся у пользователя
 * в «Отправленных». Если почтовый клиент недоступен, показываем адрес,
 * чтобы человек мог написать вручную, — но молча ничего не теряем.
 */
const CONTACT_EMAIL = "teonaxametova5@gmail.com";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      Alert.alert(
        "Заполните обязательные поля",
        "Пожалуйста, укажите имя, email и текст сообщения."
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert("Проверьте email", "Кажется, адрес указан с ошибкой.");
      return;
    }

    setSending(true);

    const subject = `Заявка из приложения — ${trimmedName}`;
    const body = [
      `Имя: ${trimmedName}`,
      `Email: ${trimmedEmail}`,
      phone.trim() ? `Телефон: ${phone.trim()}` : null,
      "",
      trimmedMessage,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const mailUrl =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    try {
      await Linking.openURL(mailUrl);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      Alert.alert(
        "Не удалось открыть почту",
        `На устройстве не найден почтовый клиент. Напишите, пожалуйста, напрямую на ${CONTACT_EMAIL} — или позвоните по телефону, указанному ниже.`
      );
    } finally {
      setSending(false);
    }
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
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.heroSection}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Связаться</Text>
              </View>
              <Text style={styles.heroTitle}>Свяжитесь со мной</Text>
              <Text style={styles.heroSubtitle}>
                Готов ответить на все ваши вопросы и помочь записаться на консультацию
              </Text>
            </View>

            <View style={styles.formSection}>
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Отправить сообщение</Text>

                <View style={styles.inputGroup}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Ваше имя *</Text>
                    <TextInput
                      placeholder="Введите ваше имя"
                      style={styles.input}
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                      placeholder="example@email.com"
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Телефон</Text>
                  <TextInput
                    placeholder="+994 XX XXX XX XX"
                    style={styles.input}
                    keyboardType="phone-pad"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Сообщение *</Text>
                  <TextInput
                    placeholder="Расскажите о вашем запросе..."
                    style={[styles.input, styles.textarea]}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={message}
                    onChangeText={setMessage}
                  />
                </View>

                <Pressable
                  style={[styles.submitButton, sending && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={sending}
                  accessibilityRole="button"
                  accessibilityLabel="Отправить сообщение"
                >
                  <Text style={styles.submitButtonText}>
                    {sending ? "Открываем почту…" : "Отправить сообщение"}
                  </Text>
                  <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />
                </Pressable>

                <Text style={styles.submitHint}>
                  Сообщение откроется в вашем почтовом приложении — останется
                  нажать «Отправить».
                </Text>
              </View>
            </View>

            <View style={styles.contactInfoSection}>
              <Text style={styles.sectionTitle}>Контактная информация</Text>

              <View style={styles.infoGrid}>
                <View style={styles.contactItem}>
                  <View style={styles.contactIconContainer}>
                    <MaterialCommunityIcons name="phone-outline" size={24} color="#4A90A4" />
                  </View>
                  <View style={styles.contactTextContainer}>
                    <Text style={styles.contactLabel}>Телефон</Text>
                    <Text style={styles.contactValue}>+994 50 525 25 09</Text>
                  </View>
                  <Pressable
                    style={styles.contactAction}
                    onPress={() => Linking.openURL("tel:+994505252509")}
                  >
                    <MaterialCommunityIcons name="arrow-top-right" size={18} color="#9CA3AF" />
                  </Pressable>
                </View>

                <View style={styles.contactItem}>
                  <View style={styles.contactIconContainer}>
                    <MaterialCommunityIcons name="email-outline" size={24} color="#4A90A4" />
                  </View>
                  <View style={styles.contactTextContainer}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>teonaxametova5@gmail.com</Text>
                  </View>
                  <Pressable
                    style={styles.contactAction}
                    onPress={() => Linking.openURL("mailto:teonaxametova5@gmail.com")}
                  >
                    <MaterialCommunityIcons name="arrow-top-right" size={18} color="#9CA3AF" />
                  </Pressable>
                </View>

                <View style={styles.contactItem}>
                  <View style={styles.contactIconContainer}>
                    <MaterialCommunityIcons name="map-marker-outline" size={24} color="#4A90A4" />
                  </View>
                  <View style={styles.contactTextContainer}>
                    <Text style={styles.contactLabel}>Адрес</Text>
                    <Text style={styles.contactValue}>Баку, Азербайджан</Text>
                  </View>
                </View>

                <View style={styles.contactItem}>
                  <View style={styles.contactIconContainer}>
                    <MaterialCommunityIcons name="clock-outline" size={24} color="#4A90A4" />
                  </View>
                  <View style={styles.contactTextContainer}>
                    <Text style={styles.contactLabel}>Часы работы</Text>
                    <Text style={styles.contactValue}>Пн-Пт: 10:00 - 20:00</Text>
                  </View>
                </View>
              </View>

            </View>

            {/*
              Карточка «Официальный сайт» вела на psymindvia.com — этот домен
              не существует (нет записи whois, DNS не разрешается), поэтому
              ссылка открывала ошибку. Блок «Социальные сети» состоял из
              четырёх кнопок вообще без обработчика нажатия.

              Оба блока убраны: неработающая ссылка хуже, чем её отсутствие.
              Вернуть их можно, как только появятся подтверждённые адреса.
              Работающие каналы связи — телефон и email — остаются выше.
            */}
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
    paddingBottom: 40,
  },
  heroSection: {
    minHeight: height * 0.25,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(74, 144, 164, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: "#4A90A4",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  heroTitle: {
    fontSize: 32,
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
  heroSubtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  formSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  inputGroup: {
    flexDirection: "row",
    gap: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
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
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  textarea: {
    height: 120,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: "#4A90A4",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitHint: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 12,
    lineHeight: 18,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  contactInfoSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  infoGrid: {
    gap: 16,
    marginBottom: 24,
  },
  contactItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  contactAction: {
    padding: 8,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(74, 144, 164, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  contactValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  websiteCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  whatsappCard: {
    marginTop: 16,
  },
  websiteIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(74, 144, 164, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  websiteContent: {
    flex: 1,
  },
  websiteLabel: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  websiteValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

import { useState } from "react";
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
  Image,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BackgroundWrapper from "../components/BackgroundWrapper";
import {
  auth,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
} from "../services/auth";

type AuthMode = "login" | "register";

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (mode === "register") {
      const confirmError = validatePasswordConfirm(password, confirmPassword);
      if (confirmError) newErrors.confirmPassword = confirmError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setGeneralError("");

    if (!validate()) return;

    setLoading(true);

    const result =
      mode === "login"
        ? await auth.login(email, password)
        : await auth.register(email, password);

    setLoading(false);

    if (result.success) {
      router.replace("/profile");
    } else {
      setGeneralError(result.error || "Произошла ошибка");
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setErrors({});
    setGeneralError("");
    setConfirmPassword("");
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
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/images/logo_drawermenu.jpg")}
                  style={styles.logo}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={styles.tabsContainer}>
              <Pressable
                style={[styles.tab, mode === "login" && styles.tabActive]}
                onPress={() => mode !== "login" && switchMode()}
              >
                <Text style={[styles.tabText, mode === "login" && styles.tabTextActive]}>
                  Вход
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tab, mode === "register" && styles.tabActive]}
                onPress={() => mode !== "register" && switchMode()}
              >
                <Text style={[styles.tabText, mode === "register" && styles.tabTextActive]}>
                  Регистрация
                </Text>
              </Pressable>
            </View>

            {generalError ? (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={16}
                  color="#E8A87C"
                />
                <Text style={styles.errorBannerText}>{generalError}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.email && styles.inputWrapperError,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="at"
                    size={18}
                    color="#C9A050"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="rgba(255, 255, 255, 0.35)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                  />
                </View>
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.password && styles.inputWrapperError,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="key-outline"
                    size={18}
                    color="#C9A050"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Пароль"
                    placeholderTextColor="rgba(255, 255, 255, 0.35)"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={8}
                    style={styles.eyeButton}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-off" : "eye"}
                      size={18}
                      color="rgba(255, 255, 255, 0.4)"
                    />
                  </Pressable>
                </View>
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              {mode === "register" && (
                <View style={styles.inputGroup}>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.confirmPassword && styles.inputWrapperError,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="key-chain"
                      size={18}
                      color="#C9A050"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Повторите пароль"
                      placeholderTextColor="rgba(255, 255, 255, 0.35)"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (errors.confirmPassword)
                          setErrors({ ...errors, confirmPassword: "" });
                      }}
                    />
                  </View>
                  {errors.confirmPassword ? (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  ) : null}
                </View>
              )}

              <Pressable
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#C9A050", "#A07D3A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#1a1a2e" size="small" />
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>
                        {mode === "login" ? "Войти" : "Создать аккаунт"}
                      </Text>
                      <MaterialCommunityIcons
                        name="arrow-right"
                        size={20}
                        color="#1a1a2e"
                      />
                    </>
                  )}
                </LinearGradient>
              </Pressable>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>или</Text>
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.hintText}>
              {mode === "login"
                ? "Войдите, чтобы сохранять свой прогресс"
                : "Создайте аккаунт для отслеживания упражнений"}
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
    paddingHorizontal: 32,
    paddingTop: Platform.OS === "ios" ? 80 : 50,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
  },
  logo: {
    width: 100,
    height: 100,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: "rgba(201, 160, 80, 0.2)",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  tabTextActive: {
    color: "#C9A050",
    fontWeight: "600",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(232, 168, 124, 0.12)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: "#E8A87C",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  form: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  inputWrapperError: {
    borderColor: "rgba(232, 168, 124, 0.5)",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  eyeButton: {
    padding: 2,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#E8A87C",
    marginLeft: 14,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.35)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  hintText: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.45)",
    textAlign: "center",
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

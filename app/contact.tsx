import { View, TextInput, Pressable, Text, StyleSheet, ScrollView, StatusBar, Linking, Platform, Dimensions, KeyboardAvoidingView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../components/BackgroundWrapper";

const { height } = Dimensions.get("window");

export default function Contact() {
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Контакты</Text>
            <Text style={styles.heroSubtitle}>
              Свяжитесь со мной любым удобным для вас способом, чтобы задать вопросы или записаться на
              консультацию.
            </Text>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ваше имя</Text>
            <TextInput 
              placeholder="Введите ваше имя" 
              style={styles.input}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              placeholder="example@email.com" 
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Телефон</Text>
            <TextInput 
              placeholder="" 
              style={styles.input}
              keyboardType="phone-pad"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Сообщение</Text>
            <TextInput 
              placeholder="Расскажите коротко о вашем запросе..." 
              style={[styles.input, styles.textarea]} 
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>
          
          <Pressable style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Отправить заявку</Text>
            <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
        
        <View style={styles.contactInfoSection}>
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <MaterialCommunityIcons name="phone-outline" size={26} color="#4A90A4" />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Телефон</Text>
              <Text style={styles.contactValue}>+994 50 525 25 09</Text>
            </View>
            <Pressable
              style={styles.contactAction}
              onPress={() => Linking.openURL("tel:+994505252509")}
              hitSlop={12}
            >
              <MaterialCommunityIcons name="arrow-top-right" size={20} color="#9CA3AF" />
            </Pressable>
          </View>

          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <MaterialCommunityIcons name="email-outline" size={26} color="#4A90A4" />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>teonaxametova5@gmail.com</Text>
            </View>
            <Pressable
              style={styles.contactAction}
              onPress={() => Linking.openURL("mailto:teonaxametova5@gmail.com")}
              hitSlop={12}
            >
              <MaterialCommunityIcons name="arrow-top-right" size={20} color="#9CA3AF" />
            </Pressable>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <MaterialCommunityIcons name="map-marker-outline" size={26} color="#4A90A4" />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Адрес</Text>
              <Text style={styles.contactValue}>Баку, Азербайджан</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <MaterialCommunityIcons name="clock-outline" size={26} color="#4A90A4" />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Часы работы</Text>
              <Text style={styles.contactValue}>Пн-Пт: 10:00 - 20:00</Text>
            </View>
          </View>

          <Pressable style={styles.websiteCard} onPress={() => Linking.openURL("https://www.psymindvia.com/")}>
            <View style={styles.websiteIcon}>
              <MaterialCommunityIcons name="web" size={26} color="#4A90A4" />
            </View>
            <View style={styles.websiteContent}>
              <Text style={styles.websiteLabel}>Сайт</Text>
              <Text style={styles.websiteValue}>psymindvia.com</Text>
            </View>
            <MaterialCommunityIcons name="arrow-top-right" size={20} color="#9CA3AF" />
          </Pressable>
        </View>
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
    minHeight: height * 0.28,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  heroContent: {
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroSubtitle: {
    fontSize: 17,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.95)",
    lineHeight: 26,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  formSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 22,
  },
  label: {
    fontSize: 15,
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
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 14,
    padding: 18,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  textarea: {
    height: 130,
    paddingTop: 18,
  },
  submitButton: {
    backgroundColor: "#4A90A4",
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 14,
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
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  contactInfoSection: {
    paddingHorizontal: 24,
    gap: 18,
  },
  contactItem: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  contactAction: {
    padding: 8,
    marginLeft: 8,
  },
  contactIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(74, 144, 164, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  contactValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  websiteCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  websiteIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(74, 144, 164, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  websiteContent: {
    flex: 1,
  },
  websiteLabel: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  websiteValue: {
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

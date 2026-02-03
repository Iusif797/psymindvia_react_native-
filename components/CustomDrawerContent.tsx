import { View, Text, StyleSheet, Image, Platform, TouchableOpacity, Linking } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CustomDrawerContent(props: any) {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/banner2.jpg")} style={styles.backgroundImage} />
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.65)", "rgba(0, 0, 0, 0.75)", "rgba(0, 0, 0, 0.8)"]}
        style={styles.darkOverlay}
      />
      <View style={styles.scrollWrapper}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <View style={styles.logoCircle}>
              <Image
                source={require("../assets/images/logo_drawermenu.jpg")}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.bannerTitle} numberOfLines={1}>
                MINDVIA
              </Text>
              <Text style={styles.bannerSubtitle} numberOfLines={2}>
                Психолог Теона Хаметова
              </Text>
            </View>
          </View>
          <View style={styles.headerDivider} />

          <View style={styles.menuSection}>
            <DrawerItemList {...props} />
          </View>
        </DrawerContentScrollView>
        <View style={styles.footer}>
          <Text style={styles.developerName}>Developed by Iusif Mamedov</Text>
          <View style={styles.footerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Linking.openURL("https://github.com/Iusif797")}
              activeOpacity={0.7}
              accessibilityLabel="GitHub profile"
            >
              <MaterialCommunityIcons name="github" size={22} color="rgba(255, 255, 255, 0.75)" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Linking.openURL("https://wa.me/420773975235")}
              activeOpacity={0.7}
              accessibilityLabel="WhatsApp contact"
            >
              <MaterialCommunityIcons name="whatsapp" size={22} color="rgba(255, 255, 255, 0.75)" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  darkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 0,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingTop: 44,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
  },
  logo: {
    width: 64,
    height: 64,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    textTransform: "uppercase",
    lineHeight: 28,
  },
  bannerSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontStyle: "italic",
    lineHeight: 18,
  },
  headerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 24,
    marginBottom: 16,
  },
  menuSection: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    paddingHorizontal: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
    gap: 12,
  },
  developerName: {
    fontSize: 11,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.55)",
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif",
      default: "sans-serif",
    }),
    letterSpacing: 0.5,
  },
  footerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 6,
  },
});

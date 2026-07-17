import { useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  Linking,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
} from "react-native";
import {
  CommonActions,
  DrawerActions,
  type DrawerNavigationState,
  type ParamListBase,
} from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useDrawerOpen } from "../contexts/DrawerOpenContext";

const springConfig = { damping: 18, stiffness: 180 };

type DrawerContentComponentProps = {
  state: DrawerNavigationState<ParamListBase>;
  navigation: {
    emit: (event: {
      type: "drawerItemPress";
      target?: string;
      canPreventDefault?: boolean;
    }) => { defaultPrevented: boolean };
    dispatch: (action: object) => void;
  };
  descriptors: Record<
    string,
    {
      options: {
        drawerLabel?: string | ((props: { color: string; focused: boolean }) => React.ReactNode);
        title?: string;
        drawerIcon?: (props: {
          focused: boolean;
          color: string;
          size: number;
        }) => React.ReactNode;
        drawerItemStyle?: { display?: string };
        drawerActiveTintColor?: string;
        drawerInactiveTintColor?: string;
        drawerActiveBackgroundColor?: string;
        drawerInactiveBackgroundColor?: string;
      };
    }
  >;
};

function getDrawerOpenFromState(state: DrawerNavigationState<ParamListBase>) {
  const entry = [...(state.history ?? [])]
    .reverse()
    .find((item) => item.type === "drawer");
  const status = entry && "status" in entry ? entry.status : state.default;
  return status === "open";
}

function DrawerItemRow({
  label,
  icon,
  focused,
  activeTintColor,
  inactiveTintColor,
  activeBgColor,
  inactiveBgColor,
  onPress,
}: {
  label: string;
  icon: (props: {
    focused: boolean;
    color: string;
    size: number;
  }) => React.ReactNode;
  focused: boolean;
  activeTintColor: string;
  inactiveTintColor: string;
  activeBgColor: string;
  inactiveBgColor: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const animatedRowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: focused ? activeBgColor : inactiveBgColor,
  }));

  const animatedIconWrap = useAnimatedStyle(() => ({
    opacity: 1 + glow.value * 0.2,
  }));

  const handlePressIn = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withSpring(0.96, springConfig);
    glow.value = withSpring(1, springConfig);
  }, [scale, glow]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, springConfig);
    glow.value = withSpring(0, springConfig);
  }, [scale, glow]);

  const color = focused ? activeTintColor : inactiveTintColor;

  return (
    <Animated.View style={[styles.drawerItemRow, animatedRowStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.drawerItemTouch}
      >
        <Animated.View style={[styles.drawerItemIconWrap, animatedIconWrap]}>
          {icon({ focused, color, size: 24 })}
        </Animated.View>
        <Text
          style={[
            styles.drawerItemLabel,
            { color },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function CustomDrawerContent(rawProps: object) {
  const props = rawProps as DrawerContentComponentProps;
  const { state, navigation, descriptors } = props;
  const progress = useSharedValue(0);
  const { setDrawerOpen } = useDrawerOpen();

  useEffect(() => {
    const isOpen = getDrawerOpenFromState(state);
    progress.value = withSpring(isOpen ? 1 : 0, springConfig);
    setDrawerOpen(isOpen);
  }, [state, progress, setDrawerOpen]);

  const animatedPanelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.4, 1], [0, 0.8, 1]);
    return { opacity };
  });

  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute?.key];
  const focusedOptions = focusedDescriptor?.options ?? {};
  const {
    drawerActiveTintColor = "#FFFFFF",
    drawerInactiveTintColor = "rgba(255, 255, 255, 0.7)",
    drawerActiveBackgroundColor = "rgba(255, 255, 255, 0.15)",
    drawerInactiveBackgroundColor = "transparent",
  } = focusedOptions;

  const visibleRoutes = state.routes.filter((route) => {
    const opts = descriptors[route.key]?.options;
    return opts?.drawerItemStyle?.display !== "none";
  });

  const panelWidth = 310;
  const panelHeight = Dimensions.get("window").height;

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.panelWrap, animatedPanelStyle]}>
        <Image
          source={require("../assets/images/banner2.jpg")}
          style={[styles.panelBgImage, { width: panelWidth, height: panelHeight }]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={[
            "rgba(0, 0, 0, 0.5)",
            "rgba(0, 0, 0, 0.65)",
            "rgba(0, 0, 0, 0.75)",
          ]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.panel} edges={["top", "left"]}>
          <KeyboardAvoidingView
            style={styles.keyboardWrap}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={0}
          >
            <ScrollView
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
                    Психолог{"\n"}Теона Хаметова
                  </Text>
                </View>
              </View>
              <View style={styles.headerDivider} />

              <View style={styles.menuSection}>
                {visibleRoutes.map((route) => {
                  const focused = state.routes.indexOf(route) === state.index;
                  const opts = descriptors[route.key]?.options ?? {};
                  const title =
                    opts.drawerLabel ?? opts.title ?? route.name;
                  const drawerIcon = opts.drawerIcon;

                  const onPress = () => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    const event = navigation.emit({
                      type: "drawerItemPress",
                      target: route.key,
                      canPreventDefault: true,
                    });
                    if (!event.defaultPrevented) {
                      navigation.dispatch({
                        ...(focused
                          ? DrawerActions.closeDrawer()
                          : CommonActions.navigate(route)),
                        target: state.key,
                      });
                    }
                  };

                  if (typeof drawerIcon !== "function") return null;

                  return (
                    <DrawerItemRow
                      key={route.key}
                      label={typeof title === "string" ? title : route.name}
                      icon={drawerIcon}
                      focused={focused}
                      activeTintColor={drawerActiveTintColor}
                      inactiveTintColor={drawerInactiveTintColor}
                      activeBgColor={drawerActiveBackgroundColor}
                      inactiveBgColor={drawerInactiveBackgroundColor}
                      onPress={onPress}
                    />
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Text style={styles.developerName}>
                Developed by Iusif Mamedov
              </Text>
              <View style={styles.footerIcons}>
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    Linking.openURL("https://github.com/Iusif797");
                  }}
                  activeOpacity={0.7}
                  style={styles.iconButton}
                  accessibilityLabel="GitHub profile"
                >
                  <MaterialCommunityIcons
                    name="github"
                    size={22}
                    color="rgba(255, 255, 255, 0.75)"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    Linking.openURL("https://wa.me/420773975235");
                  }}
                  activeOpacity={0.7}
                  style={styles.iconButton}
                  accessibilityLabel="WhatsApp contact"
                >
                  <MaterialCommunityIcons
                    name="whatsapp"
                    size={22}
                    color="rgba(255, 255, 255, 0.75)"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  panelWrap: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  panelBgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  panel: {
    flex: 1,
    backgroundColor: "transparent",
  },
  keyboardWrap: {
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
    paddingTop: 24,
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
    gap: 6,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  drawerItemRow: {
    borderRadius: 14,
    overflow: "hidden",
  },
  drawerItemTouch: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 14,
  },
  drawerItemIconWrap: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  drawerItemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
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

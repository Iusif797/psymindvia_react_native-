import { useCallback, useEffect } from "react";
import { Platform, Pressable } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const springConfig = { damping: 18, stiffness: 180 };

export default function DrawerBurgerIcon() {
  const navigation = useNavigation();
  const status = useDrawerStatus();
  const isOpen = status === "open";
  const rotation = useSharedValue(0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withTiming(isOpen ? 90 : 0, { duration: 220 });
  }, [isOpen, rotation]);

  const toggle = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.dispatch(DrawerActions.toggleDrawer());
  }, [navigation]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: iconScale.value },
    ],
  }));

  const handlePressIn = useCallback(() => {
    iconScale.value = withSpring(0.88, springConfig);
  }, [iconScale]);

  const handlePressOut = useCallback(() => {
    iconScale.value = withSpring(1, springConfig);
  }, [iconScale]);

  return (
    <Pressable
      onPress={toggle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={12}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <Animated.View style={[{ marginLeft: 16 }, animatedIconStyle]}>
        <MaterialCommunityIcons
          name={isOpen ? "close" : "menu"}
          size={26}
          color="#FFFFFF"
        />
      </Animated.View>
    </Pressable>
  );
}

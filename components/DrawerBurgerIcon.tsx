import { useCallback, useEffect } from "react";
import { Platform, Pressable } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useDrawerOpen } from "../contexts/DrawerOpenContext";

const springConfig = { damping: 18, stiffness: 180 };

export default function DrawerBurgerIcon() {
  const navigation = useNavigation();
  const { isDrawerOpen, setDrawerOpen } = useDrawerOpen();
  const rotation = useSharedValue(0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withTiming(isDrawerOpen ? 90 : 0, { duration: 220 });
  }, [isDrawerOpen, rotation]);

  const toggle = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDrawerOpen(!isDrawerOpen);
    navigation.dispatch(DrawerActions.toggleDrawer());
  }, [navigation, isDrawerOpen, setDrawerOpen]);

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
          name={isDrawerOpen ? "close" : "menu"}
          size={26}
          color="#FFFFFF"
        />
      </Animated.View>
    </Pressable>
  );
}

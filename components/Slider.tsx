import { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Platform,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  style?: ViewStyle;
}

export default function Slider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 1,
  style,
}: SliderProps) {
  const [width, setWidth] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getPosition = () => {
    const range = maximumValue - minimumValue;
    return ((value - minimumValue) / range) * width;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        Animated.spring(scaleAnim, {
          toValue: 1.3,
          useNativeDriver: true,
        }).start();
        handleMove(gestureState.x0);
      },
      onPanResponderMove: (_, gestureState) => {
        handleMove(gestureState.moveX);
      },
      onPanResponderRelease: () => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const handleMove = (x: number) => {
    if (width === 0) return;
    const position = Math.max(0, Math.min(x, width));
    const range = maximumValue - minimumValue;
    const newValue = minimumValue + (position / width) * range;
    onValueChange(Math.max(minimumValue, Math.min(maximumValue, newValue)));
  };

  const handleLayout = (event: any) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      style={[styles.container, style]}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
    >
      <View style={styles.track}>
        <LinearGradient
          colors={["#6BB3D0", "#4A90A4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.activeTrack, { width: getPosition() }]}
        />
      </View>
      <Animated.View
        style={[
          styles.thumb,
          {
            left: getPosition() - 10,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
  },
  track: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 3,
    overflow: "hidden",
  },
  activeTrack: {
    height: "100%",
    borderRadius: 3,
  },
  thumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
});

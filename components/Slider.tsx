import { useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
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
  const widthRef = useRef(0);
  const stateRef = useRef({ minimumValue, maximumValue, onValueChange });
  stateRef.current = { minimumValue, maximumValue, onValueChange };

  const gesture = useMemo(() => {
    const emitValueAt = (localX: number) => {
      const trackWidth = widthRef.current;
      if (trackWidth === 0) {
        return;
      }
      const position = Math.max(0, Math.min(localX, trackWidth));
      const { minimumValue: min, maximumValue: max, onValueChange: emit } =
        stateRef.current;
      emit(min + (position / trackWidth) * (max - min));
    };
    const pressThumb = (pressed: boolean) => {
      Animated.spring(scaleAnim, {
        toValue: pressed ? 1.3 : 1,
        useNativeDriver: true,
      }).start();
    };
    const pan = Gesture.Pan()
      .runOnJS(true)
      .activeOffsetX([-1, 1])
      .failOffsetY([-14, 14])
      .onBegin((event) => {
        pressThumb(true);
        emitValueAt(event.x);
      })
      .onUpdate((event) => emitValueAt(event.x))
      .onFinalize(() => pressThumb(false));
    const tap = Gesture.Tap()
      .runOnJS(true)
      .onEnd((event) => emitValueAt(event.x));
    return Gesture.Race(pan, tap);
  }, [scaleAnim]);

  const getPosition = () => {
    const range = maximumValue - minimumValue;
    if (range === 0 || width === 0) {
      return 0;
    }
    return ((value - minimumValue) / range) * width;
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    widthRef.current = event.nativeEvent.layout.width;
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.container, style]} onLayout={handleLayout}>
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
    </GestureDetector>
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

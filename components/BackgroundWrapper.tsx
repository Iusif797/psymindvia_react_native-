import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f1419"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </LinearGradient>
  );
}

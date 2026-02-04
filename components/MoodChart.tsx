import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface DataPoint {
  date: string;
  value: number;
  label: string;
}

interface MoodChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showLabels?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function MoodChart({
  data,
  height = 180,
  color = "#4A90A4",
  showLabels = true,
}: MoodChartProps) {
  if (data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Нет данных для отображения</Text>
        </View>
      </View>
    );
  }

  const maxValue = 10;
  const minValue = 1;
  const chartHeight = height - 40;

  const getNormalizedHeight = (value: number) => {
    return ((value - minValue) / (maxValue - minValue)) * chartHeight;
  };

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.chartArea}>
        <View style={styles.gridLines}>
          {[1, 3, 5, 7, 10].map((val) => (
            <View
              key={val}
              style={[
                styles.gridLine,
                { bottom: getNormalizedHeight(val) },
              ]}
            />
          ))}
        </View>

        <View style={styles.barsContainer}>
          {data.map((point, index) => (
            <View key={index} style={styles.barWrapper}>
              <View style={styles.barColumn}>
                <LinearGradient
                  colors={[color, `${color}60`]}
                  style={[
                    styles.bar,
                    { height: getNormalizedHeight(point.value) },
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                <View
                  style={[
                    styles.barDot,
                    {
                      backgroundColor: color,
                      bottom: getNormalizedHeight(point.value) - 5,
                    },
                  ]}
                />
              </View>
              {showLabels && (
                <Text style={styles.barLabel}>{point.label}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.yAxisLabels}>
          <Text style={styles.yLabel}>10</Text>
          <Text style={styles.yLabel}>5</Text>
          <Text style={styles.yLabel}>1</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  chartArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 24,
    position: "relative",
  },
  gridLines: {
    ...StyleSheet.absoluteFillObject,
    bottom: 24,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  barWrapper: {
    alignItems: "center",
    flex: 1,
  },
  barColumn: {
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  bar: {
    width: 8,
    borderRadius: 4,
    minHeight: 4,
  },
  barDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#1a1a2e",
  },
  barLabel: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  yAxisLabels: {
    position: "absolute",
    left: -24,
    top: 0,
    bottom: 24,
    justifyContent: "space-between",
  },
  yLabel: {
    fontSize: 10,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.4)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.4)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});

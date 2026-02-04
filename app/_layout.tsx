import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, View } from "react-native";
import CustomDrawerContent from "../components/CustomDrawerContent";
import PanicButton from "../components/PanicButton";

const drawerLabelStyle = {
  fontSize: 16,
  fontWeight: "600" as const,
  fontFamily: Platform.select({
    ios: "Georgia",
    android: "serif",
    default: "serif",
  }),
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          ...({
            sceneContainerStyle: { backgroundColor: "transparent" },
          } as object),
          headerTransparent: false,
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontSize: 19,
            fontWeight: "700",
            color: "#FFFFFF",
            fontFamily: Platform.select({
              ios: "Georgia",
              android: "serif",
              default: "serif",
            }),
            letterSpacing: 0.3,
          },
          headerStyle: {
            backgroundColor: "#1a1a2e",
            shadowColor: "transparent",
            elevation: 0,
          },
          drawerActiveTintColor: "#FFFFFF",
          drawerInactiveTintColor: "rgba(255, 255, 255, 0.7)",
          drawerLabelStyle,
          drawerStyle: {
            backgroundColor: "transparent",
            width: 310,
            borderTopRightRadius: 24,
            borderBottomRightRadius: 24,
            overflow: "hidden",
          },
          drawerActiveBackgroundColor: "rgba(255, 255, 255, 0.15)",
        }}
      >
        <Drawer.Screen
          name="profile"
          options={{
            title: "Мой профиль",
            drawerLabel: "Мой профиль",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="index"
          options={{
            title: "Главная",
            drawerLabel: "Главная",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home-variant-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="psychologist"
          options={{
            title: "Психолог",
            drawerLabel: "Психолог",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-heart-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="services/index"
          options={{
            title: "Услуги",
            drawerLabel: "Услуги",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="hand-heart-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="courses"
          options={{
            title: "Обучение",
            drawerLabel: "Обучение",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="school-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="reviews"
          options={{
            title: "Отзывы",
            drawerLabel: "Отзывы",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="star-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="education"
          options={{
            title: "Образование",
            drawerLabel: "Образование",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="certificate-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="articles/index"
          options={{
            title: "Статьи",
            drawerLabel: "Статьи",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="newspaper-variant-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="tracker/index"
          options={{
            title: "Я сегодня",
            drawerLabel: "Я сегодня",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="emoticon-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="antianxiety/index"
          options={{
            title: "Антитревога",
            drawerLabel: "Антитревога",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="heart-pulse" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="program/index"
          options={{
            title: "Практика 7 дней",
            drawerLabel: "Практика 7 дней",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar-check-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="contact"
          options={{
            title: "Контакты",
            drawerLabel: "Контакты",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="message-text-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="tracker/response"
          options={{
            title: "Отклик",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="antianxiety/breathing"
          options={{
            title: "Дыхание",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="antianxiety/grounding"
          options={{
            title: "Заземление",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="antianxiety/cbt"
          options={{
            title: "Разбор мысли",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="antianxiety/body"
          options={{
            title: "Тело",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="antianxiety/reflection"
          options={{
            title: "Осмысление",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="program/[day]"
          options={{
            title: "День практики",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="services/[id]"
          options={{
            title: "Услуга",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="articles/[id]"
          options={{
            title: "Статья",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="modal"
          options={{
            title: "Modal",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="auth"
          options={{
            title: "Авторизация",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="meditations/index"
          options={{
            title: "Медитации",
            drawerLabel: "Медитации",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="meditation" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="meditations/[id]"
          options={{
            title: "Медитация",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="analytics/index"
          options={{
            title: "Аналитика",
            drawerLabel: "Аналитика",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-line" color={color} size={size} />
            ),
          }}
        />
      </Drawer>
      <PanicButton />
      </View>
    </GestureHandlerRootView>
  );
}

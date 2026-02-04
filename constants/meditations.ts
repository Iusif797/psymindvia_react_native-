export type MeditationCategory = "sleep" | "relax" | "focus" | "morning";
export type SoundCategory = "nature" | "ambient";

export interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: MeditationCategory;
  icon: string;
  color: string;
  audioUrl: string;
}

export interface AmbientSound {
  id: string;
  title: string;
  icon: string;
  color: string;
  category: SoundCategory;
}

export const MEDITATION_CATEGORIES: Record<MeditationCategory, { label: string; icon: string; color: string }> = {
  sleep: { label: "Сон", icon: "moon-waning-crescent", color: "#6B7AA1" },
  relax: { label: "Релакс", icon: "spa", color: "#7DCEA0" },
  focus: { label: "Фокус", icon: "brain", color: "#C9A0FF" },
  morning: { label: "Утро", icon: "weather-sunny", color: "#F4C542" },
};

export const MEDITATIONS: Meditation[] = [
  {
    id: "sleep-1",
    title: "Глубокий сон",
    description: "Расслабляющая медитация для крепкого ночного сна",
    duration: 15,
    category: "sleep",
    icon: "moon-waning-crescent",
    color: "#6B7AA1",
    audioUrl: "sleep_deep",
  },
  {
    id: "sleep-2",
    title: "Ночное спокойствие",
    description: "Мягкая практика отпускания дневных забот",
    duration: 10,
    category: "sleep",
    icon: "weather-night",
    color: "#5B6B91",
    audioUrl: "sleep_calm",
  },
  {
    id: "relax-1",
    title: "Снятие напряжения",
    description: "Расслабление тела от макушки до кончиков пальцев",
    duration: 12,
    category: "relax",
    icon: "spa",
    color: "#7DCEA0",
    audioUrl: "relax_tension",
  },
  {
    id: "relax-2",
    title: "Внутренний покой",
    description: "Найди тишину внутри себя",
    duration: 8,
    category: "relax",
    icon: "leaf",
    color: "#5BB89A",
    audioUrl: "relax_peace",
  },
  {
    id: "focus-1",
    title: "Ясность ума",
    description: "Очисти разум для продуктивной работы",
    duration: 10,
    category: "focus",
    icon: "brain",
    color: "#C9A0FF",
    audioUrl: "focus_clarity",
  },
  {
    id: "focus-2",
    title: "Концентрация",
    description: "Усиль способность фокусироваться",
    duration: 7,
    category: "focus",
    icon: "target",
    color: "#B090EF",
    audioUrl: "focus_concentration",
  },
  {
    id: "morning-1",
    title: "Доброе утро",
    description: "Начни день с энергией и благодарностью",
    duration: 8,
    category: "morning",
    icon: "weather-sunny",
    color: "#F4C542",
    audioUrl: "morning_good",
  },
  {
    id: "morning-2",
    title: "Намерение дня",
    description: "Установи цель и настрой на успешный день",
    duration: 6,
    category: "morning",
    icon: "white-balance-sunny",
    color: "#E4B532",
    audioUrl: "morning_intention",
  },
];

export const AMBIENT_SOUNDS: AmbientSound[] = [
  {
    id: "rain",
    title: "Дождь",
    icon: "weather-rainy",
    color: "#6B8EAD",
    category: "nature",
  },
  {
    id: "forest",
    title: "Лес",
    icon: "pine-tree",
    color: "#5BB89A",
    category: "nature",
  },
  {
    id: "ocean",
    title: "Океан",
    icon: "waves",
    color: "#4A90A4",
    category: "nature",
  },
  {
    id: "fire",
    title: "Костёр",
    icon: "fire",
    color: "#E07A50",
    category: "nature",
  },
  {
    id: "thunder",
    title: "Гроза",
    icon: "weather-lightning",
    color: "#7B6B8E",
    category: "nature",
  },
  {
    id: "birds",
    title: "Птицы",
    icon: "bird",
    color: "#7DCEA0",
    category: "nature",
  },
  {
    id: "wind",
    title: "Ветер",
    icon: "weather-windy",
    color: "#8A9DB5",
    category: "ambient",
  },
  {
    id: "whitenoise",
    title: "Белый шум",
    icon: "blur",
    color: "#A8A8A8",
    category: "ambient",
  },
];

export const SLEEP_TIMER_OPTIONS = [
  { value: 0, label: "Без таймера" },
  { value: 5, label: "5 минут" },
  { value: 10, label: "10 минут" },
  { value: 15, label: "15 минут" },
  { value: 30, label: "30 минут" },
  { value: 45, label: "45 минут" },
  { value: 60, label: "1 час" },
];

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



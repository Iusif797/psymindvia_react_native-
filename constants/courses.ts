export type CourseMeta = {
  label: string;
  value: string;
};

export type CourseModule = {
  title: string;
  summary: string;
};

export type Course = {
  slug: string;
  productId: string;
  title: string;
  subtitle: string;
  description: string;
  meta: CourseMeta[];
  accent: string;
  applePriceUsd: string;
  modules: CourseModule[];
};

const PRODUCT_ID_PREFIX = "com.mindvia.teona.course";

const productId = (slug: string) => `${PRODUCT_ID_PREFIX}.${slug}`;

export const courses: Course[] = [
  {
    slug: "sistemnye-rasstanovki",
    productId: productId("sistemnye-rasstanovki"),
    title: "Курс по системным расстановкам",
    subtitle: "по Берту Хеллингеру",
    description:
      "Дистанционный семинар по системным расстановкам: увидеть скрытые динамики рода и вернуть системе баланс.",
    meta: [
      { label: "Формат", value: "дистанционное" },
      { label: "Старт", value: "1 октября 2025" },
      { label: "Длительность", value: "2,5 месяца" },
      { label: "Тип", value: "семинар" },
    ],
    accent: "#4A90A4",
    applePriceUsd: "599.99",
    modules: [
      { title: "Основы поля", summary: "Порядок любви, принадлежность и баланс «брать — давать»." },
      { title: "Диагностика системы", summary: "Как читать фигуры, роли и исключённых членов рода." },
      { title: "Индивидуальная расстановка", summary: "Работа с якорями, картами и заместителями." },
      { title: "Практика сессии", summary: "Протокол ведения клиента от запроса до интеграции." },
    ],
  },
  {
    slug: "masterstvo-rasstanovok",
    productId: productId("masterstvo-rasstanovok"),
    title: "Мастерство системных расстановок",
    subtitle: "Глубокий терапевтический подход для работы с семейными системами",
    description:
      "Углублённая программа для тех, кто уже знаком с методом и готов вести сложные семейные динамики.",
    meta: [
      { label: "Формат", value: "по программе" },
      { label: "Фокус", value: "семейные и системные динамики" },
    ],
    accent: "#7B6B8E",
    applePriceUsd: "499.99",
    modules: [
      { title: "Сложные переплетения", summary: "Идентификации, прерванное движение и парентификация." },
      { title: "Пары и дети", summary: "Расстановки в супружеских и детско-родительских запросах." },
      { title: "Этика ведущего", summary: "Границы вмешательства и безопасность поля." },
      { title: "Супервизия кейсов", summary: "Разбор реальных сессий и типичных ошибок." },
    ],
  },
  {
    slug: "nlp-praktik",
    productId: productId("nlp-praktik"),
    title: "НЛП Практик",
    subtitle: "Эффективные техники коммуникации и личностного роста",
    description:
      "Практический курс НЛП: раппорт, якорение, рефрейминг и модели изменения поведения.",
    meta: [
      { label: "Формат", value: "дистанционное и очное" },
      { label: "Старт", value: "1 октября 2025" },
      { label: "Длительность", value: "2 месяца" },
      { label: "Тип", value: "семинар" },
    ],
    accent: "#C08450",
    applePriceUsd: "299.99",
    modules: [
      { title: "База коммуникации", summary: "Калибровка, подстройка и ведение в диалоге." },
      { title: "Субмодальности", summary: "Как менять внутренние картинки и состояния." },
      { title: "Якоря и стратегии", summary: "Сборка ресурсных состояний и TOTE." },
      { title: "Рефрейминг", summary: "Смена смысла и работа с ограничитом убеждением." },
    ],
  },
  {
    slug: "regressiya",
    productId: productId("regressiya"),
    title: "Регрессия: Погружение в Память Души и Мультивселенную",
    subtitle: "Путешествие в прошлые жизни, родовые каналы и межвоплощенческое пространство",
    description:
      "Онлайн-интенсив по регрессивной терапии: безопасный вход в транс и работа с корнем сценария.",
    meta: [
      { label: "Формат", value: "онлайн" },
      { label: "Старт", value: "15 сентября 2025" },
      { label: "Длительность", value: "7 недель" },
      { label: "Тип", value: "интенсив" },
    ],
    accent: "#4A9D7A",
    applePriceUsd: "649.99",
    modules: [
      { title: "Подготовка клиента", summary: "Скрининг, контракт и критерии безопасности." },
      { title: "Индукция транса", summary: "Протоколы наведения и стабилизации состояния." },
      { title: "Прошлые жизни", summary: "Исследование сцен и завершение незакрытых гештальтов." },
      { title: "Межжизненное пространство", summary: "Родовые каналы и интеграция после сессии." },
    ],
  },
  {
    slug: "prakticheskaya-psihologiya",
    productId: productId("prakticheskaya-psihologiya"),
    title: "Практическая психология",
    subtitle: "Комплексный курс для освоения практических навыков психологической помощи",
    description:
      "Шестимесячная программа базовых навыков консультанта: от первого контакта до завершения работы.",
    meta: [
      { label: "Формат", value: "онлайн" },
      { label: "Старт", value: "20 ноября 2025" },
      { label: "Длительность", value: "6 месяцев" },
      { label: "Тип", value: "курс" },
    ],
    accent: "#6B8EAD",
    applePriceUsd: "499.99",
    modules: [
      { title: "Роль консультанта", summary: "Этика, рамка и профессиональная позиция." },
      { title: "Контакт и запрос", summary: "Как собрать запрос и заключить рабочий договор." },
      { title: "Инструменты сессии", summary: "Слушание, гипотезы и интервенции." },
      { title: "Практика кейсов", summary: "Разбор сессий и домашние супервизии." },
    ],
  },
  {
    slug: "etapy-psihologicheskogo-konsultirovaniya",
    productId: productId("etapy-psihologicheskogo-konsultirovaniya"),
    title: "Практическая психология. Этапы психологического консультирования",
    subtitle: "От теории и техник до работы с реальными кейсами",
    description:
      "Пошаговая карта консультации: знакомство, гипотезы, воздействие и корректное завершение.",
    meta: [
      { label: "Формат", value: "лекции + практика" },
      { label: "Старт", value: "Открыт набор" },
      { label: "Длительность", value: "6 месяцев" },
      { label: "Тип", value: "курс" },
    ],
    accent: "#D97A7A",
    applePriceUsd: "499.99",
    modules: [
      { title: "Стадия контакта", summary: "Раппорт, безопасность и первые минуты встречи." },
      { title: "Формулирование проблемы", summary: "Гипотезы, проверка и уточнение запроса." },
      { title: "Воздействие", summary: "Техники изменения и работа с сопротивлением." },
      { title: "Завершение", summary: "Итоги, домашние шаги и профилактика срывов." },
    ],
  },
  {
    slug: "kognitivno-povedencheskaya-terapiya",
    productId: productId("kognitivno-povedencheskaya-terapiya"),
    title: "Когнитивно-поведенческая терапия (КПТ)",
    subtitle: "Практический курс по когнитивно-поведенческой терапии",
    description:
      "Курс КПТ на 42 академических часа: мысль — эмоция — поведение и протоколы для тревоги.",
    meta: [
      { label: "Формат", value: "онлайн / офлайн" },
      { label: "Старт", value: "По мере набора группы" },
      { label: "Длительность", value: "42 ак. часа" },
      { label: "Тип", value: "курс" },
    ],
    accent: "#4A90A4",
    applePriceUsd: "599.99",
    modules: [
      { title: "Когнитивная модель", summary: "Автоматические мысли и когнитивные искажения." },
      { title: "Поведенческие эксперименты", summary: "Экспозиция, дневник и проверка убеждений." },
      { title: "Тревога и паника", summary: "Протоколы работы с паникой и избеганием." },
      { title: "Домашние задания", summary: "Как давать клиенту упражнения между сессиями." },
    ],
  },
  {
    slug: "psihosomatika-i-neiropsihologiya",
    productId: productId("psihosomatika-i-neiropsihologiya"),
    title: "Психосоматика и нейропсихология",
    subtitle: "Курс по работе с психосоматическими расстройствами и регуляции нервной системы",
    description:
      "16 занятий о связи тела и психики: регуляция нервной системы и бережная работа с симптомом.",
    meta: [
      { label: "Формат", value: "онлайн" },
      { label: "Старт", value: "По мере набора группы" },
      { label: "Длительность", value: "16 занятий" },
      { label: "Тип", value: "курс" },
    ],
    accent: "#7B6B8E",
    applePriceUsd: "499.99",
    modules: [
      { title: "Нервная система", summary: "Симпатика, парасимпатика и окно толерантности." },
      { title: "Тело как сигнал", summary: "Как читать симптом без обесценивания медицины." },
      { title: "Регуляция", summary: "Дыхание, заземление и работа с гипервозбуждением." },
      { title: "Протокол сессии", summary: "Карта работы с психосоматическим запросом." },
    ],
  },
];

export const courseProductIds = courses.map((course) => course.productId);

export const getCourseBySlug = (slug: string | undefined): Course | undefined =>
  courses.find((course) => course.slug === slug);

export const getCourseByProductId = (id: string): Course | undefined =>
  courses.find((course) => course.productId === id);

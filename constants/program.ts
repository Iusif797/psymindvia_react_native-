export type ProgramSection =
  | { type: "text"; paragraphs: string[] }
  | { type: "bullet"; items: string[] }
  | {
      type: "prompt";
      question: string;
      placeholder: string;
      key: string;
      multiline?: boolean;
    }
  | {
      type: "list";
      question: string;
      key: string;
      minItems?: number;
      itemPlaceholder?: string;
    }
  | { type: "markers"; title: string; items: string[] }
  | { type: "timer"; label: string; durationMinutes: number; key: string }
  | { type: "affirmation"; text: string; timesPerDay: number };

export type ProgramDay = {
  id: number;
  title: string;
  subtitle: string;
  rule: string;
  sections: ProgramSection[];
};

export const PROGRAM_DAYS: ProgramDay[] = [
  {
    id: 1,
    title: "День 1",
    subtitle: "Сильные стороны и дерево достижений",
    rule: "На каждое задание: 5 минут. УЗНАЛ! СДЕЛАЛ!",
    sections: [
      {
        type: "text",
        paragraphs: [
          "Определяем свои сильные стороны. У всех нас есть сильные стороны, но многие люди склонны преувеличивать свои недостатки и игнорировать достоинства. Нереалистично знать всё, преуспеть во всём и одержать победу в каждом состязании. Работая над определением своих достоинств, помните: это не то же самое, что достижения.",
        ],
      },
      {
        type: "prompt",
        question: "Какие из достоинств вы отметили у себя? Запишите хотя бы пять.",
        placeholder: "Например: терпение, честность, чувство юмора...",
        key: "strengths_five",
        multiline: true,
      },
      {
        type: "prompt",
        question: "Какие достоинства повлияли на ваш успех?",
        placeholder: "Опишите связь между качествами и результатами...",
        key: "strengths_success",
        multiline: true,
      },
      {
        type: "prompt",
        question: "Выполнение каких действий или обязательств вам по душе?",
        placeholder: "Что приносит вам удовлетворение?",
        key: "enjoyable_actions",
        multiline: true,
      },
      {
        type: "prompt",
        question: "Какие из ваших личностных качеств доставляют вам удовольствие?",
        placeholder: "Запишите...",
        key: "pleasure_qualities",
        multiline: true,
      },
      {
        type: "prompt",
        question: "Какие из ваших личностных качеств отражают ваши ценности?",
        placeholder: "Запишите...",
        key: "values_qualities",
        multiline: true,
      },
      {
        type: "prompt",
        question: "Какие достоинства ваши друзья и члены семьи видят в вас? Каким образом они ценят вас за то, что вы делаете, и за то, кем вы являетесь?",
        placeholder: "Запишите...",
        key: "others_see",
        multiline: true,
      },
      {
        type: "text",
        paragraphs: [
          "А теперь вспомним ваши достижения и нарисуем дерево достижений. На каждой веточке напишите то, чего вы достигли за всё время жизни (например: в школе занимали места на олимпиадах, участвовали в соревнованиях, знание языков).",
        ],
      },
      {
        type: "list",
        question: "Ветки дерева достижений (запишите каждое достижение)",
        key: "achievements_tree",
        minItems: 5,
        itemPlaceholder: "Например: олимпиада по математике, 2 место",
      },
    ],
  },
  {
    id: 2,
    title: "День 2",
    subtitle: "Начинаем с самого сложного",
    rule: "5 минут. УЗНАЛ! СДЕЛАЛ!",
    sections: [
      {
        type: "text",
        paragraphs: [
          "Суть техники: браться за самую сложную часть задания, когда вы на пике продуктивности — в начале дня или на начальной стадии проекта.",
        ],
      },
      {
        type: "prompt",
        question: "Посмотрите свой список дел и запишите задачи, распределяя от самых сложных или неприятных к более лёгким и доставляющим удовольствие.",
        placeholder: "1. Самое сложное\n2. ...\n3. ...",
        key: "tasks_ordered",
        multiline: true,
      },
    ],
  },
  {
    id: 3,
    title: "День 3",
    subtitle: "Установки и переписывание негатива",
    rule: "5 минут. УЗНАЛ! СДЕЛАЛ!",
    sections: [
      {
        type: "text",
        paragraphs: [
          "Работаем с установками и меняем мышление. Вспомните, какие установки вы получали от родителей или воспитателей.",
        ],
      },
      {
        type: "prompt",
        question: "Что они постоянно говорили или делали, формируя вашу идентичность и самооценку?",
        placeholder: "Запишите фразы или действия...",
        key: "parent_messages",
        multiline: true,
      },
      {
        type: "prompt",
        question: "Какие чувства вызывает у вас мысль о том, что родители оценивали вас неправильно?",
        placeholder: "Запишите чувства...",
        key: "feelings_wrong_eval",
        multiline: true,
      },
      {
        type: "prompt",
        question: "Осознаёте ли вы, что ярлыки, которые они навешивали на вас, не совсем верны?",
        placeholder: "Ваш ответ...",
        key: "labels_awareness",
        multiline: true,
      },
      {
        type: "markers",
        title: "Переписываем негативные установки. Остерегайтесь маркеров:",
        items: [
          "«это скучно»",
          "«это сложно»",
          "«я ненавижу это»",
          "«это не важно»",
          "«это отнимает слишком много времени»",
          "«я не знаю, как это делать»",
          "«у меня может не получиться»",
        ],
      },
      {
        type: "prompt",
        question: "Запишите одну старую негативную установку и перепишите её в нейтральную или поддерживающую.",
        placeholder: "Было: ... → Стало: ...",
        key: "rewrite_belief",
        multiline: true,
      },
    ],
  },
  {
    id: 4,
    title: "День 4",
    subtitle: "Проработка страха",
    rule: "5 минут. УЗНАЛ! СДЕЛАЛ!",
    sections: [
      {
        type: "text",
        paragraphs: [
          "Страх — эмоция, которая часто ограничивает ваши возможности. Настоящий рост происходит за пределами зоны комфорта. Страхи часто являются иллюзией, которую вы строите в уме.",
        ],
      },
      {
        type: "bullet",
        items: [
          "страх неудачи",
          "страх неприятия",
          "страх осуждения",
          "страх унижения",
          "страх быть непонятым",
          "страх не понравиться",
          "страх одиночества",
          "страх критики",
          "страх пробовать новое",
          "страх не справиться",
        ],
      },
      {
        type: "prompt",
        question: "Какой у вас главный страх или несколько страхов? Как они влияют на вас? Вам свойственно не подпускать людей или упускать возможности из-за страхов?",
        placeholder: "Опишите...",
        key: "fear_main",
        multiline: true,
      },
      {
        type: "prompt",
        question: "Страх:",
        placeholder: "Название страха",
        key: "fear_name",
      },
      {
        type: "prompt",
        question: "Ситуация (конкретный случай):",
        placeholder: "Когда вы чувствовали это",
        key: "fear_situation",
        multiline: true,
      },
      {
        type: "prompt",
        question: "Глубинное убеждение:",
        placeholder: "Какая мысль за этим стоит",
        key: "fear_belief",
        multiline: true,
      },
      {
        type: "prompt",
        question: "Поведение (что вы делали):",
        placeholder: "Как вы отреагировали",
        key: "fear_behavior",
        multiline: true,
      },
    ],
  },
  {
    id: 5,
    title: "День 5",
    subtitle: "Сомнение в искажениях и привычка благодарности",
    rule: "5 минут. УЗНАЛ! СДЕЛАЛ!",
    sections: [
      {
        type: "text",
        paragraphs: [
          "Поставьте искажение под сомнение. Вопросы: Откуда я знаю, что мысль верна? Какие свидетельства подкрепляют или опровергают её? Эта мысль конструктивна? Могу ли я взглянуть иначе? Не слишком ли я обобщаю? Есть ли исключения? Реалистичны ли мои ожидания?",
        ],
      },
      {
        type: "prompt",
        question: "Замените искажение реалистичным убеждением. Запишите старую мысль и новую, реалистичную.",
        placeholder: "Было: ... → Стало: ...",
        key: "realistic_belief",
        multiline: true,
      },
      {
        type: "timer",
        label: "Техника «вставка мыслей»: представляем страх, отрезаем мысленно, меняем на продуктивную установку.",
        durationMinutes: 5,
        key: "thought_insertion_timer",
      },
      {
        type: "text",
        paragraphs: [
          "Привычка радоваться жизни: если каждое утро вы начинаете с мысли о благодарности, радости и счастье, мозг программируется на этот сигнал.",
        ],
      },
      {
        type: "list",
        question: "Задание 1. Запишите минимум 10 пунктов благодарности.",
        key: "gratitude_list",
        minItems: 10,
        itemPlaceholder: "Благодарен(а) за...",
      },
      {
        type: "prompt",
        question: "Задание 2. Позитивные моменты дня, которые доставили удовольствие и радость.",
        placeholder: "Запишите...",
        key: "positive_moments",
        multiline: true,
      },
      {
        type: "affirmation",
        text: "Моя жизнь наполнена радостью и счастьем.",
        timesPerDay: 3,
      },
    ],
  },
  {
    id: 6,
    title: "День 6",
    subtitle: "Освобождение и отпускание",
    rule: "5 минут. УЗНАЛ! СДЕЛАЛ!",
    sections: [
      {
        type: "text",
        paragraphs: [
          "Я освобождаюсь и отпускаю всё, что стоит на пути к счастью и гармонии. Определите, что это, и освободите себя. Выберите одну негативную эмоцию, которая вам мешает, и замените её на другую.",
        ],
      },
      {
        type: "prompt",
        question: "Запишите проблемы, которые отпускаете (каждую с формулировкой «Я отпускаю … проблему»). После можно символически скомкать и выбросить лист.",
        placeholder: "Я отпускаю ... проблему.\nЯ отпускаю ... проблему.",
        key: "release_problems",
        multiline: true,
      },
      {
        type: "text",
        paragraphs: [
          "Скажите себе: «Я отпускаю проблему, которая меня так сильно волнует, и я доверяю своей жизни. Моя жизнь идёт так, как должна идти.»",
        ],
      },
    ],
  },
  {
    id: 7,
    title: "День 7",
    subtitle: "Признание себя",
    rule: "5 минут. УЗНАЛ! СДЕЛАЛ!",
    sections: [
      {
        type: "text",
        paragraphs: [
          "Напишите, какой вы хотите себя видеть. Начинайте каждую фразу с «Я признаю». Минимум 10 пунктов. Каждый день при пробуждении читайте эти пункты.",
        ],
      },
      {
        type: "list",
        question: "Я признаю... (минимум 10 пунктов)",
        key: "i_acknowledge",
        minItems: 10,
        itemPlaceholder: "Я признаю, что я ...",
      },
    ],
  },
];

export const PROGRAM_STORAGE_KEY = "program_day_";

export function getProgramStorageKey(dayId: number, fieldKey: string): string {
  return `${PROGRAM_STORAGE_KEY}${dayId}_${fieldKey}`;
}

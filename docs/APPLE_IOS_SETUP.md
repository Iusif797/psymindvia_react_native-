# Пошаговая настройка приложения для Apple (iOS)

## Часть 1. Регистрация в Apple Developer Program

### Шаг 1. Создать Apple ID (если ещё нет)

1. Открой в браузере: **https://appleid.apple.com**
2. Нажми **«Создать Apple ID»**.
3. Заполни:
   - Имя и фамилия
   - Email (будет логином)
   - Пароль (минимум 8 символов, буквы и цифры)
   - Дата рождения
   - Номер телефона
4. Подтверди email и телефон по коду из письма/SMS.
5. Включи двухфакторную аутентификацию, если попросит.

---

### Шаг 2. Войти в Apple Developer

1. Перейди на: **https://developer.apple.com**
2. В правом верхнем углу нажми **«Account»** (или «Учётная запись»).
3. Войди под своим **Apple ID** (email + пароль).
4. При первом входе может попросить принять соглашения — прими.

---

### Шаг 3. Оформить подписку Apple Developer Program

1. На странице **https://developer.apple.com** нажми **«Join the Apple Developer Program»**  
   Или прямая ссылка: **https://developer.apple.com/programs/enroll/**

2. Нажми **«Start Your Enrollment»** (Начать регистрацию).

3. Выбери тип учётки:
   - **Individual** — физлицо (достаточно паспорта).
   - **Organization** — компания (нужны документы и D-U-N-S номер).

4. Подтверди, что ты согласен с лицензией, и нажми **«Continue»**.

5. Заполни профиль:
   - Имя, фамилия (латиницей, как в паспорте).
   - Адрес (можно на английском).
   - Телефон.

6. Перейди к оплате:
   - Нажми **«Purchase»** — откроется оплата **$99 USD** в год.
   - Оплата картой (Visa, Mastercard и т.д.).
   - После оплаты статус станет «Pending» (ожидание проверки).

7. Подтверждение:
   - Обычно 24–48 часов (иногда до нескольких дней).
   - На email придёт письмо, что аккаунт активирован.
   - После этого заходи снова на **https://developer.apple.com** — должен быть активный статус программы.

---

## Часть 2. Настройка проекта для iOS

### Шаг 4. Указать Bundle ID в проекте

В проекте уже должен быть указан идентификатор. Проверь файл **`app.json`**:

- Для iOS добавляется поле **`ios.bundleIdentifier`**.
- Пример: `com.mindvia.psymindvia` (должен быть уникальным в мире).

Если его нет — добавь в блок `expo.ios`:

```json
"ios": {
  "bundleIdentifier": "com.mindvia.psymindvia",
  "supportsTablet": true
}
```

Формат: `com.твоякомпания.названиеприложения` (латиница, без пробелов).

---

### Шаг 5. Установить EAS CLI и войти в Expo

В терминале (в папке проекта):

```bash
npm install -g eas-cli
eas login
```

Введи логин и пароль от аккаунта **Expo** (expo.dev). Если аккаунта нет — зарегистрируйся на **https://expo.dev/signup**.

---

### Шаг 6. Привязать проект к Apple Developer

1. Выполни в папке проекта:

```bash
eas credentials
```

2. Выбери платформу **iOS**.
3. EAS предложит войти в Apple Developer через браузер — войди под тем же Apple ID, с которым оплатил программу.
4. Дальше EAS может предложить создать сертификаты и профили — соглашайся (создаст автоматически).

Либо при первой сборке EAS сам запросит доступ к Apple и создаст нужные сертификаты.

---

## Часть 3. Сборка приложения для iOS

### Шаг 7. Собрать IPA (установочный файл для iOS)

В папке проекта выполни:

```bash
eas build -p ios --profile production
```

Или, если в **eas.json** есть профиль **preview** для iOS:

```bash
eas build -p ios --profile preview
```

- Первый раз EAS спросит, привязать ли проект к аккаунту Expo — выбери **Yes**.
- Может спросить Apple ID — введи тот, с которым зарегистрирован Developer Program.
- Сборка идёт на серверах Expo (10–20 минут).

По окончании в терминале и в кабинете **https://expo.dev** появится ссылка на скачивание **IPA**.

---

## Часть 4. Установка на iPhone

### Вариант A. Через TestFlight (удобно для теста)

1. Зайди на **https://appstoreconnect.apple.com** (логин — тот же Apple ID).
2. Раздел **«My Apps»** → **«+»** → **«New App»**.
3. Заполни название приложения, выбери Team, укажи Bundle ID (тот же, что в `app.json`).
4. После создания приложения открой его → вкладка **«TestFlight»**.
5. Загрузи IPA через EAS:

```bash
eas submit --platform ios --latest
```

Либо вручную: в **App Store Connect** → TestFlight → загрузить IPA.

6. На iPhone установи приложение **TestFlight** из App Store.
7. Пригласи себя (или тестировщиков) по email во вкладке TestFlight — прийдёт приглашение, по нему можно установить сборку на устройство.

---

### Вариант B. Ad Hoc (без App Store)

1. Зарегистрируй устройство в Apple Developer:
   - **https://developer.apple.com/account/resources/devices/list**
   - **«+»** → введи имя устройства и **UDID** iPhone.
   - UDID можно узнать: iPhone → Настройки → Основные → Об этом устройстве (нужно подключить к Mac или использовать сайты вроде get.udid.io).

2. В **eas.json** в профиле сборки для iOS можно указать тип распространения **internal** или **simulator** (для Ad Hoc обычно используется отдельный профиль с типом **ad-hoc** в EAS).

3. Собери с профилем, который создаёт Ad Hoc IPA:

```bash
eas build -p ios --profile preview
```

4. Установка на iPhone:
   - Скачай IPA на Mac.
   - Установи через **Apple Configurator 2** или **AltStore** / **Sideloadly** (они подписывают приложение под твой Apple ID для личной установки).

---

## Полезные ссылки (кратко)

| Что | Ссылка |
|-----|--------|
| Создать Apple ID | https://appleid.apple.com |
| Apple Developer (вход, программа) | https://developer.apple.com |
| Регистрация в Developer Program | https://developer.apple.com/programs/enroll/ |
| App Store Connect (приложения, TestFlight) | https://appstoreconnect.apple.com |
| Устройства (UDID) | https://developer.apple.com/account/resources/devices/list |
| Expo (аккаунт, сборки) | https://expo.dev |
| Документация EAS Build | https://docs.expo.dev/build/introduction/ |

---

## Чек-лист перед первой iOS-сборкой

- [ ] Apple ID создан
- [ ] Оплачена подписка Apple Developer Program ($99/год)
- [ ] В `app.json` указан `ios.bundleIdentifier`
- [ ] Установлен `eas-cli` и выполнен `eas login`
- [ ] В папке проекта выполнен `eas build -p ios --profile production` (или `preview`)

После первой успешной сборки ссылку на IPA можно использовать для установки через TestFlight или Ad Hoc по шагам выше.

# App Store In-App Purchase — Psymindvia

Guideline 3.1.1: курсы — цифровой контент. Покупка только через StoreKit. После оплаты модули открываются внутри приложения.

Библиотека: `expo-iap` (не `expo-in-app-purchases`, пакет снят; не RevenueCat — отдельный кабинет не нужен).

## Продукты (Non-Consumable)

Bundle ID: `com.mindvia.psymindvia`

| Product ID | Reference name | USD |
|---|---|---|
| `com.mindvia.teona.course.sistemnye-rasstanovki` | Systemic Constellations | 599.99 |
| `com.mindvia.teona.course.masterstvo-rasstanovok` | Mastery of Constellations | 499.99 |
| `com.mindvia.teona.course.nlp-praktik` | NLP Practitioner | 299.99 |
| `com.mindvia.teona.course.regressiya` | Regression Intensive | 649.99 |
| `com.mindvia.teona.course.prakticheskaya-psihologiya` | Practical Psychology | 499.99 |
| `com.mindvia.teona.course.etapy-psihologicheskogo-konsultirovaniya` | Counseling Stages | 499.99 |
| `com.mindvia.teona.course.kognitivno-povedencheskaya-terapiya` | CBT Course | 599.99 |
| `com.mindvia.teona.course.psihosomatika-i-neiropsihologiya` | Psychosomatics | 499.99 |

Цена «Этапы психологического консультирования»: **499.99 USD**. В каталоге раньше было «уточняется»; без фиксированной цены продукт в App Store Connect завести нельзя. Взята цена соседнего 6-месячного курса «Практическая психология».

## App Store Connect

1. Agreements, Tax, and Banking → Paid Applications Agreement — статус Active.
2. Features → In-App Purchases → создать 8 продуктов типа Non-Consumable.
3. Product ID копировать один в один из таблицы.
4. Review screenshot: экран курса с кнопкой «Купить».
5. Привязать все 8 IAP к новой версии приложения.
6. Собрать **новый native build** (`eas build -p ios`). JS-only OTA недостаточно: добавлен `expo-iap`.

## Review notes

Courses are digital educational content. Users purchase each course with In-App Purchase. After purchase, course modules unlock inside the app. Restore Purchases is on the Courses screen. Consultations remain a real-world service booked via Contacts (Guideline 3.1.3(e)). There is no external checkout for courses.

## Локальная проверка

Файл: `storekit/Courses.storekit`. В Xcode: Product → Scheme → Edit Scheme → Run → StoreKit Configuration → этот файл.

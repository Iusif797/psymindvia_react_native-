import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, STORAGE_KEYS } from "./auth";

/**
 * Demo account for App Store / Google Play review.
 *
 * WHY THIS EXISTS
 * ---------------
 * Accounts in this app live only in local AsyncStorage — there is no account
 * server. A freshly installed build therefore has an EMPTY user store, so the
 * credentials we hand to the App Review team cannot possibly work until
 * somebody registers them on that specific device.
 *
 * The 2026-08-14 rejection (guideline 2.1(a)) was exactly this: the reviewer
 * opened the auth screen, which defaults to the "Вход" (Login) tab, typed the
 * documented credentials, and got "Пользователь не найден".
 *
 * Seeding the documented account on first launch makes those credentials work
 * in the tab the reviewer actually lands on. It is deliberately the smallest
 * possible behavioural change:
 *   - the default tab stays "Вход", which is the correct default for returning
 *     users (flipping the default to "Регистрация" would break them, and would
 *     still not guarantee the reviewer gets in — they would just hit the same
 *     dead end from the other tab);
 *   - the seeded account is NOT signed in automatically, so a real user sees an
 *     unchanged app;
 *   - it runs at most once per install, so a user who deletes it keeps it
 *     deleted.
 *
 * These credentials are intentionally public: they are published to Apple and
 * Google in the review-notes fields. They unlock nothing but an empty local
 * profile on the reviewer's own device.
 */
export const DEMO_EMAIL = "apple.review@it-enterprise.pro";
export const DEMO_PASSWORD = "AppleReview2026";

const SEEDED_FLAG = "demo_account_seeded_v1";

export type SeedResult =
  | "created"
  | "already-seeded"
  | "already-exists"
  | "failed";

/**
 * Idempotently create the review demo account in the local user store.
 * Never signs the user in and never disturbs an existing session.
 * Never throws — a failure here must not stop the app from starting.
 */
export async function ensureDemoAccount(): Promise<SeedResult> {
  try {
    if (await AsyncStorage.getItem(SEEDED_FLAG)) {
      return "already-seeded";
    }

    const users = await auth.getUsers();
    if (users.some((u) => u.email === DEMO_EMAIL)) {
      await AsyncStorage.setItem(SEEDED_FLAG, new Date().toISOString());
      return "already-exists";
    }

    // auth.register() signs the new account in as a side effect. Capture the
    // real session first so we can put it back afterwards.
    const sessionBefore = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);

    const result = await auth.register(DEMO_EMAIL, DEMO_PASSWORD);
    if (!result.success) {
      return "failed";
    }

    if (sessionBefore === null) {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, sessionBefore);
    }

    await AsyncStorage.setItem(SEEDED_FLAG, new Date().toISOString());
    return "created";
  } catch {
    return "failed";
  }
}

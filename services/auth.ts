import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./config";

// ─── Public types ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  createdAt: string;
  avatarUri?: string;
}

/** Kept for demoAccount.ts compatibility – always returns []. */
interface StoredUser extends User {
  passwordHash?: string;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

/** Exported so demoAccount.ts can read/write CURRENT_USER directly. */
export const STORAGE_KEYS = {
  TOKEN: "auth_token",
  CURRENT_USER: "auth_current_user",
  AVATAR: "user_avatar",
  /** Legacy key – kept so old installs that wrote USERS don't crash. */
  USERS: "auth_users",
};

// ─── Validation ───────────────────────────────────────────────────────────────

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Введите email";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Некорректный формат email";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Введите пароль";
  if (password.length < 6) return "Пароль должен быть не менее 6 символов";
  return null;
};

export const validatePasswordConfirm = (password: string, confirm: string): string | null => {
  if (!confirm) return "Подтвердите пароль";
  if (password !== confirm) return "Пароли не совпадают";
  return null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

type ApiRegisterResponse = {
  ok: boolean;
  error?: string;
  token?: string;
  user?: { id: number; email: string; created_at: string };
};

async function saveSession(token: string, user: User): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

function mapApiUser(raw: { id: number; email: string; created_at: string }): User {
  return { id: String(raw.id), email: raw.email, createdAt: raw.created_at };
}

// ─── Auth service ─────────────────────────────────────────────────────────────

export const auth = {
  /**
   * Always returns []. Accounts live on the backend.
   * Kept so demoAccount.ts (which checks for an existing email) compiles
   * without modification; the check falls through to a register attempt.
   */
  async getUsers(): Promise<StoredUser[]> {
    return [];
  },

  async register(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    const emailError = validateEmail(email);
    if (emailError) return { success: false, error: emailError };
    const passwordError = validatePassword(password);
    if (passwordError) return { success: false, error: passwordError };

    try {
      const res = await fetch(`${API_BASE_URL}/account/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = (await res.json()) as ApiRegisterResponse;
      if (!data.ok) {
        if (data.error === "account_exists")
          return { success: false, error: "Пользователь с таким email уже существует" };
        return { success: false, error: "Ошибка при регистрации" };
      }
      const user = mapApiUser(data.user!);
      await saveSession(data.token!, user);
      return { success: true, user };
    } catch {
      return { success: false, error: "Нет соединения с интернетом" };
    }
  },

  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    const emailError = validateEmail(email);
    if (emailError) return { success: false, error: emailError };
    if (!password) return { success: false, error: "Введите пароль" };

    try {
      const res = await fetch(`${API_BASE_URL}/account/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = (await res.json()) as ApiRegisterResponse;
      if (!data.ok) return { success: false, error: "Неверный email или пароль" };
      const user = mapApiUser(data.user!);
      await saveSession(data.token!, user);
      return { success: true, user };
    } catch {
      return { success: false, error: "Нет соединения с интернетом" };
    }
  },

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.CURRENT_USER]);
  },

  /**
   * Deletes the account on the backend then wipes all local data.
   * Required by App Store Review Guideline 5.1.1(v).
   */
  async deleteAccount(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        await fetch(`${API_BASE_URL}/account`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Always wipe locally even when the network call fails.
    }
    const current = await this.getCurrentUser();
    const extraKeys = current ? [`${STORAGE_KEYS.AVATAR}_${current.id}`] : [];
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.CURRENT_USER,
      ...extraKeys,
    ]);
  },

  async getCurrentUser(): Promise<User | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? (JSON.parse(data) as User) : null;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    return token !== null;
  },

  async saveAvatar(uri: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) return;
    user.avatarUri = uri;
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    await AsyncStorage.setItem(`${STORAGE_KEYS.AVATAR}_${user.id}`, uri);
  },

  async getAvatar(): Promise<string | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;
    if (user.avatarUri) return user.avatarUri;
    return AsyncStorage.getItem(`${STORAGE_KEYS.AVATAR}_${user.id}`);
  },
};

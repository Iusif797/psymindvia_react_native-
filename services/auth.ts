import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  email: string;
  createdAt: string;
  avatarUri?: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

const STORAGE_KEYS = {
  USERS: "auth_users",
  CURRENT_USER: "auth_current_user",
  AVATAR: "user_avatar",
};

const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36) + str.length.toString(36);
};

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Введите email";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Некорректный формат email";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Введите пароль";
  }
  if (password.length < 6) {
    return "Пароль должен быть не менее 6 символов";
  }
  return null;
};

export const validatePasswordConfirm = (password: string, confirm: string): string | null => {
  if (!confirm) {
    return "Подтвердите пароль";
  }
  if (password !== confirm) {
    return "Пароли не совпадают";
  }
  return null;
};

export const auth = {
  async getUsers(): Promise<StoredUser[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  async register(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    const emailError = validateEmail(email);
    if (emailError) return { success: false, error: emailError };

    const passwordError = validatePassword(password);
    if (passwordError) return { success: false, error: passwordError };

    const users = await this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.find((u) => u.email === normalizedEmail)) {
      return { success: false, error: "Пользователь с таким email уже существует" };
    }

    const newUser: StoredUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      email: normalizedEmail,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword };
  },

  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    const emailError = validateEmail(email);
    if (emailError) return { success: false, error: emailError };

    if (!password) return { success: false, error: "Введите пароль" };

    const users = await this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email === normalizedEmail);

    if (!user) {
      return { success: false, error: "Пользователь не найден" };
    }

    if (user.passwordHash !== simpleHash(password)) {
      return { success: false, error: "Неверный пароль" };
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword };
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  async getCurrentUser(): Promise<User | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  },

  async saveAvatar(uri: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) return;

    user.avatarUri = uri;
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    await AsyncStorage.setItem(STORAGE_KEYS.AVATAR + "_" + user.id, uri);
  },

  async getAvatar(): Promise<string | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    if (user.avatarUri) return user.avatarUri;

    const stored = await AsyncStorage.getItem(STORAGE_KEYS.AVATAR + "_" + user.id);
    return stored;
  },
};

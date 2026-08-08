import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "meditation_sessions";

export interface MeditationSession {
  id: string;
  meditationId: string;
  completedAt: string;
  duration: number;
}

/**
 * Zaznam odmeditovanych minut. Prehravani zvuku tady NENI a nikdy nefungovalo:
 * puvodni playSound()/pauseSound()/setVolume() jen prepinaly priznaky, v projektu
 * neni expo-av ani expo-audio a neexistuje jediny zvukovy soubor. Dlazdice, ktere
 * to volaly, byly 8. 8. 2026 odstraneny (realizace #235).
 * ⛔ Nepridavat sem prazdne prehravaci metody. Bud pribude skutecny prehravac
 *    a zvukove soubory, nebo tu prehravani nema co delat.
 */
class AudioService {
  async saveMeditationSession(meditationId: string, duration: number) {
    const sessions = await this.getMeditationSessions();
    const session: MeditationSession = {
      id: `meditation_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      meditationId,
      completedAt: new Date().toISOString(),
      duration,
    };
    sessions.unshift(session);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  async getMeditationSessions(): Promise<MeditationSession[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async getTotalMeditationMinutes(): Promise<number> {
    const sessions = await this.getMeditationSessions();
    return sessions.reduce((total, session) => total + session.duration, 0);
  }
}

export const audioService = new AudioService();

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "meditation_sessions";

export interface MeditationSession {
  id: string;
  meditationId: string;
  completedAt: string;
  duration: number;
}

class AudioService {
  private sleepTimer: NodeJS.Timeout | null = null;
  private isPlaying = false;
  private currentSoundId: string | null = null;
  private volume = 0.7;

  async init() {}

  async playSound(soundId: string) {
    await this.stopSound();
    this.currentSoundId = soundId;
    this.isPlaying = true;
  }

  async pauseSound() {
    this.isPlaying = false;
  }

  async resumeSound() {
    if (this.currentSoundId) {
      this.isPlaying = true;
    }
  }

  async stopSound() {
    this.isPlaying = false;
    this.currentSoundId = null;
    this.clearSleepTimer();
  }

  async setVolume(vol: number) {
    this.volume = vol;
  }

  getVolume() {
    return this.volume;
  }

  setSleepTimer(minutes: number, onComplete: () => void) {
    this.clearSleepTimer();
    if (minutes > 0) {
      this.sleepTimer = setTimeout(async () => {
        await this.stopSound();
        onComplete();
      }, minutes * 60 * 1000);
    }
  }

  clearSleepTimer() {
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  getCurrentSoundId() {
    return this.currentSoundId;
  }

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

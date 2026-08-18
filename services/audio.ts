import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioSource,
} from "expo-audio";

const STORAGE_KEY = "meditation_sessions";

const AMBIENT_SOUND_SOURCES: Record<string, AudioSource> = {
  rain: require("../assets/audio/rain.m4a"),
  forest: require("../assets/audio/forest.m4a"),
  ocean: require("../assets/audio/ocean.m4a"),
  fire: require("../assets/audio/fire.m4a"),
  thunder: require("../assets/audio/thunder.m4a"),
  birds: require("../assets/audio/birds.m4a"),
  wind: require("../assets/audio/wind.m4a"),
  whitenoise: require("../assets/audio/whitenoise.m4a"),
};

export interface MeditationSession {
  id: string;
  meditationId: string;
  completedAt: string;
  duration: number;
}

class AudioService {
  private player: AudioPlayer | null = null;
  private sleepTimer: ReturnType<typeof setTimeout> | null = null;
  private sleepTimerMinutes = 0;
  private isPlaying = false;
  private currentSoundId: string | null = null;
  private volume = 0.7;
  private playRequestId = 0;
  private audioModeReady: Promise<void> | null = null;

  async init() {
    await this.ensureAudioMode();
  }

  async playSound(soundId: string): Promise<boolean> {
    const requestId = ++this.playRequestId;
    this.releasePlayer();
    const source = AMBIENT_SOUND_SOURCES[soundId];
    if (source === undefined) {
      return false;
    }
    await this.ensureAudioMode();
    if (requestId !== this.playRequestId) {
      return false;
    }
    try {
      const player = createAudioPlayer(source);
      player.loop = true;
      player.volume = this.volume;
      player.play();
      this.player = player;
      this.currentSoundId = soundId;
      this.isPlaying = true;
      return true;
    } catch (error) {
      console.warn("Ambient sound playback failed", error);
      this.releasePlayer();
      return false;
    }
  }

  async pauseSound() {
    this.player?.pause();
    this.isPlaying = false;
  }

  async resumeSound() {
    if (!this.player || !this.currentSoundId) {
      return;
    }
    this.player.play();
    this.isPlaying = true;
  }

  async stopSound() {
    this.releasePlayer();
    this.clearSleepTimer();
  }

  async setVolume(vol: number) {
    this.volume = Math.min(1, Math.max(0, vol));
    if (this.player) {
      this.player.volume = this.volume;
    }
  }

  getVolume() {
    return this.volume;
  }

  setSleepTimer(minutes: number, onComplete: () => void) {
    this.clearSleepTimer();
    if (minutes <= 0) {
      return;
    }
    this.sleepTimerMinutes = minutes;
    this.sleepTimer = setTimeout(async () => {
      await this.stopSound();
      onComplete();
    }, minutes * 60 * 1000);
  }

  clearSleepTimer() {
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }
    this.sleepTimerMinutes = 0;
  }

  getSleepTimerMinutes() {
    return this.sleepTimerMinutes;
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

  private releasePlayer() {
    if (this.player) {
      try {
        this.player.pause();
        this.player.remove();
      } catch (error) {
        console.warn("Ambient sound release failed", error);
      }
      this.player = null;
    }
    this.isPlaying = false;
    this.currentSoundId = null;
  }

  private ensureAudioMode(): Promise<void> {
    if (!this.audioModeReady) {
      this.audioModeReady = setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: "doNotMix",
      }).catch((error: unknown) => {
        this.audioModeReady = null;
        console.warn("Audio mode configuration failed", error);
      });
    }
    return this.audioModeReady;
  }
}

export const audioService = new AudioService();

import AsyncStorage from "@react-native-async-storage/async-storage";

export type ExerciseType = "breathing" | "grounding" | "cbt" | "body";

export interface AntianxietySession {
  id: string;
  exerciseType: ExerciseType;
  completedAt: string;
  cbtAnswers?: Record<string, string>;
}

export interface TrackerEntry {
  id: string;
  date: string;
  emotions: string[];
  anxietyLevel: number;
  bodySensations: string[];
  thought: string;
}

export interface ProgramDayProgress {
  dayId: number;
  responses: Record<string, string | string[]>;
  completedAt?: string;
  lastAccessedAt: string;
}

export interface ProfileData {
  antianxietySessions: AntianxietySession[];
  trackerEntries: TrackerEntry[];
  programProgress: ProgramDayProgress[];
}

const STORAGE_KEYS = {
  ANTIANXIETY_SESSIONS: "antianxiety_sessions",
  TRACKER_ENTRIES: "tracker_entries",
  PROGRAM_PROGRESS: "program_progress",
};

export const database = {
  async saveAntianxietySession(session: Omit<AntianxietySession, "id">): Promise<void> {
    const sessions = await this.getAntianxietySessions();
    const newSession: AntianxietySession = {
      ...session,
      id: `antianxiety_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    };
    sessions.unshift(newSession);
    await AsyncStorage.setItem(STORAGE_KEYS.ANTIANXIETY_SESSIONS, JSON.stringify(sessions));
  },

  async getAntianxietySessions(): Promise<AntianxietySession[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ANTIANXIETY_SESSIONS);
    return data ? JSON.parse(data) : [];
  },

  async getTrackerEntries(): Promise<TrackerEntry[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TRACKER_ENTRIES);
    return data ? JSON.parse(data) : [];
  },

  async saveProgramDayProgress(dayId: number, responses: Record<string, string | string[]>): Promise<void> {
    const progress = await this.getProgramProgress();
    const existingIndex = progress.findIndex((p) => p.dayId === dayId);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      progress[existingIndex] = {
        ...progress[existingIndex],
        responses: { ...progress[existingIndex].responses, ...responses },
        lastAccessedAt: now,
      };
    } else {
      progress.push({
        dayId,
        responses,
        lastAccessedAt: now,
      });
    }

    await AsyncStorage.setItem(STORAGE_KEYS.PROGRAM_PROGRESS, JSON.stringify(progress));
  },

  async markProgramDayComplete(dayId: number): Promise<void> {
    const progress = await this.getProgramProgress();
    const existingIndex = progress.findIndex((p) => p.dayId === dayId);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      progress[existingIndex].completedAt = now;
    } else {
      progress.push({
        dayId,
        responses: {},
        completedAt: now,
        lastAccessedAt: now,
      });
    }

    await AsyncStorage.setItem(STORAGE_KEYS.PROGRAM_PROGRESS, JSON.stringify(progress));
  },

  async getProgramProgress(): Promise<ProgramDayProgress[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROGRAM_PROGRESS);
    if (data) return JSON.parse(data);

    const progress: ProgramDayProgress[] = [];
    const allKeys = await AsyncStorage.getAllKeys();
    const programKeys = allKeys.filter((k) => k.startsWith("program_day_"));

    const dayMap = new Map<number, Record<string, string | string[]>>();

    for (const key of programKeys) {
      const match = key.match(/^program_day_(\d+)_(.+)$/);
      if (match) {
        const dayId = parseInt(match[1], 10);
        const fieldKey = match[2];
        const value = await AsyncStorage.getItem(key);
        if (value) {
          if (!dayMap.has(dayId)) dayMap.set(dayId, {});
          try {
            const parsed = JSON.parse(value);
            dayMap.get(dayId)![fieldKey] = Array.isArray(parsed) ? parsed : value;
          } catch {
            dayMap.get(dayId)![fieldKey] = value;
          }
        }
      }
    }

    dayMap.forEach((responses, dayId) => {
      progress.push({
        dayId,
        responses,
        lastAccessedAt: new Date().toISOString(),
      });
    });

    return progress.sort((a, b) => a.dayId - b.dayId);
  },

  async getProfileData(): Promise<ProfileData> {
    const [antianxietySessions, trackerEntries, programProgress] = await Promise.all([
      this.getAntianxietySessions(),
      this.getTrackerEntries(),
      this.getProgramProgress(),
    ]);

    return {
      antianxietySessions,
      trackerEntries,
      programProgress,
    };
  },

  async getProfileStats() {
    const data = await this.getProfileData();

    const exerciseCounts: Record<ExerciseType, number> = {
      breathing: 0,
      grounding: 0,
      cbt: 0,
      body: 0,
    };

    data.antianxietySessions.forEach((session) => {
      exerciseCounts[session.exerciseType]++;
    });

    const completedDays = data.programProgress.filter((p) => p.completedAt).length;

    const avgAnxiety =
      data.trackerEntries.length > 0
        ? data.trackerEntries.reduce((sum, e) => sum + e.anxietyLevel, 0) / data.trackerEntries.length
        : 0;

    const emotionCounts: Record<string, number> = {};
    data.trackerEntries.forEach((entry) => {
      entry.emotions.forEach((emotion) => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    const lastTrackerEntry = data.trackerEntries[0] || null;
    const lastAntianxietySession = data.antianxietySessions[0] || null;

    return {
      totalAntianxietySessions: data.antianxietySessions.length,
      exerciseCounts,
      totalTrackerEntries: data.trackerEntries.length,
      avgAnxietyLevel: Math.round(avgAnxiety * 10) / 10,
      emotionCounts,
      programCompletedDays: completedDays,
      programTotalDays: 7,
      lastTrackerEntry,
      lastAntianxietySession,
    };
  },
};

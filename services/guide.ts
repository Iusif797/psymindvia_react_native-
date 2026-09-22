import AsyncStorage from "@react-native-async-storage/async-storage";

const GUIDE_SEEN_KEY = "guide_seen_v1";

/** True the first time the app is opened on this device, false afterwards. */
export async function shouldShowGuide(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(GUIDE_SEEN_KEY)) === null;
  } catch {
    return false;
  }
}

export async function markGuideSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(GUIDE_SEEN_KEY, new Date().toISOString());
  } catch {
    // A device that cannot persist this will simply be offered the guide
    // again — harmless, and better than failing to open the app.
  }
}

/** Test/QA helper: lets the guide be shown again. */
export async function resetGuide(): Promise<void> {
  await AsyncStorage.removeItem(GUIDE_SEEN_KEY);
}

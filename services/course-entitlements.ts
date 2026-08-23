import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "purchased_course_products";

const parseProductIds = (raw: string | null): string[] => {
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed)
    ? parsed.filter((id): id is string => typeof id === "string")
    : [];
};

export const readCourseEntitlements = async (): Promise<string[]> => {
  return parseProductIds(await AsyncStorage.getItem(STORAGE_KEY));
};

export const mergeCourseEntitlements = async (productIds: string[]): Promise<string[]> => {
  const current = await readCourseEntitlements();
  const next = Array.from(new Set([...current, ...productIds]));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

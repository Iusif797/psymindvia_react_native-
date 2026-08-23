import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import { ErrorCode, useIAP, type Purchase } from "expo-iap";
import { courseProductIds } from "../constants/courses";
import {
  mergeCourseEntitlements,
  readCourseEntitlements,
} from "../services/course-entitlements";

const STORE_READY = Platform.OS === "ios" || Platform.OS === "android";

type CoursePurchases = {
  connected: boolean;
  priceByProductId: Record<string, string>;
  purchasedProductIds: string[];
  isPurchasing: boolean;
  buyCourse: (productId: string) => Promise<void>;
  restorePurchases: () => Promise<void>;
};

export function useCoursePurchases(): CoursePurchases {
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const finishRef = useRef<((args: { purchase: Purchase; isConsumable?: boolean }) => Promise<void>) | null>(null);

  const grantPurchase = useCallback(async (productId: string) => {
    const next = await mergeCourseEntitlements([productId]);
    setPurchasedProductIds(next);
  }, []);

  const handlePurchaseSuccess = useCallback(
    (purchase: Purchase) => {
      void (async () => {
        try {
          await finishRef.current?.({ purchase, isConsumable: false });
          await grantPurchase(purchase.productId);
          Alert.alert("Покупка завершена", "Курс открыт в приложении. Материалы доступны сразу.");
        } finally {
          setIsPurchasing(false);
        }
      })();
    },
    [grantPurchase],
  );

  const handlePurchaseError = useCallback((error: { code?: string; message: string }) => {
    setIsPurchasing(false);
    if (error.code === ErrorCode.UserCancelled) return;
    if (error.code === ErrorCode.AlreadyOwned) {
      Alert.alert("Курс уже куплен", "Нажмите «Восстановить покупки», чтобы открыть доступ.");
      return;
    }
    Alert.alert("Покупка не завершена", error.message);
  }, []);

  const {
    connected,
    products,
    availablePurchases,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    restorePurchases: restoreStorePurchases,
    getAvailablePurchases,
  } = useIAP({
    onPurchaseSuccess: handlePurchaseSuccess,
    onPurchaseError: handlePurchaseError,
  });

  finishRef.current = finishTransaction;

  useEffect(() => {
    void readCourseEntitlements().then(setPurchasedProductIds);
  }, []);

  useEffect(() => {
    if (!STORE_READY || !connected) return;
    void fetchProducts({ skus: courseProductIds, type: "in-app" });
    void getAvailablePurchases();
  }, [connected, fetchProducts, getAvailablePurchases]);

  useEffect(() => {
    const owned = availablePurchases.map((purchase) => purchase.productId);
    if (owned.length === 0) return;
    void mergeCourseEntitlements(owned).then(setPurchasedProductIds);
  }, [availablePurchases]);

  const buyCourse = useCallback(
    async (productId: string) => {
      if (!STORE_READY) {
        Alert.alert("Покупка доступна в приложении", "Откройте Psymindvia на iPhone или Android.");
        return;
      }
      if (!connected) {
        Alert.alert("Магазин недоступен", "Проверьте подключение к App Store или Google Play.");
        return;
      }
      setIsPurchasing(true);
      try {
        await requestPurchase({
          request: {
            apple: { sku: productId },
            google: { skus: [productId] },
          },
          type: "in-app",
        });
      } catch (error) {
        setIsPurchasing(false);
        const message = error instanceof Error ? error.message : "Не удалось начать покупку.";
        Alert.alert("Покупка не завершена", message);
      }
    },
    [connected, requestPurchase],
  );

  const restorePurchases = useCallback(async () => {
    if (!STORE_READY || !connected) {
      Alert.alert("Магазин недоступен", "Восстановление работает на iOS и Android.");
      return;
    }
    await restoreStorePurchases();
    const restored = await readCourseEntitlements();
    setPurchasedProductIds(restored);
    Alert.alert(
      "Покупки восстановлены",
      restored.length > 0 ? "Доступ к купленным курсам открыт." : "Активных покупок не найдено.",
    );
  }, [connected, restoreStorePurchases]);

  return {
    connected,
    priceByProductId: Object.fromEntries(products.map((product) => [product.id, product.displayPrice])),
    purchasedProductIds,
    isPurchasing,
    buyCourse,
    restorePurchases,
  };
}

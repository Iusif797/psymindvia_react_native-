import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { courses } from "../constants/courses";
import { readCourseEntitlements } from "../services/course-entitlements";

export function useCoursePurchases() {
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>([]);

  useEffect(() => {
    void readCourseEntitlements().then(setPurchasedProductIds);
  }, []);

  const buyCourse = useCallback(async () => {
    Alert.alert("Покупка доступна в приложении", "Откройте Psymindvia на iPhone или Android.");
  }, []);

  const restorePurchases = useCallback(async () => {
    Alert.alert("Восстановление доступно в приложении", "Откройте Psymindvia на iPhone или Android.");
  }, []);

  return {
    connected: false,
    priceByProductId: Object.fromEntries(
      courses.map((course) => [course.productId, `$${course.applePriceUsd}`]),
    ),
    purchasedProductIds,
    isPurchasing: false,
    buyCourse,
    restorePurchases,
  };
}

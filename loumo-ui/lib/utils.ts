import { ProductVariant, Promotion } from "@/types/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const XAF = new Intl.NumberFormat('fr-FR', {
  style: "currency",
  currency: "XAF"
});

export const getBestPromotionPrice = (variant: ProductVariant, promotions: Promotion[]): number => {
  const now = new Date();

  const applicablePromotions = promotions
    .filter(
      (promo) =>
        new Date(promo.expireAt) > now &&
        variant.stock?.some((stock) => stock.promotionId === promo.id)
    );

    console.log(applicablePromotions);
    

  const best = applicablePromotions.reduce<Promotion | null>((acc, curr) => {
    return !acc || curr.percentage > acc.percentage ? curr : acc;
  }, null);

  const basePrice = variant.price || 0;
  return best ? Math.round(basePrice * (1 - best.percentage / 100)) : basePrice;
};

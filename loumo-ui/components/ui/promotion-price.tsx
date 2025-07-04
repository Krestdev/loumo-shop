import PromotionQuery from "@/queries/promotion";
import { ProductVariant, Promotion } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

interface PriceDisplayProps {
  price: number | undefined;
  stocks?: Array<{
    promotionId: number | null;
    productVariantId: number;
  }> | null;
  variants: ProductVariant[] | undefined;
}

export const PriceDisplay = ({ price, stocks, variants }: PriceDisplayProps) => {
  const now = new Date();

  const promotion = new PromotionQuery();

  const promotionsData = useQuery({
    queryKey: ["promotionsFetchAll"],
    queryFn: () => promotion.getAll(),
  });

  const promotions = promotionsData.data

  const getPromotionById = (id: number | null): Promotion | null => {
    if (!id) return null;
    const promo = promotions?.find((p) => p.id === id);
    if (!promo || new Date(promo.expireAt) < now) return null;
    return promo;
  };

  const getVariantById = (id: number): ProductVariant | undefined => {
    return variants?.find((v) => v.id === id);
  };

  const formatPrice = (amount: number | undefined): string => {
    return new Intl.NumberFormat('fr-FR').format(amount ?? 0);
  };

  const getDiscountedPrice = (originalPrice: number, percentage: number): number => {
    return Math.round(originalPrice * (1 - percentage / 100));
  };

  const variantsWithPromotions = (stocks || [])
    .map((stock) => {
      const promo = getPromotionById(stock.promotionId);
      const variant = getVariantById(stock.productVariantId);

      if (promo && variant) {
        return {
          variant,
          promotion: promo,
        };
      }
      return null;
    })
    .filter(Boolean) as { variant: ProductVariant; promotion: Promotion }[];

  return (
    <div className="flex flex-col gap-4">
      {variantsWithPromotions.length > 0 ? (
        variantsWithPromotions.map(({ variant, promotion }) => {
          const discounted = getDiscountedPrice(variant.price, promotion.percentage);
          return (
            <div key={variant.id} className="flex flex-col gap-1 border-b pb-2">
              <div className="flex gap-2 items-center">
                <p className="text-[20px] font-bold text-black text-nowrap">
                  {formatPrice(discounted)} FCFA
                </p>
                <p className="text-[14px] text-gray-500 line-through text-nowrap">
                  {formatPrice(variant.price)} FCFA
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-[20px] font-bold text-gray-900">{formatPrice(price)} FCFA</p>
      )}
    </div>
  );
};

import { useStore } from '@/providers/datastore';
import { LucideDatabase, LucideTrash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import DeliveryPaymentForm from './DeliveryPaymentForm';
import ProductQuery from '@/queries/product';
import { useQuery } from '@tanstack/react-query';
import { ProductVariant, Promotion } from '@/types/types';
import PromotionQuery from '@/queries/promotion';

interface CartCompProps {
    onValidate?: () => void;
    promotions: Promotion[] | undefined
}

const CartComp = ({ onValidate, promotions }: CartCompProps) => {
    const t = useTranslations("Cart");
    const {
        addOrderItem,
        removeOrderItem,
        currentOrderItems,
        decrementOrderItem,
        incrementOrderItem,
        user,
    } = useStore();
    const env = process.env.NEXT_PUBLIC_API_BASE_URL

    const product = new ProductQuery();
    const productData = useQuery({
        queryKey: ["productFetchAll"],
        queryFn: () => product.getAll(),
    });

    const promotion = new PromotionQuery();
    const promotionData = useQuery({
        queryKey: ["promotionFetchAll"],
        queryFn: () => promotion.getAll(),
    });

    const getValidPromotionByStock = (
        variant: ProductVariant,
        allPromotions: Promotion[] | undefined
    ): Promotion | null => {
        const now = new Date();

        for (const stock of variant.stock || []) {
            if (stock.promotionId) {
                const promo = allPromotions?.find((p) => p.id === stock.promotionId);
                if (promo && new Date(promo.expireAt) > now) {
                    return promo;
                }
            }
        }

        return null;
    };

    const getCartTotal = (): number => {
        if (!promotionData.data) return 0;
        return currentOrderItems.reduce((total, item) => {
            const variant = item.productVariant;
            if (!variant) return total;
            const promo = getValidPromotionByStock(variant, promotionData.data);
            const price = promo
                ? Math.round(variant.price - (variant.price * promo.percentage) / 100)
                : variant.price;
            return total + price * item.quantity;
        }, 0);
    };

    console.log(currentOrderItems);



    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-[1400px] w-full">
            <div className="flex flex-col gap-5 px-6 py-7 rounded-[12px] max-w-[515px] w-full">
                <p className="text-[24px] text-secondary font-semibold">{t("cart")}</p>
                <div className="flex flex-col gap-2">
                    {currentOrderItems && currentOrderItems.length > 0 ? (
                        currentOrderItems.map((x, i) => {
                            const quantity = x.quantity || 1;
                            const product = productData.data?.find(p => p.id === x.productVariant?.productId);

                            return (
                                <div key={i} className="flex gap-4 p-4 rounded-[12px] text-gray-50">
                                    {x.productVariant?.imgUrl ? (
                                        <img
                                            src={x.productVariant?.imgUrl.includes("http") ? x.productVariant?.imgUrl : `${env}/${x.productVariant?.imgUrl}`}
                                            alt={x.productVariant?.name}
                                            className="max-w-[120px] w-full h-auto aspect-square rounded-[6px]"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center max-w-[120px] w-full h-auto aspect-square bg-gray-100 text-white rounded-[6px]">
                                            <LucideDatabase size={40} />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-gray-700 font-semibold">{product?.name}</p>
                                                <Badge variant="outline">{x.productVariant?.name}</Badge>
                                                {(() => {
                                                    const promo = x.productVariant
                                                        ? getValidPromotionByStock(x.productVariant, promotionData.data)
                                                        : null;

                                                    const unitPrice = promo
                                                        ? Math.round(
                                                            (x.productVariant?.price ?? 0) -
                                                            ((x.productVariant?.price ?? 0) * promo.percentage) / 100
                                                        )
                                                        : x.productVariant?.price ?? 0;

                                                    const totalPrice = unitPrice * quantity;

                                                    return promo ? (
                                                        <div className="flex flex-col">
                                                            <div className='flex flex-row items-center gap-2 line-through text-black'>
                                                                <p className='text-black text-nowrap text-[10px]'>{`${x.productVariant.price} * ${quantity} :`}</p>
                                                                <p className="text-black text-sm">
                                                                    {(x.productVariant?.price ?? 0) * quantity} FCFA
                                                                </p>
                                                            </div>
                                                            <div className='flex flex-row items-center gap-2'>
                                                                <p className="text-gray-900 font-semibold text-[12px] text-nowrap">{`${unitPrice} * ${quantity} :`}</p>
                                                                <p className="text-red-600 font-bold text-[20px] text-nowrap">{totalPrice} FCFA</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='flex gap-2 items-center'>
                                                            <p className="text-gray-900 font-semibold text-[12px] text-nowrap">{`${unitPrice} * ${quantity} :`}</p>
                                                            <p className="text-gray-900 font-bold text-[20px] text-nowrap">{totalPrice} FCFA</p>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            <div className='flex flex-col gap-2 h-full justify-end-end'>
                                                <Button
                                                    onClick={() => removeOrderItem(x.productVariantId)}
                                                    variant="ghost"
                                                    className="text-white bg-red-600 w-fit h-[25px] hover:bg-gray-50 hover:text-red-600"
                                                >
                                                    <LucideTrash />
                                                    {t("remove")}
                                                </Button>
                                                <div className="flex flex-row items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        onClick={() => decrementOrderItem(x.productVariantId, promotions!)}
                                                        variant="outline"
                                                        className="w-8 h-8 p-0 text-black hover:text-white"
                                                        disabled={!x.productVariant}
                                                    >
                                                        -
                                                    </Button>
                                                    <Input
                                                        value={quantity}
                                                        onChange={(e) =>
                                                            addOrderItem({
                                                                variant: x.productVariant!, note: "",
                                                                promotions: promotions!
                                                            }, parseInt(e.target.value))
                                                        }
                                                        className="w-12 text-center text-black"
                                                        disabled={!x.productVariant}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => incrementOrderItem(x.productVariantId, promotions!)}
                                                        variant="outline"
                                                        className="w-8 h-8 p-0 text-black hover:text-white"
                                                        disabled={!x.productVariant}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>{t("emptyCart")}</p>
                    )}
                </div>
            </div>

            {/* ✅ Passe onValidate ici */}
            {currentOrderItems.length > 0 && (
                <DeliveryPaymentForm user={user} onValidate={onValidate ?? (() => { })} totalPrice={getCartTotal()} />
            )}
        </div>
    );
};

export default CartComp;

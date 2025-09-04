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
        updateOrderItem,
        removeOrderItem,
        currentOrderItems,
        decrementOrderItem,
        incrementOrderItem,
        user,
        address,
        clearCart
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
    const frais = address?.zone?.price || 0;
    const totalPrice = getCartTotal() + frais;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-7 max-w-[1400px] w-full">
            <div className="flex flex-col gap-5 px-6 py-4 md:py-7 max-w-[515px] w-full border-b ie">
                <div className='flex items-center justify-between'>
                    <p className="text-[18px] md:text-[24px] text-secondary font-semibold">{t("cart")}</p>
                    {
                        currentOrderItems && currentOrderItems.length > 0 ? (
                            <Button
                                variant="outline"
                                className="bg-red-500 text-white hover:bg-red-500/80 mb-2 w-fit"
                                onClick={clearCart}
                            >
                                {t("clearCart")}
                            </Button>
                        ) : null
                    }
                </div>
                <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
                    {currentOrderItems && currentOrderItems.length > 0 ? (
                        currentOrderItems.map((x, i) => {
                            const quantity = x.quantity || 1;
                            const product = productData.data?.find(p => p.id === x.productVariant?.productId);

                            return (
                                <div key={i} className="flex gap-4 p-4 rounded-[12px] text-gray-50">
                                    {x.productVariant?.imgUrl ? (
                                        <img
                                            src={
                                                x.productVariant.imgUrl.includes("http")
                                                    ? x.productVariant.imgUrl
                                                    : `${env?.replace(/\/$/, "")}/${x.productVariant.imgUrl.replace(/^\//, "")}`
                                            }
                                            alt={x.productVariant?.name}
                                            className="max-w-[120px] w-full aspect-square rounded-[6px] border object-cover"
                                        />

                                    ) : (
                                        <div className="flex items-center justify-center max-w-[120px] w-full h-auto aspect-square bg-gray-100 text-white rounded-[6px]">
                                            <LucideDatabase size={40} />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="flex flex-col justify-between">
                                            <div className="flex flex-col">
                                                <p className="text-gray-700 font-semibold text-[20px] lg:text-[22px]">{product?.name}</p>
                                                <Badge variant="outline">{x.productVariant?.name + x.productVariant?.quantity + x.productVariant?.unit}</Badge>
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
                                                                <p className="text-black text-sm text-nowrap">
                                                                    {`${(x.productVariant?.price ?? 0) * quantity} FCFA`}
                                                                </p>
                                                            </div>
                                                            <div className='flex flex-row items-center gap-2'>
                                                                <p className="text-gray-900 font-semibold text-[12px] text-nowrap">{`${unitPrice} * ${quantity} :`}</p>
                                                                <p className="text-red-600 font-bold text-[14px] text-nowrap">{`${totalPrice} FCFA`}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='flex gap-2 items-center w-full'>
                                                            <p className="text-gray-900 font-semibold text-[12px] text-nowrap">{`${unitPrice} * ${quantity} :`}</p>
                                                            <p className="text-gray-900 font-bold text-[14px] text-nowrap">{`${totalPrice} FCFA`}</p>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            <div className='flex flex-row items-center h-full gap-2 justify-end-end'>
                                                <div className="flex flex-row items-center gap-[2px]">
                                                    <Button
                                                        type="button"
                                                        onClick={() => decrementOrderItem(x.productVariantId, promotions!)}
                                                        variant="outline"
                                                        className="w-7 h-7 p-0 text-black hover:text-white"
                                                        disabled={!x.productVariant}
                                                    >
                                                        -
                                                    </Button>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        defaultValue={quantity}
                                                        value={quantity}
                                                        onChange={(e) => {
                                                            updateOrderItem(x.productVariantId, parseInt(e.target.value) || 1);
                                                        }}
                                                        className="w-12 h-7 text-center px-0 text-black"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => incrementOrderItem(x.productVariantId, promotions!)}
                                                        variant="outline"
                                                        className="w-7 h-7 p-0 text-black hover:text-white"
                                                        disabled={!x.productVariant}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                                <Button
                                                    onClick={() => removeOrderItem(x.productVariantId)}
                                                    variant="ghost"
                                                    className="text-red-600 bg-red-600/10 w-7 lg:w-fit h-7 hover:bg-gray-50 hover:text-red-600"
                                                >
                                                    <LucideTrash />
                                                    <p className='hidden lg:block text-[12px]'>{t("remove")}</p>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>{t("cartEmpty")}</p>
                    )}
                </div>
            </div>

            {/* ✅ Passe onValidate ici */}
            {currentOrderItems.length > 0 && (
                <DeliveryPaymentForm user={user} onValidate={onValidate ?? (() => { })} totalPrice={totalPrice} />
            )}
        </div>
    );
};

export default CartComp;

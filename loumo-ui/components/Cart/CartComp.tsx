import { useStore } from '@/providers/datastore';
import { LucideDatabase, LucideTrash } from 'lucide-react';
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import DeliveryPaymentForm from './DeliveryPaymentForm';

const CartComp = () => {
    const t = useTranslations("Cart");
    const { addOrderItem, removeOrderItem, currentOrderItems, decrementOrderItem, incrementOrderItem, user } = useStore();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-[1400px] w-full">
            <div className="flex flex-col gap-5 px-6 py-7 rounded-[12px] max-w-[515px] w-full">
                <p className="text-[24px] text-secondary font-semibold">{t("cart")}</p>
                <div className="flex flex-col gap-2">
                    {currentOrderItems && currentOrderItems.length > 0 ? (
                        currentOrderItems.map((x, i) => {
                            const id = x.productVariant?.productId || i.toString();
                            const quantity = x.quantity || 1;
                            return (
                                <div key={id} className="flex gap-4 p-4 rounded-[12px] text-gray-50">
                                    {x.productVariant?.imgUrl ? (
                                        <img
                                            src={x.productVariant?.imgUrl}
                                            alt={x.productVariant?.name}
                                            className="max-w-[120px] w-full h-auto aspect-square rounded-[6px]"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center max-w-[120px] w-full h-auto aspect-square bg-gray-100 text-white rounded-[6px]">
                                            <LucideDatabase size={40} />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="w-full flex justify-end">
                                            <Button onClick={() => removeOrderItem(x.productVariantId)} variant="ghost" className="text-red-600 h-[19px] hover:bg-gray-50 hover:text-red-600">
                                                <LucideTrash />
                                                {t("remove")}
                                            </Button>
                                        </div>
                                        <div className="flex gap-4 items-center justify-between">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-gray-700 font-semibold">{x.productVariant?.product?.name}</p>
                                                <Badge variant="outline">{x.productVariant?.name}</Badge>
                                                <p className="text-gray-900 font-bold text-[20px]">
                                                    {`${x.productVariant?.price} FCFA`}
                                                </p>
                                            </div>

                                            <div className="flex flex-row items-center gap-2">
                                                <Button
                                                    type="button"
                                                    onClick={() => decrementOrderItem(x.productVariantId)}
                                                    variant="outline"
                                                    className="w-8 h-8 p-0 text-black hover:text-white"
                                                    disabled={!x.productVariant}
                                                >
                                                    -
                                                </Button>
                                                <Input
                                                    value={quantity}
                                                    onChange={(e) => addOrderItem({ variant: x.productVariant!, note: "" }, parseInt(e.target.value))}
                                                    className="w-12 text-center text-black"
                                                    disabled={!x.productVariant}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => incrementOrderItem(x.productVariantId)}
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
                            );
                        })
                    ) : (
                        <p>{t("emptyCart")}</p>
                    )}
                </div>
            </div>
            {currentOrderItems.length > 0 && <DeliveryPaymentForm user={user} />}
        </div>
    );
};

export default CartComp

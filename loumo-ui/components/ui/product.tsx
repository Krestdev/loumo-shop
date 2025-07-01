"use client";

import { Product } from '@/types/types'
import { LucideDatabase, LucideHeart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { Button } from './button'
import Link from 'next/link'
import { AddToCard } from '../Catalog/AddToCard'
import { useStore } from '@/providers/datastore';
interface Props {
    product: Product | undefined
}
const ProductComp = ({ product }: Props) => {

    const { user } = useStore()
    const t = useTranslations("HomePage.GridProducts")
    const [favorites, setFavorites] = useState<{ [id: number]: boolean }>({});
    const [variant, setVariant] = useState(product && product.variants && product.variants[0]);

    const toggleFavorite = (id: number) => {
        setFavorites((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    console.log(variant?.stock[0] && variant?.stock[0].quantity <= 0);
    
    return (
        product && variant &&
        <div className='flex flex-col gap-4 h-fit'>
            <div className='relative flex gap-3 w-full h-auto'>
                <div className='absolute z-10 top-2 left-2 right-2 flex items-center justify-between'>
                    <div className='flex items-center justify-center p-2 rounded-sm bg-[#FFFEF8] text-primary'>{t("new")}</div>
                    <Button onClick={() => toggleFavorite(product.id,)} variant={"ghost"} className={`h-9 w-9 ${favorites[product.id] ? "bg-red-500 hover:bg-red-500/80 hover:text-white text-white" : "bg-white/50 text-gray-600"}`}>
                        <LucideHeart size={20} />
                    </Button>
                </div>
                <Link className='w-full h-full' href={`/catalog/${variant.name}`}>
                    {
                        // variant?.[0]?.imgUrl
                        false ?
                            <img src="" alt="" className='w-full aspect-square h-auto object-cover' /> :
                            <div className='flex items-center justify-center w-full h-auto aspect-square object-cover bg-gray-100 text-white'>
                                <LucideDatabase size={80} />
                            </div>
                    }
                </Link>
                {(!variant.stock || (variant.stock[0] && variant.stock[0].quantity <= 0)) && (
                    <div className='absolute bottom-2 left-0 bg-red-700 p-2 z-10'>
                        <p className='text-white text-sm font-semibold'>{t("outOfStock")}</p>
                    </div>
                )}
            </div>
            <div className='flex flex-col justify-between'>
                <div className='flex flex-col gap-1'>
                    <p className='text-[16px] text-gray-700'>{product.name}</p>
                    <div className='flex flex-row items-center'>
                        {
                            product?.variants?.slice(0, 2).map((va, idx) => (
                                <Button
                                    onClick={() => setVariant(va)}
                                    className='px-2 py-1 h-[26px]' key={idx} variant={variant.id === va.id ? "default" : "ghost"}>
                                    {va.name}
                                </Button>
                            ))
                        }
                        {(product?.variants?.length ?? 0) > 2 && <Link href={`/catalog/${variant.name}`} className='px-2 py-1 h-[26px] hover:bg-gray-50 rounded-[20px]'>
                            <div className='h-[18px] w-4 flex items-center justify-center'>{"+"}</div>
                        </Link>}
                    </div>
                    <div className='flex gap-1 items-center'>
                        <p className='text-[20px] font-bold'>{`${variant.price} FCFA`}</p>
                        {/* <p className='text-[12px] text-gray-500 line-through'>{!variant.stock || (variant.stock && variant.stock.promotion?.percentage)}</p> */}
                    </div>
                </div>
                <AddToCard product={product} variant={variant}>
                    <Button variant={"default"}>{t("addToCart")}</Button>
                </AddToCard>
            </div>
        </div>
    )
};

export default ProductComp;

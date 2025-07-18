"use client";

import { Product, ProductVariant, Promotion } from '@/types/types'
import { LucideDatabase, LucideHeart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { Button } from './button'
import Link from 'next/link'
import { AddToCard } from '../Catalog/AddToCard'
import { useStore } from '@/providers/datastore';
import { AddAddress } from '../select-address';
import { PriceDisplay } from '@/components/ui/promotion-price'
import UserQuery from '@/queries/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import ProductVariantQuery from '@/queries/productVariant';

interface Props {
    product: Product | undefined
    promotions: Promotion[] | undefined;
}

const ProductComp = ({ product, promotions }: Props) => {
    const router = useRouter()
    const { user, address } = useStore()
    const t = useTranslations("HomePage.GridProducts")
    const env = process.env.NEXT_PUBLIC_API_BASE_URL

    const variants = new ProductVariantQuery();
    const variantData = useQuery({
        queryKey: ["variantFetchAll"],
        queryFn: () => variants.getAll(),
    });

    const [variant, setVariant] = useState<ProductVariant>();

    useEffect(() => {
        if (variantData.isSuccess) {
            setVariant(variantData.data?.find(x => x.id === product?.variants[0].id))
        }
    }, [variantData.data, variantData.isSuccess, product?.variants])

    const userQuery = new UserQuery();
    const userData = useMutation({
        mutationKey: ["favorite"],
        mutationFn: (productIds: number[]) =>
            userQuery.addProductsToFavorite(user!.id, productIds),
        onError: (error) => {
            console.error("Échec de l'ajout aux favoris :", error);
        },
    });

    const usersData = useQuery({
        queryKey: ["usersFetch"],
        queryFn: () => userQuery.getOne(user!.id),
    });

    const isFavorite = !!usersData.data?.favorite?.some((fav) => fav.id === product?.id)

    const toggleFavorite = (id: number) => {
        userData.mutate([id]);
    };

    function isNewProduct(product: Product): boolean {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        return product.variants?.some(variant => {
            const createdAt = new Date(variant.createdAt);
            return createdAt >= sevenDaysAgo;
        }) ?? false;
    }

    return (
        product && variant &&
        <div className='flex flex-col gap-4 h-fit'>
            <div className='relative flex gap-3 w-full h-auto'>
                {isNewProduct(product) && <div className='absolute top-2 left-2 flex items-center justify-center p-2 rounded-sm bg-[#FFFEF8] text-primary'>
                    {t("new")}
                </div>}
                <div className='absolute z-10 top-2 right-2 flex items-center justify-between'>
                    {user ? (
                        address ? (
                            <Button
                                onClick={() => toggleFavorite(product.id)}
                                variant={"ghost"}
                                className={`h-9 w-9 ${isFavorite ? "bg-red-500 hover:bg-red-500/80 hover:text-white text-white" : "bg-white/50 text-gray-600"}`}
                            >
                                <LucideHeart size={20} />
                            </Button>
                        ) : (
                            <AddAddress>
                                <Button
                                    className={`h-9 w-9 ${isFavorite ? "bg-red-500 hover:bg-red-500/80 hover:text-white text-white" : "bg-white/50 text-gray-600"}`}
                                >
                                    <LucideHeart size={20} />
                                </Button>
                            </AddAddress>
                        )
                    ) : (
                        <Button
                            onClick={() => router.push("/auth/login")}
                            className={`h-9 w-9 ${isFavorite ? "bg-red-500 hover:bg-red-500/80 hover:text-white text-white" : "bg-white/50 text-gray-600"}`}
                        >
                            <LucideHeart size={20} />
                        </Button>
                    )}
                </div>

                {address ? <Link className='w-full h-full' href={`/catalog/${product.slug}`}>
                    {variant.imgUrl ? (
                        <img src={variant.imgUrl.includes("http") ? variant.imgUrl : `${env}/${variant.imgUrl}`} alt={variant.name} className='w-full aspect-square h-auto object-cover' />
                    ) : (
                        <div className='flex items-center justify-center w-full h-auto aspect-square object-cover bg-gray-100 text-white'>
                            <LucideDatabase size={80} />
                        </div>
                    )}
                </Link> :
                    <AddAddress>
                        <Button className='px-0 py-0 w-full h-full bg-transparent hover:bg-transparent rounded-none'>
                            {variant.imgUrl ? (
                                <img src={variant.imgUrl.includes("http") ? variant.imgUrl : `${env}/${variant.imgUrl}`} alt={variant.name} className='w-full aspect-square h-auto object-cover' />
                            ) : (
                                <div className='flex items-center justify-center w-full h-auto aspect-square object-cover bg-gray-100 text-white'>
                                    <LucideDatabase size={80} />
                                </div>
                            )}
                        </Button>
                    </AddAddress>
                }

                {((variant.stock && variant.stock[0] && variant.stock[0].quantity <= 0) || variant.stock.length <= 0) && (
                    <div className='absolute bottom-2 left-0 bg-red-700 p-2 z-10'>
                        <p className='text-white text-sm font-semibold'>{t("outOfStock")}</p>
                    </div>
                )}
            </div>

            <div className='flex flex-col justify-between'>
                <div className='flex flex-col gap-1'>
                    <p className='text-[16px] text-gray-700'>{product.name}</p>
                    <div className='flex flex-row items-center gap-2'>
                        {product?.variants?.slice(0, 2).map((va, idx) => (
                            <Button
                                key={va.id ?? idx}
                                onClick={() => setVariant(va)}
                                className="px-2 py-1 h-[26px] truncate flex justify-start"
                                variant={variant?.id === va.id ? "default" : "ghost"}
                            >
                                {va.name}
                            </Button>
                        ))}
                        {address ?
                            (product?.variants?.length ?? 0) > 2 && (
                                // <Link
                                //     href={`/catalog/${product.slug}`}
                                //     className='px-2 py-1 h-[26px] hover:bg-gray-50 rounded-[20px]'
                                // >
                                //     <div className='h-[18px] w-4 flex items-center justify-center'>+</div>
                                // </Link>
                                <AddToCard product={product} variant={variant} setVariant={setVariant} promotions={promotions}>
                                    <div className='h-[18px] w-4 flex items-center justify-center cursor-pointer'>+</div>
                                </AddToCard>
                            ) :
                            <AddAddress>
                                <Button
                                    variant={"ghost"}
                                    className='px-2 py-1 h-[26px] hover:bg-gray-50 hover:text-black rounded-[20px] w-fit'
                                >
                                    <div className='h-[18px] w-4 flex items-center justify-center'>+</div>
                                </Button>
                            </AddAddress>
                        }
                    </div>

                    <PriceDisplay
                        price={variant.price}
                        stocks={variant.stock?.map(s => ({
                            promotionId: s.promotionId,
                            productVariantId: s.productVariantId,
                        }))}
                        variants={product.variants}
                    />
                </div>

                {address ? (
                    <AddToCard product={product} variant={variant} setVariant={setVariant} promotions={promotions}>
                        <Button disabled={((variant.stock && variant.stock[0] && variant.stock[0].quantity <= 0) || variant.stock.length <= 0)} variant={"default"}>{t("addToCart")}</Button>
                    </AddToCard>
                ) : (
                    // user ?
                    <AddAddress>
                        <Button disabled={((variant.stock && variant.stock[0] && variant.stock[0].quantity <= 0) || variant.stock.length <= 0)}>{t("addToCart")}</Button>
                    </AddAddress>
                    // :
                    // <LoginDialog>
                    //     <Button>{t("addToCart")}</Button>
                    // </LoginDialog>
                )}
            </div>
        </div>
    );
};

export default ProductComp;

"use client";

import ProductComp from '@/components/ui/product';
import { Skeleton } from '@/components/ui/skeleton';
import ProductQuery from '@/queries/product';
import PromotionQuery from '@/queries/promotion';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation'
import React from 'react'

const Search = () => {

    const searchParams = useSearchParams();
    const search = searchParams.get("nom");

    const product = new ProductQuery();
    const promotion = new PromotionQuery();
    const t = useTranslations("HomePage.GridProducts")

    const promotionData = useQuery({
        queryKey: ["promotionFetchAll"],
        queryFn: () => promotion.getAll(),
    });
    const productData = useQuery({
        queryKey: ["productFetchAll"],
        queryFn: () => product.getAll(),
    });

    // Je vais filtrer les produit qui ont le nom de la recherche
    const filteredProducts = search
        ? productData.data?.filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
        : productData.data;

    const isLoading = productData.isLoading || promotionData.isLoading;
    const isSuccess = productData.isSuccess && promotionData.isSuccess;

    const products = filteredProducts ? filteredProducts : productData.data;
    const promotions = promotionData.data!


    return (
        <div className={`max-w-[1400px] w-full flex flex-col gap-8 px-7 py-24`}>
            <p className='text-3xl font-bold'>{t("searchResult")}</p>
            <div className='grid grid-cols-3 md:grid-cols-4 3xl:grid-cols-5 gap-x-5 gap-y-10'>
                {isLoading && Array.from({ length: products && products.length ? products.length : 0 }).map((_, i) => (
                    <Skeleton key={i} className="w-[252px] rounded-none" />
                ))}

                {isSuccess && products && products.length > 0 ? (
                    products.map((product, i) => (
                        <ProductComp promotions={promotions} product={product} key={i} />
                    ))
                ) : (
                    !isLoading && <p>{t("noProduct")}</p>
                )}
            </div>
        </div>
    )
}

export default Search

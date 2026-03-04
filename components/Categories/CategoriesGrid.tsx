"use client"

import { useQuery } from '@tanstack/react-query';
import React from 'react'
import Loading from '../setup/loading';
import CategoryQuery from '@/queries/category';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import { Bread } from '../Bread';
import { useTranslations } from 'next-intl';
import { useStore } from '@/providers/datastore';

const CategoriesGrid = () => {

    const { address } = useStore();
    const t = useTranslations("HomePage")
    const category = new CategoryQuery();
    const env = process.env.NEXT_PUBLIC_API_BASE_URL;
    const categoryData = useQuery({
        queryKey: ["categoryFetchAll"],
        queryFn: () => category.getAll(),
    });

    if (categoryData.isLoading) {
        return <Loading status={"loading"} />;
    }

    if (categoryData.isError) {
        return <Loading status={"failed"} />;
    }

    // Je vais calculer les catégories qui ont au moins un produit actif avec des variantes et disponible dans la zone de livraison ayant l'adresse selectionnée

    const filteredCategories =
        address === null ?
            categoryData.data :
            categoryData.data?.filter((category) => {
                return category.products?.some((product) => {
                    return product.status === true &&
                        product.variants &&
                        product.variants.length > 0 &&
                        product.status === true &&
                        product.variants.some((variant) => {
                            return variant.stock?.some((stock) => {
                                return stock.shop?.address?.zoneId === address?.zoneId;
                            });
                        });

                });
            });

    return (
        <div className='max-w-[1400px] w-full px-7 py-32 flex flex-col gap-5'>
            <Bread title={t("categories")} />
            <div className='grid grid-cols-2 lg:grid-cols-5 gap-7'>
                {categoryData.isLoading && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-[301px] h-[254px] rounded-none" />)}
                {
                    categoryData.isSuccess &&
                    filteredCategories &&filteredCategories?.length > 0 ?
                     filteredCategories?.map((x, i) => {
                        return (
                            <Link key={i} href={`/categories/${x.slug}`} className='flex flex-col gap-2'>
                                <img
                                    src={
                                        x.imgUrl?.includes("http")
                                            ? x.imgUrl
                                            : `${env?.replace(/\/$/, "")}/${x.imgUrl?.replace(/^\//, "")}`
                                    }
                                    alt={x.name}
                                    className="w-full aspect-[4/3] h-auto object-cover border"
                                />

                                <p className='font-medium text-[16px] text-gray-900'>{x.name}</p>
                            </Link>
                        )
                    }) :
                    <p className='col-span-4'>{t("emptyCategories")}</p>
                }
            </div>

        </div>
    )
}

export default CategoriesGrid

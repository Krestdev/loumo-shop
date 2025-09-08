"use client"

import { useQuery } from '@tanstack/react-query';
import React from 'react'
import Loading from '../setup/loading';
import CategoryQuery from '@/queries/category';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import { Bread } from '../Bread';
import { useTranslations } from 'next-intl';

const CategoriesGrid = () => {

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


    return (
        <div className='max-w-[1400px] w-full px-7 py-32 flex flex-col gap-5'>
            <Bread title={t("categories")} />
            <div className='grid grid-cols-2 lg:grid-cols-5 gap-7'>
                {categoryData.isLoading && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-[301px] h-[254px] rounded-none" />)}
                {
                    categoryData.isSuccess &&
                    categoryData.data.filter(category => category.products?.some(product => product.status === true && product.variants && product.variants.length > 0)).map((x, i) => {
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
                    })
                }
            </div>

        </div>
    )
}

export default CategoriesGrid

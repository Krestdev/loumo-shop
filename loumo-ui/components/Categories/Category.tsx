"use client"

import React, { useEffect, useState } from 'react'
import Loading from '../setup/loading';
import { useQuery } from '@tanstack/react-query';
import CategoryQuery from '@/queries/category';
import { Category } from '@/types/types';
import ProductComp from '../ui/product';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import PromotionQuery from '@/queries/promotion';

const CategoryComp = ({ slug }: { slug: string }) => {

    const [categ, setCateg] = useState<Category>()
    const t = useTranslations("HomePage");

    const category = new CategoryQuery();
    const promotion = new PromotionQuery();

    const promotionData = useQuery({
        queryKey: ["promotionFetchAll"],
        queryFn: () => promotion.getAll(),
    });

    const categoryData = useQuery({
        queryKey: ["categoryFetchAll"],
        queryFn: () => category.getAll(),
    });

    useEffect(() => {
        if (categoryData.isSuccess) {
            setCateg(categoryData.data.find(x => x.slug === decodeURIComponent(slug)))
        }
    }, [categoryData.data, categoryData.isSuccess, slug])

    if (categoryData.isLoading) {
        return <Loading status={"loading"} />;
    }

    if (categoryData.isError) {
        return <Loading status={"failed"} />;
    }

    return (
        <div className='w-full flex justify-center'>
            <div className='flex flex-col gap-5 px-4 md:px-7 py-5 md:py-8 max-w-[1400px] w-full'>
                <div className='flex flex-row items-center gap-2'>
                    <Link className='text-primary underline' href={"/"}>{t("home")}</Link>
                    <ChevronRight size={12} />
                    <Link className='text-primary underline' href={"/categories"}>{t("categories")}</Link>
                    <ChevronRight size={12} />
                    <p>{categ?.name}</p>
                </div>
                <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
                    {
                        categ?.products?.map((x, i) => {
                            return (
                                <ProductComp key={i} product={x} promotions={promotionData.data} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default CategoryComp

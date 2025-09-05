"use client"

import ProductComp from '@/components/ui/product';
import { useStore } from '@/providers/datastore';
import ProductQuery from '@/queries/product';
import PromotionQuery from '@/queries/promotion';
import UserQuery from '@/queries/user';
import { Product } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

const Page = () => {
    const { user } = useStore();
    const t = useTranslations("HomePage")

    const userQuery = new UserQuery();
    const promotion = new PromotionQuery();
    const product = new ProductQuery();


    const [favorite, setFavorite] = useState<Product[]>()

    const userData = useQuery({
        queryKey: ["userData"],
        queryFn: () => userQuery.getOne(user!.id)
    })

    const promotionData = useQuery({
        queryKey: ["promotionFetchAll"],
        queryFn: () => promotion.getAll(),
    });

    const productData = useQuery({
        queryKey: ["productFetchAll"],
        queryFn: () => product.getAll(),
    });

    useEffect(() => {
        if (userData.isSuccess && userData.data?.favorite) {
            setFavorite(userData.data?.favorite)
        }
    }, [userData.data, userData.data?.favorite, userData.isSuccess])

    const items = productData.data?.filter(x => favorite?.find(y => y.id === x.id))

    return (
        <div className='w-full flex justify-center'>
            <div className='flex flex-col gap-5 px-7 py-8 max-w-[1400px] w-full'>
                <h3 className='text-center'>{t("fav")}</h3>
                <div className='py-5 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
                    {
                        items?.map((x, i) => {
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

export default Page

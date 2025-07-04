"use client"

import GridProduct from '@/components/Home/GridProduct';
import Loading from '@/components/setup/loading';
import { useStore } from '@/providers/datastore';
import PromotionQuery from '@/queries/promotion';
import UserQuery from '@/queries/user';
import { Product, Promotion } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

const page = () => {
    const { user } = useStore();
    const t = useTranslations("HomePage")

    const userQuery = new UserQuery();
    const promotion = new PromotionQuery();

    const [favorite, setFavorite] = useState<Product[]>()
    const [promotions, setPromotions] = useState<Promotion[]>()

    const userData = useQuery({
        queryKey: ["userData"],
        queryFn: () => userQuery.getOne(user!.id)
    })

    const promotionData = useQuery({
        queryKey: ["promotionFetchAll"],
        queryFn: () => promotion.getAll(),
    });

    useEffect(() => {
        if (userData.isSuccess && userData.data?.favorite) {
            setFavorite(userData.data?.favorite)
        }
    }, [userData.data, userData.data?.favorite])

    useEffect(() => {
        if (promotionData.isSuccess && promotionData.data) {
            setPromotions(promotionData.data)
        }
    }, [promotionData.data])

    return (
        <div className='w-full flex justify-center'>
            <div className='flex flex-col gap-5 px-7 py-8 max-w-[1400px] w-full'>
                <h3 className='text-center'>{t("fav")}</h3>
                <GridProduct title={''} products={favorite} isLoading={userData.isLoading} isSuccess={userData.isSuccess} promotions={promotions} />
            </div>
        </div>
    )
}

export default page

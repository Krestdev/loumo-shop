import { Product, Promotion } from '@/types/types';
import React from 'react'
import { Skeleton } from '../ui/skeleton';
import ProductComp from '../ui/product';
import { useTranslations } from 'next-intl';

interface Props {
    products: (Product | undefined)[] | Product[] | undefined;
    isLoading: boolean;
    isSuccess: boolean;
    className?: string;
    price?: number;
    promotions: Promotion[] | undefined;
}
const AllProducts = (
    {
        promotions,
        products,
        isLoading,
        isSuccess,
        className = "px-7 py-12 gap-7",
    }: Props
) => {

    const t = useTranslations("HomePage.GridProducts")

    return (
        <div className={`max-w-[1400px] w-full flex flex-col ${className}`}>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5 gap-x-5 gap-y-10'>
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

export default AllProducts

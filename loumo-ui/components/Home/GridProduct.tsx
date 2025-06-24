import { Product } from '@/types/types'
import React from 'react'
import ProductComp from '../ui/product'
import { Skeleton } from '../ui/skeleton'

interface Props {
    title: string,
    products: Product[] | undefined,
    isLoading: boolean
    isSuccess: boolean
}

const GridProduct = ({ title, products, isLoading, isSuccess }: Props) => {
    return (
        <div className='max-w-[1400px] w-full px-7 py-12 flex flex-col gap-7 '>
            <h1 className='category-title'>{title}</h1>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:h-[410px] overflow-hidden'>
                {isLoading && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-[252px] h-[450px] rounded-none" />)}
                {
                    isSuccess &&
                    products?.map((x, i) => (
                        <ProductComp product={x} key={i} />
                    ))
                }
            </div>
        </div>
    )
}

export default GridProduct

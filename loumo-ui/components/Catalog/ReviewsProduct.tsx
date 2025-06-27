import { Product } from '@/types/types'
import { useTranslations } from 'next-intl'
import React from 'react'
import Stars from '../ui/stars'
import { useReviews } from '@/data/data'
import { Button } from '../ui/button'

interface Props {
    product: Product
}

const ReviewsProduct = ({}) => {
    const t = useTranslations("Catalog.ProductDetail")
    const reviews = useReviews();

    const moy =
  reviews.length > 0
    ? reviews.reduce((total, x) => total + x.note, 0) / reviews.length
    : 0;



  return (
    <div className='flex flex-col gap-7 px-7 py-24 max-w-[1400px] w-full'>
        <h1 className='text-black'>{t("reviews")}</h1>
        <div className='flex flex-row gap-10'>
            <div className='flex flex-col gap-2'>
                <h1 className='text-[72px]'>{moy.toFixed(2)}</h1>
                <Stars note={moy} couleur='#F8CA4C' taille={40} />
                <p className='text-gray-700 text-[16px]'>{`${reviews.length} ${t("reviews")}`}</p>
            </div>
            <div className='flex flex-col gap-7'>
                <div className='flex flex-col'>
                    {
                        reviews.map((x,i) => {
                            return (
                                <div className='flex flex-col gap-3 px-4 py-5'>
                                    <Stars note={x.note} couleur='#F8CA4C' taille={16} />
                                    <div className='flex flex-col gap-1'>
                                        <p className='text-[16px] text-gray-900 font-semibold'>{x.title}</p>
                                        <p className='text-[16px] text-gray-700'>{x.message}</p>
                                    </div>
                                    <p className='italic font-bold text-gray-700'>{`${t("submit")} ${x.author}`}</p>
                                </div>
                            )
                        })
                    }
                    <Button className='bg-black hover:bg-black/80 w-fit'>{t("leaveReview")}</Button>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default ReviewsProduct

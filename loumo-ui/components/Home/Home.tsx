import React from 'react'
import HeroSection from './HeroSection'
import GridProduct from './GridProduct'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import ProductQuery from '@/queries/product'
import HowStep from './HowStep'
import ReviewsGrid from './ReviewsGrid'
import { CategoryMenu } from '../CategoryMenu'

const Home = () => {
  const t = useTranslations("HomePage.GridProducts")
  const product = new ProductQuery();
  const productData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAll(),
  });

  return (
    <div className='w-full flex flex-col items-center'>
      <HeroSection />
      <CategoryMenu />
      <GridProduct
        title={t("star")}
        products={productData.data}
        isLoading={productData.isLoading}
        isSuccess={productData.isSuccess}
      />
      <GridProduct
        title={t("promotions")}
        products={productData.data}
        isLoading={productData.isLoading}
        isSuccess={productData.isSuccess}
      />
      <GridProduct
        title={t("promotions")}
        products={productData.data}
        isLoading={productData.isLoading}
        isSuccess={productData.isSuccess}
      />
      <HowStep />

      <ReviewsGrid />
    </div>
  )
}

export default Home

"use client";

import React from 'react';
import HeroSection from './HeroSection';
import GridProduct from './GridProduct';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import ProductQuery from '@/queries/product';
import PromotionQuery from '@/queries/promotion';
import HowStep from './HowStep';
import ReviewsGrid from './ReviewsGrid';
import { CategoryMenu } from '../CategoryMenu';
import { useStore } from '@/providers/datastore';

const Home = () => {
  const t = useTranslations("HomePage.GridProducts");
  const { address } = useStore()

  const product = new ProductQuery();
  const promotion = new PromotionQuery();

  // 🔄 Récupération des produits
  const productData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAll(),
  });

  // 🔄 Récupération des promotions
  const promotionData = useQuery({
    queryKey: ["promotionFetchAll"],
    queryFn: () => promotion.getAll(),
  });


  const addressId = address?.zoneId

  console.log(addressId);


  // ✅ Filtrage des produits par zone de livraison
  const filteredProducts = React.useMemo(() => {
    if (!productData.data) return [];

    // S'il n'y a pas de zone, retourne tous les produits
    if (!addressId) return productData.data;

    // Sinon, filtre par zone
    return productData.data.filter((product) =>
      product.variants?.some((variant) =>
        variant.stock?.some((stock) =>
          stock.shop?.address?.zoneId === addressId
        )
      )
    );
  }, [productData.data, addressId]);

  return (
    <div className="w-full flex flex-col items-center">
      <HeroSection />
      <CategoryMenu />

      {filteredProducts.length > 0
        ? <GridProduct
          title={t("star")}
          products={filteredProducts}
          isLoading={productData.isLoading}
          isSuccess={productData.isSuccess}
          promotions={promotionData.data}
        />
        : <div className='py-32'>
          <h3>{"Aucun produit disponible dans votre zone de livraison"}</h3>
        </div>
      }

      {filteredProducts.filter(x => x.variants.some(x => x.stock.some(x => x.promotionId))).length > 0
        && <GridProduct
          title={t("promotions")}
          products={filteredProducts.filter(x => x.variants.some(x => x.stock.some(x => x.promotionId)))}
          isLoading={productData.isLoading}
          isSuccess={productData.isSuccess}
          promotions={promotionData.data}
        />}

      <HowStep />
      <ReviewsGrid />
    </div>
  );
};

export default Home;

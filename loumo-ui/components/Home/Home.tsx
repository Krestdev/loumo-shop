"use client";

import React from 'react';
import HeroSection from './HeroSection';
import GridProduct from './GridProduct';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import ProductQuery from '@/queries/product';
import PromotionQuery from '@/queries/promotion';
import HowStep from './HowStep';
// import ReviewsGrid from './ReviewsGrid';
import { CategoryMenu } from '../CategoryMenu';
import { useStore } from '@/providers/datastore';
import CategoryQuery from '@/queries/category';
import OrderQuery from '@/queries/order';
import Redaction from '../redaction';

const Home = () => {
  const t = useTranslations("HomePage.GridProducts");
  const t1 = useTranslations("Maintenance")
  const { address } = useStore()

  const promotion = new PromotionQuery();
  const product = new ProductQuery();
  const category = new CategoryQuery();
  const orders = new OrderQuery();

  const ordersData = useQuery({
    queryKey: ["ordersFetchAll"],
    queryFn: () => {
      return orders.getAll();
    },
  });

  const categoryData = useQuery({
    queryKey: ["categoryFetchAll"],
    queryFn: () => category.getAll(),
  });

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
    filteredProducts.length > 0 ?
    <div className="w-full flex flex-col items-center overflow-clip">
      <HeroSection />
      <CategoryMenu />

      {/* Maintenant je vais calculer et affiche la grille des produits les plus commandés sur le site */}
      {ordersData.data && ordersData.data.length > 0 ? (
        <GridProduct
          title={t("star")}
          products={ordersData.data
            .flatMap(order => order.orderItems)
            .map(orderItem => filteredProducts.find(product => product.id === orderItem?.productVariant?.productId))
            .filter(Boolean)}
          isLoading={ordersData.isLoading}
          isSuccess={ordersData.isSuccess}
          promotions={promotionData.data}
        />
      ) : null}

      {/* Maintenant je vais afficher la grille des produits des catégorie dont display est vrai */}
      {categoryData.data && categoryData.data.length > 0 && categoryData.data?.filter(x => x.display === true).length > 0 ?
       categoryData.data?.filter(x => x.display === true).map((category) => (
        <GridProduct
          key={category.id}
          title={category.name}
          products={filteredProducts.filter(x => x.categoryId === category.id)}
          isLoading={productData.isLoading}
          isSuccess={productData.isSuccess}
          promotions={promotionData.data}
        />
      )): null}

      <HowStep />
      {/* <ReviewsGrid /> */}
    </div> :
    <Redaction show={false} message={t1("emptyProduct")} />
  );
};

export default Home;

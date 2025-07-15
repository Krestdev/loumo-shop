"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import Filter from "@/components/Catalog/Filter";
import Loading from "@/components/setup/loading";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Bread } from "@/components/Bread";
import { useStore } from "@/providers/datastore";
import AllProducts from "@/components/Catalog/AllProducts";
import { PRICE_RANGE } from "@/lib/utils";
import CategoryQuery from "@/queries/category";
import ProductQuery from "@/queries/product";
import ProductVariantQuery from "@/queries/productVariant";
import PromotionQuery from "@/queries/promotion";
import StockQuery from "@/queries/stock";
import ShopQuery from "@/queries/shop";
import { Category } from "@/types/types";

const Page = () => {
  const t = useTranslations("Catalog.Filters");
  const { address } = useStore();

  // Initialisation des queries
  const categoryQuery = new CategoryQuery();
  const productQuery = new ProductQuery();
  const variantQuery = new ProductVariantQuery();
  const promotionQuery = new PromotionQuery();
  const stockQuery = new StockQuery();
  const shopQuery = new ShopQuery();

  // Récupération des données séparées
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryQuery.getAll(),
  });

  const { data: allProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productQuery.getAll(),
  });

  const { data: allVariants} = useQuery({
    queryKey: ['variants'],
    queryFn: () => variantQuery.getAll(),
  });

  const { data: allStocks} = useQuery({
    queryKey: ['stocks'],
    queryFn: () => stockQuery.getAll(),
  });

  const { data: allShops } = useQuery({
    queryKey: ['shops'],
    queryFn: () => shopQuery.getAll(),
  });

  const { data: promotions } = useQuery({
    queryKey: ['promotions'],
    queryFn: () => promotionQuery.getAll(),
  });

  // États des filtres
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_RANGE.MIN, PRICE_RANGE.MAX]);

  // Jointure des données
  const enrichedProducts = useMemo(() => {
    if (!allProducts || !allVariants || !allStocks || !allShops) return [];

    return allProducts.map(product => {
      const productVariants = allVariants.filter(v => v.productId === product.id)
        .map(variant => {
          const variantStocks = allStocks.filter(s => s.productVariantId === variant.id)
            .map(stock => {
              const shop = allShops.find(s => s.id === stock.shopId);
              return { ...stock, shop };
            });
          return { ...variant, stock: variantStocks };
        });

      return {
        ...product,
        variants: productVariants,
        category: categories?.find(c => c.id === product.categoryId)
      };
    });
  }, [allProducts, allVariants, allStocks, allShops, categories]);

  // Filtrage des produits
  const filteredProducts = useMemo(() => {
    let result = enrichedProducts;

    // Filtre par catégorie
    if (selectedCategories.length > 0) {
      const selectedCategoryIds = selectedCategories.map(c => c.id);
      result = result.filter(p => selectedCategoryIds.includes(p.categoryId!));
    }

    // Filtre par prix (version corrigée avec priceRange)
    result = result.filter(p =>
      p.variants.some(v =>
        v.price >= priceRange[0] && 
        v.price <= priceRange[1]  
      )
    );

    // Filtre par disponibilité
    if (availableOnly) {
      result = result.filter(p =>
        p.variants.some(v =>
          v.stock.some(s => s.quantity > 0)
        )
      );
    }
    

    // Filtre par zone
    if (address?.zoneId) {
      result = result.filter(p =>
        p.variants.some(v =>
          v.stock.some(s =>
            s.shop?.address?.zoneId === address.zoneId
          )
        )
      );
    }

    // Filtre par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.category?.name.toLowerCase().includes(term)
        ))
    }

    return result;
  }, [
    enrichedProducts,
    selectedCategories,
    availableOnly,
    address?.zoneId,
    searchTerm,
    priceRange
  ]);

  // Catégories disponibles (pour le filtre)
  const availableCategories = useMemo(() => {
    if (!categories || !filteredProducts) return [];

    return categories.filter(c =>
      c.products?.some(x => x.variants.length > 0)
    );
  }, [categories, filteredProducts]);

  if (categoriesLoading || productsLoading) return <Loading status="loading" />;
  if (!categories || !allProducts) return <Loading status="failed" />;

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col gap-5 px-7 py-8 max-w-[1400px] w-full">
        <Bread />
        <p className="text-secondary text-[36px] w-full text-center">
          {t("allProducts")}
        </p>

        {/* Barre de recherche */}
        <div className="flex justify-center">
          <div className="relative max-w-[360px] w-full">
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("search") + "..."}
              className="h-10"
            />
            <Button className="absolute h-8 right-1 top-1">
              {t("search")}
            </Button>
          </div>
        </div>

        <div className="md:px-7 flex flex-col md:flex-row items-start justify-start gap-5">
          {/* Composant Filtre */}
          <Filter
            maxPrice={PRICE_RANGE.MAX}
            minPrice={PRICE_RANGE.MIN}
            categories={availableCategories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            availableOnly={availableOnly}
            setAvailableOnly={setAvailableOnly}
            priceRange={priceRange}
            setPriceRange={setPriceRange} />

          {/* Liste des produits */}
          <AllProducts
            products={filteredProducts}
            isLoading={categoriesLoading || productsLoading}
            isSuccess={!!categories && !!allProducts}
            className="px-0 py-0"
            promotions={promotions}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CategoryQuery from "@/queries/category";
import { Category, Product } from "@/types/types";
import { Input } from "@/components/ui/input";
import Filter from "@/components/Catalog/Filter";
import Loading from "@/components/setup/loading";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import RequireAuth from "@/components/RequireAuth";
import { Bread } from "@/components/Bread";
import UserQuery from "@/queries/user"; 
import { useStore } from "@/providers/datastore";
import AllProducts from "@/components/Catalog/AllProducts";

const Page = () => {
  const category = new CategoryQuery();
  const userQuery = new UserQuery(); 
  const t = useTranslations("Catalog.Filters");
  const { user } = useStore()

  const categoryData = useQuery({
    queryKey: ["categoryData"],
    queryFn: () => category.getAll(),
  });

  const userData = useQuery({
    queryKey: ["userMe"],
    queryFn: () => userQuery.getOne(user!.id),
  });

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [price, setPrice] = useState(10000);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const allProducts: Product[] =
    categoryData.data?.flatMap((cat) => cat.products ?? []) ?? [];

  const userZoneId = userData.data?.addresses?.[0]?.zoneId ?? undefined;

  const useFilteredProducts = ({
    allProducts,
    price,
    minPrice,
    selectedCategories,
    availableOnly,
    searchTerm,
    userZoneId,
  }: {
    allProducts: Product[];
    price: number;
    minPrice: number;
    selectedCategories: Category[];
    availableOnly: boolean;
    searchTerm: string;
    userZoneId: number | undefined;
  }) => {
    const selectedCategoryIds = selectedCategories.map((cat) => cat.id);

    const filtered = useMemo(() => {
      if (!allProducts || !userZoneId) return [];

      let filteredData = allProducts;

      // 1. Produits avec variantes
      filteredData = filteredData.filter(
        (product) => product.variants && product.variants.length > 0
      );

      // 2. Par catégorie
      if (selectedCategoryIds.length > 0) {
        filteredData = filteredData.filter((product) =>
          product.categoryId !== null &&
          selectedCategoryIds.includes(product.categoryId)
        );
      }

      // 3. Par zone (lieu de vente disponible pour l'utilisateur)
      filteredData = filteredData.filter((product) =>
        product.variants?.some((variant) =>
          variant.stock?.some(
            (stock) =>
              stock.shop?.address?.zoneId === userZoneId
          )
        )
      );

      // 4. Par disponibilité et prix
      filteredData = filteredData.filter((product) =>
        product.variants?.some((variant) => {
          const matchesPrice = variant.price >= minPrice && variant.price <= price;
          const matchesAvailability = !availableOnly || variant.stock?.some(s => s.quantity > 0);
          return matchesPrice && matchesAvailability;
        })
      );

      // 5. Par recherche textuelle
      if (searchTerm.trim() !== "") {
        const search = searchTerm.trim().toLowerCase();
        filteredData = filteredData.filter((product) =>
          product.name.toLowerCase().includes(search)
        );
      }

      return filteredData;
    }, [
      allProducts,
      price,
      minPrice,
      selectedCategoryIds,
      availableOnly,
      searchTerm,
      userZoneId,
    ]);

    return filtered;
  };

  const filteredProducts = useFilteredProducts({
    allProducts,
    price,
    minPrice,
    selectedCategories,
    availableOnly,
    searchTerm,
    userZoneId,
  });

  if (categoryData.isLoading || userData.isLoading) return <Loading status="loading" />;
  if (categoryData.isError || userData.isError) return <Loading status="failed" />;

  const categoriesWithProducts = categoryData.data?.filter((cat) =>
    cat.products?.some((product) => product.variants && product.variants.length > 0)
  );

  return (
    <RequireAuth>
      <div className="flex justify-center w-full">
        <div className="flex flex-col gap-5 px-7 py-8 max-w-[1400px] w-full">
          <Bread />
          <p className="text-secondary text-[36px] w-full text-center">
            {t("allProducts")}
          </p>

          {/* Recherche */}
          <div className="flex justify-center">
            <div className="relative max-w-[360px] w-full">
              <Input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search a product"
                className="h-10"
              />
              <Button className="absolute h-8 right-1 top-1">{t("search")}</Button>
            </div>
          </div>

          <div className="px-7 flex flex-row items-start justify-start gap-5">
            <Filter
              maxPrice={100000}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              categories={categoriesWithProducts!}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              price={price}
              setPrice={setPrice}
              availableOnly={availableOnly}
              setAvailableOnly={setAvailableOnly}
            />

            <AllProducts
              products={filteredProducts}
              isLoading={categoryData.isLoading}
              isSuccess={categoryData.isSuccess}
              className="px-0 py-0"
              promotions={undefined}
            />
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default Page;

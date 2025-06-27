"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CategoryQuery from "@/queries/category";
import { Category, Product } from "@/types/types";
import { Input } from "@/components/ui/input";
import GridProduct from "@/components/Home/GridProduct";
import Filter from "@/components/Catalog/Filter";
import Loading from "@/components/setup/loading";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const Page = () => {
  const category = new CategoryQuery();
  const categoryData = useQuery({
    queryKey: ["categoryData"],
    queryFn: () => category.getAll(),
  });

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [price, setPrice] = useState(10000);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const t = useTranslations("Catalog.Filters")

  const allProducts: Product[] =
    categoryData.data?.flatMap((cat) => cat.products ?? []) ?? [];

  const useFilteredProducts = ({
    allProducts,
    price,
    selectedCategories,
    availableOnly,
    searchTerm,
  }: {
    allProducts: Product[];
    price: number;
    selectedCategories: Category[];
    availableOnly: boolean;
    searchTerm: string;
  }) => {
    const selectedCategoryIds = selectedCategories.map((cat) => cat.id);
    const filtered = useMemo(() => {
      if (!allProducts || allProducts.length === 0) return [];

      let filteredData = allProducts;

      // 1. Filtrer les produits avec au moins une variante
      filteredData = filteredData.filter(
        (product) => product.variants && product.variants.length > 0
      );

      // 2. Filtrer par catégorie
      if (selectedCategoryIds.length > 0) {
        filteredData = filteredData.filter((product) =>
          product.categoryId !== null && selectedCategoryIds.includes(product.categoryId)
        );
      }

      // 3. Filtrer par prix et disponibilité
      filteredData = filteredData.filter((product) =>
        product.variants?.some((variant) => {
          const matchesPrice = variant.price <= price;
          const matchesAvailability = !availableOnly;
          return matchesPrice && matchesAvailability;
        })
      );

      // 4. Filtrer par recherche textuelle
      if (searchTerm.trim() !== "") {
        const search = searchTerm.trim().toLowerCase();
        filteredData = filteredData.filter((product) =>
          product.name.toLowerCase().includes(search)
        );
      }

      console.log(filteredData);

      return filteredData;
    }, [allProducts, price, selectedCategoryIds, availableOnly, searchTerm]);

    return filtered;
  };


  const filteredProducts = useFilteredProducts({
    allProducts,
    price,
    selectedCategories,
    availableOnly,
    searchTerm,
  });

  if (categoryData.isLoading) return <Loading status="loading" />;
  if (categoryData.isError) return <Loading status="failed" />;

  const categoriesWithProducts = categoryData.data && categoryData.data.filter((cat) =>
    cat.products?.some((product) => product.variants && product.variants.length > 0)
  );

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col gap-5 px-7 py-8 max-w-[1400px] w-full">
        <div>{"Home > Products"}</div>

        <p className="text-secondary text-[36px] w-full text-center">{t("allProducts")}</p>

        {/* Search */}
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
            maxPrice={10000}
            categories={categoriesWithProducts!}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            price={price}
            setPrice={setPrice}
            availableOnly={availableOnly}
            setAvailableOnly={setAvailableOnly}
          />

          <GridProduct
            title=""
            products={filteredProducts}
            isLoading={categoryData.isLoading}
            isSuccess={categoryData.isSuccess}
            className="px-0 py-0"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;

"use client";

import React, { useMemo } from "react";
import Loading from "../setup/loading";
import { useQuery } from "@tanstack/react-query";
import CategoryQuery from "@/queries/category";
import ProductComp from "../ui/product";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import PromotionQuery from "@/queries/promotion";
import { useStore } from "@/providers/datastore";

const Category = ({ slug }: { slug: string }) => {
  const t = useTranslations("HomePage");
  const { address } = useStore();

  const category = new CategoryQuery();
  const promotion = new PromotionQuery();

  const promotionData = useQuery({
    queryKey: ["promotionFetchAll"],
    queryFn: () => promotion.getAll(),
  });

  const categoryData = useQuery({
    queryKey: ["categoryFetchAll"],
    queryFn: () => category.getAll(),
  });

  // Utiliser useMemo pour trouver la catégorie au lieu d'un état et d'un effet
  const categ = useMemo(() => {
    if (!categoryData.data) return undefined;
    return categoryData.data.find((x) => x.slug === decodeURIComponent(slug));
  }, [categoryData.data, slug]);

  // Extraire zoneId une fois pour toutes
  const addressZoneId = address?.zoneId;

  // Utiliser useMemo pour filtrer les produits avec des dépendances correctes
  const filteredProducts = useMemo(() => {
    if (!categ?.products) return undefined;

    const products = categ.products;

    return address === null
      ? products.filter(
          (x) => x.status === true && x.variants && x.variants.length > 0
        )
      : products.filter(
          (x) =>
            x.status === true &&
            x.variants &&
            x.variants.length > 0 &&
            x.variants.some((y) =>
              y.stock?.some((z) => z.shop?.address?.zoneId === addressZoneId)
            )
        );
  }, [categ?.products, address, addressZoneId]); // Utiliser address et addressZoneId

  if (categoryData.isLoading) {
    return <Loading status={"loading"} />;
  }

  if (categoryData.isError) {
    return <Loading status={"failed"} />;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col gap-5 px-4 md:px-7 py-5 md:py-8 max-w-[1400px] w-full">
        <div className="flex flex-row items-center gap-2">
          <Link className="text-primary underline" href={"/"}>
            {t("home")}
          </Link>
          <ChevronRight size={12} />
          <Link className="text-primary underline" href={"/categories"}>
            {t("categories")}
          </Link>
          <ChevronRight size={12} />
          <p>{categ?.name}</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredProducts && filteredProducts?.length > 0 ? (
            filteredProducts?.map((x, i) => {
              return (
                <ProductComp
                  key={i}
                  product={x}
                  promotions={promotionData.data}
                />
              );
            })
          ) : (
            <p className="col-span-4">{t("noCategorie")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;

"use client";

import * as React from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CategoryQuery from "@/queries/category";
import { useQuery } from "@tanstack/react-query";
import CategoryCard from "./CategoryCard";
import { EmblaCarouselType } from "embla-carousel";
import { useStore } from "@/providers/datastore";

export function CategoryMenu() {
  const { address } = useStore();
  const addressZoneId = address?.zoneId;

  const [emblaRef, setEmblaRef] = React.useState<EmblaCarouselType | undefined>();

  const category = new CategoryQuery();
  const categoryData = useQuery({
    queryKey: ["categoryFetchAll"],
    queryFn: () => category.getAll(),
  });

  // ✅ Si pas d’adresse, on prend toutes les catégories (max 6)
  const filteredCategories = React.useMemo(() => {
    const allCategories = categoryData.data || [];

    // Pas de filtre si aucune zone sélectionnée
    if (!addressZoneId) {
      return allCategories.slice(0, 6);
    }

    // Sinon, on filtre les catégories avec produits en stock dans la zone
    return allCategories
      .filter((category) =>
        category.products?.some((product) =>
          product.variants?.some((variant) =>
            variant.stock?.some((stock) =>
              stock.shop?.address?.zoneId === addressZoneId
            )
          )
        )
      )
      .slice(0, 6);
  }, [categoryData.data, addressZoneId]);

  // ✅ Auto-scroll du carousel
  React.useEffect(() => {
    if (!emblaRef) return;

    const interval = setInterval(() => {
      if (emblaRef.canScrollNext()) {
        emblaRef.scrollNext();
      } else {
        emblaRef.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaRef]);

  return (
    <div className="max-w-[1400px] w-full px-7 py-8 overflow-hidden">
      <Carousel
        opts={{
          align: "center",
          loop: true,
          startIndex: 0,
          inViewThreshold: 0.5,
        }}
        setApi={setEmblaRef}
        className="w-full relative"
      >
        <CarouselContent className="flex">
          {filteredCategories.map((category, index) => (
            <CarouselItem
              key={index}
              className="basis-[50%] sm:basis-[30%] lg:basis-[16.7%] flex-shrink-0"
            >
              <CategoryCard category={category} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

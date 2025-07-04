"use client";

import * as React from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import CategoryQuery from "@/queries/category"
import { useQuery } from "@tanstack/react-query"
import CategoryCard from "./CategoryCard"



export function CategoryMenu() {
  const [emblaRef, setEmblaRef] = React.useState<any>(null)
  const category = new CategoryQuery()
  const categoryData = useQuery({
    queryKey: ["categoryFetchAll"],
    queryFn: () => category.getAll(),
  })
  const categories = categoryData.data?.slice(0, 6) || []

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
          {categories.filter(category =>
            category.products?.some(product => product.variants && product.variants.length > 0)).map((category, index) => (
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

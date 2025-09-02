import { Product, Promotion } from '@/types/types'
import React, { useEffect, useState } from 'react'
import ProductComp from '../ui/product'
import { Skeleton } from '../ui/skeleton'
import { useTranslations } from 'next-intl';

interface Props {
  title: string;
  products: (Product | undefined)[] | Product[] | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  className?: string;
  price?: number;
  promotions: Promotion[] | undefined;
}

// Hook pour détecter le breakpoint
const useBreakpoint = () => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize(); 

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (width >= 1280) return "xl";
  if (width >= 768) return "md";
  return "base";
};

const GridProduct = ({
  promotions,
  title,
  products,
  isLoading,
  isSuccess,
  className = "px-4 py-12 gap-7",
}: Props) => {
  const breakpoint = useBreakpoint();
  const t = useTranslations("HomePage.GridProducts")

  const filteredProducts = products?.filter(
    (product) => product && product.variants && product.variants.length > 0
  ) ?? [];

  // Limiter selon le breakpoint
  const visibleCount = breakpoint === "xl" ? 5 : breakpoint === "md" ? 4 : filteredProducts.length;
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className={`max-w-[1400px] w-full flex flex-col ${className}`}>
      <h1 className='category-title'>{title}</h1>
      <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
        {isLoading && Array.from({ length: visibleCount }).map((_, i) => (
          <Skeleton key={i} className="w-[252px] rounded-none" />
        ))}

        {isSuccess && visibleProducts.length > 0 ? (
          visibleProducts.map((product, i) => (
            <ProductComp promotions={promotions} product={product} key={i} />
          ))
        ) : (
          !isLoading && <p>{t("noProduct")}</p>
        )}
      </div>
    </div>
  );
};

export default GridProduct;

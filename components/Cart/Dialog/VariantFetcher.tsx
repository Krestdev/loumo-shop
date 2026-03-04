// components/VariantFetcher.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import ProductVariantQuery from "@/queries/productVariant";
import Loading from "@/components/setup/loading";
import { ProductVariant } from "@/types/types";
import { ReactNode } from "react";

interface Props {
  children: (variants: ProductVariant[]) => ReactNode;
}

export default function VariantFetcher({ children }: Props) {
  const variantQuery = new ProductVariantQuery();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["variants"],
    queryFn: () => variantQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loading status="loading" />;
  if (isError || !data) return <Loading status="failed" />;

  return <>{children(data)}</>;
}

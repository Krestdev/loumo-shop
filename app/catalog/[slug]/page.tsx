"use client";
import Loading from "@/components/setup/loading";
import ProductQuery from "@/queries/product";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const product = new ProductQuery();
  const productData = useQuery({
    queryKey: ["productData"],
    queryFn: () => product.getOne(Number(slug)),
  });

  if (productData.isLoading) {
    return <Loading status={"loading"} />;
  }

  if (productData.isError) {
    return <Loading status={"failed"} />;
  }

  if (productData.isSuccess) {
    return <div>{JSON.stringify(productData.data)}</div>;
  }

  return <Loading />;
};

export default Page;

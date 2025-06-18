"use client";
import Loading from "@/components/setup/loading";
import ProductQuery from "@/queries/product";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import JsonView from "react18-json-view";

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
    return (
      <div>
        <div className="max-w-3xl mx-auto mt-10">
          <h1 className="text-xl font-bold mb-4">Product Data</h1>
          <JsonView src={productData.data} />
        </div>
      </div>
    );
  }

  return <Loading />;
};

export default Page;

"use client";
import Loading from "@/components/setup/loading";
import ProductQuery from "@/queries/product";
import { useQuery } from "@tanstack/react-query";
import JsonView from "react18-json-view";

const Page = () => {
  const product = new ProductQuery();
  const productData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAll(),
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
          <h1 className="mb-4">Product Data</h1>
          <JsonView src={productData.data} />
        </div>
      </div>
    );
  }

  return <Loading />;
};

export default Page;

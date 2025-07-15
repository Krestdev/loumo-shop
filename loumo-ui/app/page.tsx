"use client";

import Home from "@/components/Home/Home";
import Loading from "@/components/setup/loading";
import ProductQuery from "@/queries/product";
import { useQuery } from "@tanstack/react-query";

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
        <Home />
      </div>
    );
  }

  return <Loading />;
};

export default Page;

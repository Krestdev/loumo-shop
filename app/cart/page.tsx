"use client";
import Loading from "@/components/setup/loading";
import ProductQuery from "@/queries/order";
import { useMutation, useQuery } from "@tanstack/react-query";

const Page = () => {
  const order = new ProductQuery();
  const productData = useMutation({
    mutationKey: ["orderCreate"],
    mutationFn: () => order.getAll(),
  });

  if (productData.isPending) {
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

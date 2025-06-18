"use client";
import Loading from "@/components/setup/loading";
import OrderQuery from "@/queries/order";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import JsonView from "react18-json-view";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const order = new OrderQuery();
  const orderData = useQuery({
    queryKey: ["orderData"],
    queryFn: () => order.getOne(Number(id)),
  });

  if (orderData.isLoading) {
    return <Loading status={"loading"} />;
  }

  if (orderData.isError) {
    return <Loading status={"failed"} />;
  }

  if (orderData.isSuccess) {
    return (
      <div>
        <div className="max-w-3xl mx-auto mt-10">
          <h1 className="text-xl font-bold mb-4">Product Data</h1>
          <JsonView src={orderData.data} />
        </div>
      </div>
    );
  }

  return <Loading />;
};

export default Page;

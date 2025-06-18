"use client";
import Loading from "@/components/setup/loading";
import OrderQuery from "@/queries/order";
import { useQuery } from "@tanstack/react-query";
import React from "react";

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
    return <div>{JSON.stringify(orderData.data)}</div>;
  }

  return <Loading />;
};

export default Page;

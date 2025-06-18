"use client";
import Loading from "@/components/setup/loading";
import CategoryQuery from "@/queries/category";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const category = new CategoryQuery();
  const categoryData = useQuery({
    queryKey: ["categoryData"],
    queryFn: () => category.getAll(),
  });

  if (categoryData.isLoading) {
    return <Loading status={"loading"} />;
  }

  if (categoryData.isError) {
    return <Loading status={"failed"} />;
  }

  if (categoryData.isSuccess) {
    return <div>{JSON.stringify(categoryData.data)}</div>;
  }

  return <Loading />;
};

export default Page;

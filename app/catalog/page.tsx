"use client";
import Loading from "@/components/setup/loading";
import CategoryQuery from "@/queries/category";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import JsonView from "react18-json-view";

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
    return (
      <div>
        <div className="max-w-3xl mx-auto mt-10">
          <h1 className="text-xl font-bold mb-4">Category Catalogue Data</h1>
          <JsonView src={categoryData.data} />
        </div>
      </div>
    );
  }

  return <Loading />;
};

export default Page;

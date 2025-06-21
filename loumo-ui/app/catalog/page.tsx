"use client";
import Loading from "@/components/setup/loading";
import { useStore } from "@/providers/datastore";
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

  const { addOrderItem, removeOrderItem, currentOrderItems } = useStore();

  if (categoryData.isLoading) {
    return <Loading status={"loading"} />;
  }

  if (categoryData.isError) {
    return <Loading status={"failed"} />;
  }

  if (categoryData.isSuccess) {
    const data = categoryData.data?.[0]?.products?.[0]?.variants;
    return (
      <div>
        <div className="flex flex-col gap-4 max-w-3xl mx-auto mt-10">
          {data && (
            <div className="flex gap-2">
              <p>add to cart :</p>{" "}
              <button
                type="button"
                className=" border rounded-lg"
                onClick={() => addOrderItem({ variant: data[0], note: "" })}
              >
                Add
              </button>
            </div>
          )}
          {data && (
            <div className="flex gap-2">
              <p>remove from cart :</p>{" "}
              <button onClick={() => removeOrderItem(data[0].id)}>Add</button>
            </div>
          )}
          {currentOrderItems.map((coi) => {
            return <JsonView key={coi.id} src={coi} />;
          })}
        </div>
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

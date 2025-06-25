"use client";
import Filter from "@/components/Catalog/Filter";
import GridProduct from "@/components/Home/GridProduct";
import Loading from "@/components/setup/loading";
import { Input } from "@/components/ui/input";
import { useStore } from "@/providers/datastore";
import CategoryQuery from "@/queries/category";
import { Category } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import JsonView from "react18-json-view";

const Page = () => {
  const category = new CategoryQuery();
  const categoryData = useQuery({
    queryKey: ["categoryData"],
    queryFn: () => category.getAll(),
  });

  const { addOrderItem, removeOrderItem, currentOrderItems } = useStore();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  if (categoryData.isLoading) {
    return <Loading status={"loading"} />;
  }

  if (categoryData.isError) {
    return <Loading status={"failed"} />;
  }

  const handleFilter = (filters: {
    price: number;
    category: Category[];
    availableOnly: boolean;
  }) => {
    console.log("Filters applied:", filters);
  };

  if (categoryData.isSuccess) {
    const data = categoryData.data?.[0]?.products?.[0]?.variants;
    return (
      <div className="flex justify-center w-full">
        <div className="flex flex-col gap-5 px-7 py-8 max-w-[1400px] w-full">
          <div>
            {"Home > Products"}
          </div>
          <p className="text-secondary text-[36px] w-full text-center">
            {"All Products"}
          </p>
          <div className="w-full flex justify-center">
            <Input
              type="search"
              placeholder={"Search a product"}
              className="max-w-[360px] w-full"
            />
          </div>

          <div className="px-7 flex flex-row items-start justify-start gap-5">
            {/* Filtre */}
            <Filter
              maxPrice={10000}
              categories={categoryData.data.filter(category =>
                category.products?.some(product => product.variants && product.variants.length > 0)
              )}
              onFilter={handleFilter}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            {/* Grille de produit filtré */}
            <GridProduct
              title={""}
              products={selectedCategories.length > 0 ? selectedCategories.flatMap(x => x.products)
                : categoryData.data.flatMap(x => x.products)}
              isLoading={categoryData.isLoading}
              isSuccess={categoryData.isSuccess}
              className="px-0 py-0"
            />
          </div>



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
      </div>
    );
  }

  return <Loading />;
};

export default Page;

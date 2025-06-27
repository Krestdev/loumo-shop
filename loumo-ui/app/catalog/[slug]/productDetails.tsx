"use client";

import { AddToCard } from "@/components/Catalog/AddToCard";
import ReviewsProduct from "@/components/Catalog/ReviewsProduct";
import GridProduct from "@/components/Home/GridProduct";
import Loading from "@/components/setup/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/providers/datastore";
import ProductQuery from "@/queries/product";
import { ProductVariant } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { LucideDatabase, LucideHeart, LucideShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";

const ProductDetails = ({ slug }: { slug: string }) => {
  const product = new ProductQuery();
  const productData = useQuery({
    queryKey: ["productData", slug],
    queryFn: () => product.getOneBySlug(slug).then(res => {
      setCurrentvar(res.variants?.[0].id)
      return res
    }),

  });

  const [currentvar, setCurrentvar] = useState<number>();
  const [quantity, setQuantity] = useState(1)
  const { addOrderItem } = useStore()
  const t = useTranslations("Catalog.ProductDetail")
  const [favorites, setFavorites] = useState<{ [id: number]: boolean }>({});
  const toggleFavorite = (id: number) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (productData.isLoading) {
    return <Loading status="loading" />;
  }

  if (productData.isError) {
    return <Loading status="failed" />;
  }

  const increment = () => setQuantity(q => q + 1)
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1))

  const productItem = productData.data?.variants?.find(x => x.id == currentvar);

  const addToCart = () => {
    console.log("Ajouter au panier :", { productItem, quantity })
    addOrderItem({ variant: productItem!, note: "" })
    console.log("Ajouté avec succès");
  }

  const similaire = productData.data?.category?.products?.filter(x => x.id != productData.data.id)

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 max-w-[1400px] w-full py-7">
        <div className="flex flex-col gap-7">
          {productItem && (
            false ?
              <img
                src={productItem?.imgUrl}
                alt={productItem?.name}
                className="w-full h-auto aspect-[4/3] rounded-[20px]"
              /> :
              <div className='flex items-center justify-center w-full h-auto aspect-[4/3] rounded-[20px] object-cover bg-gray-100 text-white'>
                <LucideDatabase size={150} />
              </div>
          )}
          <section className="grid overflow-x-auto scrollbar-hide">
            <div className="inline-flex gap-5">
              {productData.data?.variants?.map((x: ProductVariant, i: number) => (
                <img
                  key={i}
                  src={x.imgUrl}
                  alt={x.name}
                  className={`max-w-[120px] w-full h-auto aspect-[4/3] rounded-[6px] cursor-pointer ${productItem === x ? "ring-2 ring-primary" : ""
                    }`}
                  onClick={() => setCurrentvar(x.id)}
                />
              ))}
            </div>
          </section>
        </div>
        <div className="flex flex-col gap-7 ">
          <div className="flex flex-col gap-4 pb-5 border-b border-gray-200">
            <h3 className="text-black">{productItem?.name}</h3>
            <div className="flex flex-col gap-3">
              <p>{t("options")}</p>
              <div className="flex flex-col gap-4">
                <section className="grid overflow-x-auto pb-1">
                  <div className="inline-flex gap-5">
                    {
                      productData.data?.variants?.map((x: ProductVariant, i: number) => (
                        <div onClick={() => setCurrentvar(x.id)} className={`cursor-pointer flex flex-col items-center justify-center rounded-[6px] px-3 py-2 w-[153.33px] h-[64px] ${productItem === x ? "bg-primary text-white" : "bg-white text-black border border-gray-300"}`}>
                          <p className="text-[18px]">{`${x.weight} KG`}</p>
                          <p className="text-[18px]">{`${x.price} FCFA`}</p>
                        </div>
                      ))
                    }
                  </div>
                </section>
                <div className="flex items-center gap-4">
                  <h3>{`${productItem?.price} FCFA`}</h3>
                  <p className="text-[24px] text-gray-500 font-normal line-through">{`10000 FCFA`}</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Button type="button" onClick={decrement} variant="outline" className="w-8 h-8 p-0">-</Button>
                  <Input
                    // type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || "1")))}
                    className="w-12 text-center"
                  />
                  <Button type="button" onClick={increment} variant="outline" className="w-8 h-8 p-0">+</Button>
                </div>
                <div className="w-full grid grid-cols-2 items-center gap-4">
                  <AddToCard product={productData.data} variant={productItem}>
                    <Button className="h-12 rounded-[24px]">
                      <LucideShoppingCart />
                      {t("addToCart")}
                    </Button>
                  </AddToCard>
                  <Button
                    variant={"outline"}
                    className={`h-12 rounded-[24px] ${productData.data && favorites[productData.data.id]
                        ? "bg-red-500 hover:bg-red-500/80 hover:text-white text-white"
                        : "bg-white/50 text-gray-600"
                      } `}
                    onClick={() => productData.data && toggleFavorite(productData.data.id)}
                  >
                    <LucideHeart />
                    {t("addToWishlist")}
                  </Button>
                </div>
              </div>

            </div>
          </div>
          <p className="font-semibold text-secondary text-[20px]">
            {t("about")}
          </p>
          <div className="flex flex-col gap-5">
            <span className="flex gap-3">
              <p className="text-secondary text-[14px] font-semibold">{t("weight")}</p>
              <p className="text-gray-700 text-[16px] font-normal">{productItem?.weight}</p>
            </span>
            <span className="flex gap-3">
              <p className="text-secondary text-[14px] font-semibold">{t("categories")}</p>
              <p className="text-gray-700 text-[16px] font-normal">{productData.data?.category?.name}</p>
            </span>
            <span className="flex flex-col gap-2">
              <p className="text-secondary text-[14px] font-semibold">{t("description")}</p>
              {/* <p className="text-gray-700 text-[16px] font-normal">{productItem.description}</p> */}
            </span>
            <span className="flex flex-col gap-2">
              <p className="text-secondary text-[14px] font-semibold">{t("ingredient")}</p>
              {/* <p className="text-gray-700 text-[16px] font-normal">{productItem.description}</p> */}
            </span>
          </div>
        </div>

        {/* <div className="max-w-3xl mx-auto mt-10">
          <h1 className="text-xl font-bold mb-4">Product Data</h1>
          <JsonView src={productItem} />
        </div> */}
      </div>
      <GridProduct title={t("essential")} products={similaire} isLoading={productData.isLoading} isSuccess={productData.isSuccess} />
      <GridProduct title={t("essential")} products={similaire} isLoading={productData.isLoading} isSuccess={productData.isSuccess} />
      <ReviewsProduct />
    </div>
  );
};

export default ProductDetails;

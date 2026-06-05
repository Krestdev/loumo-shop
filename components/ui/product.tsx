"use client";

import { PriceDisplay } from "@/components/ui/promotion-price";
import { useStore } from "@/providers/datastore";
import ProductVariantQuery from "@/queries/productVariant";
import UserQuery from "@/queries/user";
import { Product, ProductVariant, Promotion } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LucideDatabase, LucideHeart } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { AddToCard } from "../Catalog/AddToCard";
import { AddAddress } from "../select-address";
import { Button } from "./button";

interface Props {
  product: Product | undefined;
  promotions: Promotion[] | undefined;
}

const ProductComp = ({ product, promotions }: Props) => {
  const router = useRouter();
  const { user, address } = useStore();
  const t = useTranslations("HomePage.GridProducts");
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;

  const variants = new ProductVariantQuery();
  const variantData = useQuery({
    queryKey: ["variantFetchAll"],
    queryFn: () => variants.getAll(),
  });

  // Extraire l'ID du premier variant pour éviter d'accéder à product?.variants?.[0]?.id
  const firstVariantId = product?.variants?.[0]?.id;

  // Utiliser useMemo pour déterminer le variant initial
  const initialVariant = useMemo(() => {
    if (!variantData.data || !firstVariantId) return undefined;
    return variantData.data.find((x) => x.id === firstVariantId);
  }, [variantData.data, firstVariantId]); // Utiliser firstVariantId au lieu de product?.variants

  const [variant, setVariant] = useState<ProductVariant | undefined>(initialVariant);

  // Mettre à jour variant si initialVariant change
  React.useEffect(() => {
    if (initialVariant && initialVariant.id !== variant?.id) {
      setVariant(initialVariant);
    }
  }, [initialVariant, variant?.id]);

  const userQuery = new UserQuery();
  const userData = useMutation({
    mutationKey: ["favorite"],
    mutationFn: (productIds: number[]) =>
      userQuery.addProductsToFavorite(user!.id, productIds),
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      console.error("Échec de l'ajout aux favoris :", error);
    },
  });

  const usersData = useQuery({
    queryKey: ["usersFetch"],
    queryFn: () => userQuery.getOne(user!.id),
  });

  // Extraire l'ID du produit
  const productId = product?.id;

  // Utiliser useMemo pour déterminer le statut favori
  const isFavoriteFromServer = useMemo(() => {
    return !!usersData.data?.favorite?.some((fav) => fav.id === productId);
  }, [usersData.data, productId]); // Utiliser productId au lieu de product?.id

  // Gestion optimiste du favori
  const [optimisticFavorite, setOptimisticFavorite] = useState<boolean | null>(null);
  const finalFavorite = optimisticFavorite !== null ? optimisticFavorite : isFavoriteFromServer;

  const toggleFavorite = (id: number) => {
    const newFavoriteState = !finalFavorite;
    setOptimisticFavorite(newFavoriteState);
    
    userData.mutate([id], {
      onError: () => {
        setOptimisticFavorite(!newFavoriteState);
      },
      onSuccess: () => {
        setOptimisticFavorite(null);
        usersData.refetch();
      },
    });
  };

  function isNewProduct(product: Product): boolean {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return (
      product.variants?.some((variant) => {
        const createdAt = new Date(variant.createdAt);
        return createdAt >= sevenDaysAgo;
      }) ?? false
    );
  }

  const isLowStock = (variant: ProductVariant | undefined): boolean => {
    if (!variant || !variant.stock) return false;
    const totalStock = variant.stock.reduce(
      (sum, stock) => sum + (stock.quantity || 0),
      0
    );
    return totalStock <= 5; // Seuil de stock faible
  };

  if (!product || !variant) return null;

  return (
    <div className="flex flex-col gap-4 h-full justify-between shadow-xl bg-gray-50 p-2">
      <div className="relative flex gap-3 w-full h-auto">
        {isNewProduct(product) && (
          <div className="absolute top-0 left-0 flex items-center justify-center p-1 ms:p-2 rounded-sm bg-[#FFFEF8] text-primary text-[10px] md:text-[12px] lg:text-[14px] z-10">
            {t("new")}
          </div>
        )}
        <div className="absolute z-10 top-[-10px] right-[-10px] flex items-center justify-between">
          {user ? (
            address ? (
              <Button
                onClick={() => toggleFavorite(product.id)}
                variant={"ghost"}
                className={`h-5 w-5 md:h-9 md:w-9 ${
                  finalFavorite
                    ? "bg-red-500 hover:bg-red-500/80 hover:text-white text-white"
                    : "bg-white/50 text-gray-600"
                }`}
                disabled={userData.isPending}
              >
                <LucideHeart size={10} />
              </Button>
            ) : (
              <AddAddress>
                <Button
                  className={`h-5 w-5 md:h-9 md:w-9 ${
                    finalFavorite
                      ? "bg-red-500 hover:bg-red-500/80 hover:text-white text-white"
                      : "bg-white/50 text-gray-600"
                  }`}
                >
                  <LucideHeart size={10} />
                </Button>
              </AddAddress>
            )
          ) : (
            <Button
              onClick={() => router.push("/auth/login")}
              className={`h-5 w-5 md:h-9 md:w-9 ${
                finalFavorite
                  ? "bg-red-500 hover:bg-red-500/80 hover:text-white text-white"
                  : "bg-white/50 text-gray-600"
              }`}
            >
              <LucideHeart size={10} />
            </Button>
          )}
        </div>

        {address ? (
          <div className="relative w-full h-full ">
            <Link href={`/catalog/${product.slug}`}>
              {variant.imgUrl ? (
                <img
                  src={
                    variant.imgUrl.includes("http")
                      ? variant.imgUrl
                      : `${env?.replace(/\/$/, "")}/${variant.imgUrl.replace(
                          /^\//,
                          ""
                        )}`
                  }
                  alt={variant.name}
                  className="w-full aspect-square h-auto object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-auto aspect-square object-cover bg-gray-100 text-white">
                  <LucideDatabase size={80} />
                </div>
              )}
            </Link>
          </div>
        ) : (
          <AddAddress>
            <Button className="relative px-0 py-0 w-full h-full bg-transparent hover:bg-transparent rounded-none">
              {variant.imgUrl ? (
                <img
                  src={
                    variant.imgUrl.includes("http")
                      ? variant.imgUrl
                      : `${env?.replace(/\/$/, "")}/${variant.imgUrl.replace(
                          /^\//,
                          ""
                        )}`
                  }
                  alt={variant.name}
                  className="w-full aspect-square h-auto object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-auto aspect-square object-cover bg-gray-100 text-white">
                  <LucideDatabase size={80} />
                </div>
              )}
            </Button>
          </AddAddress>
        )}

        {((variant.stock &&
          variant.stock[0] &&
          variant.stock[0].quantity <= 0) ||
          variant.stock.length <= 0) && (
          <div className="absolute bottom-2 right-0 left-0 bg-red-700 w-fit p-2 z-10">
            <p className="text-white text-sm font-semibold">
              {t("outOfStock")}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-1">
          <p className="text-[14px] text-gray-700 leading-[100%]">
            {product.name}
          </p>
          <div className="flex flex-wrap md:flex-row md:items-center gap-1 pb-2">
            {product?.variants?.slice(0, 2).map((va, idx) =>
              address ? (
                <AddToCard
                  key={va.id ?? idx}
                  product={product}
                  variant={variant}
                  setVariant={setVariant}
                  promotions={promotions}
                >
                  <div
                    key={va.id ?? idx}
                    onClick={() => (isLowStock(va) ? null : setVariant(va))}
                    className={`${
                      isLowStock(va) ? "cursor-not-allowed" : ""
                    } text-[12px] shadow rounded-full px-2 cursor-pointer ${
                      variant?.id === va.id
                        ? "bg-orange-400/70 text-white"
                        : ""
                    }`}
                  >
                    {va.name + " " + va.quantity + " " + va.unit}
                  </div>
                </AddToCard>
              ) : (
                <AddAddress key={va.id ?? idx}>
                  <div
                    key={va.id ?? idx}
                    onClick={() => setVariant(va)}
                    className={`text-[12px] shadow rounded-full px-2 cursor-pointer ${
                      variant?.id === va.id
                        ? "bg-orange-400/70 text-white"
                        : ""
                    }`}
                  >
                    {va.name + " " + va.quantity + " " + va.unit}
                  </div>
                </AddAddress>
              )
            )}
            {address ? (
              (product?.variants?.length ?? 0) > 2 && (
                <AddToCard
                  product={product}
                  variant={variant}
                  setVariant={setVariant}
                  promotions={promotions}
                >
                  <div className="h-[18px] w-4 flex items-center justify-center cursor-pointer">
                    +
                  </div>
                </AddToCard>
              )
            ) : (
              <AddAddress>
                <Button
                  variant={"ghost"}
                  className="px-2 py-1 h-[26px] hover:bg-gray-50 hover:text-black rounded-[20px] w-fit"
                >
                  <div className="h-[18px] w-4 flex items-center justify-center">
                    +
                  </div>
                </Button>
              </AddAddress>
            )}
          </div>
        </div>
        <div>
          <PriceDisplay
            price={variant.price}
            stocks={variant.stock?.map((s) => ({
              promotionId: s.promotionId,
              productVariantId: s.productVariantId,
            }))}
            variants={product.variants}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductComp;
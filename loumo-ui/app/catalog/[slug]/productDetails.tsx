"use client";

import GridProduct from "@/components/Home/GridProduct";
import { AddAddress } from "@/components/select-address";
import Loading from "@/components/setup/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceDisplay } from "@/components/ui/promotion-price";
import { useStore } from "@/providers/datastore";
import CategoryQuery from "@/queries/category";
import ProductQuery from "@/queries/product";
import PromotionQuery from "@/queries/promotion";
import ShopQuery from "@/queries/shop";
import StockQuery from "@/queries/stock";
import UserQuery from "@/queries/user";
import { ProductVariant } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LucideDatabase, LucideHeart, LucideShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProductDetails = ({ slug }: { slug: string }) => {
  const product = new ProductQuery();
  const promotion = new PromotionQuery();
  const category = new CategoryQuery();
  const stock = new StockQuery();
  const shop = new ShopQuery();
  const userQuery = new UserQuery();

  const { user, address, addOrderItem } = useStore();
  const addressId = address?.zoneId;

  const t = useTranslations("Catalog.ProductDetail");
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [quantity, setQuantity] = useState(1);

  const userData = useMutation({
    mutationKey: ["favorite"],
    mutationFn: (productIds: number[]) =>
      userQuery.addProductsToFavorite(user!.id, productIds),
    onError: (error) => {
      console.error("Échec de l'ajout aux favoris :", error);
    },
  });

  const usersData = useQuery({
    queryKey: ["usersFetch"],
    queryFn: () => userQuery.getOne(user!.id),
  });

  const productData = useQuery({
    queryKey: ["productData", slug],
    queryFn: () => product.getOneBySlug(slug),
  });

  const promotionData = useQuery({
    queryKey: ["promotionFetchAll"],
    queryFn: () => promotion.getAll(),
  });

  const categoryData = useQuery({
    queryKey: ["categoryFetchAll"],
    queryFn: () => category.getAll(),
  });

  const stockData = useQuery({
    queryKey: ["stockFetchAll"],
    queryFn: () => stock.getAll(),
  });

  const shopData = useQuery({
    queryKey: ["shopFetchAll"],
    queryFn: () => shop.getAll(),
  });

  // Déterminer le variant courant initial
  const initialVariantId = useMemo(() => {
    return productData.data?.variants?.[0]?.id;
  }, [productData.data?.variants]);

  const [currentvar, setCurrentvar] = useState<number | undefined>(initialVariantId);

  // Mettre à jour currentvar lorsque initialVariantId change
  React.useEffect(() => {
    if (initialVariantId && initialVariantId !== currentvar) {
      setCurrentvar(initialVariantId);
    }
  }, [initialVariantId, currentvar]);

  const productItem = productData.data?.variants?.find((x) => x.id === currentvar);

  // Calcul de la disponibilité avec useMemo
  const isAvailableInZone = useMemo(() => {
    if (!stockData.data || !shopData.data || !currentvar || !addressId) return false;
    
    const currentVariantStocks = stockData.data.filter(
      (stock) => stock.productVariantId === currentvar
    );

    return currentVariantStocks.some((stock) => {
      const shop = shopData.data.find((s) => s.id === stock.shopId);
      return shop?.address?.zoneId === addressId;
    });
  }, [stockData.data, shopData.data, currentvar, addressId]);

  // Calcul du statut favori avec useMemo
  const isFavoriteFromServer = useMemo(() => {
    return !!usersData.data?.favorite?.some((fav) => fav.id === productData.data?.id);
  }, [usersData.data, productData.data?.id]);

  // Gestion optimiste du statut favori
  const [optimisticFavorite, setOptimisticFavorite] = useState<boolean | null>(null);
  
  // Déterminer l'état final du favori
  const finalFavorite = optimisticFavorite !== null ? optimisticFavorite : isFavoriteFromServer;

  const toggleFavorite = (id: number) => {
    const newFavoriteState = !finalFavorite;
    
    // Mise à jour optimiste immédiate
    setOptimisticFavorite(newFavoriteState);
    
    // Appel API
    userData.mutate([id], {
      onError: () => {
        // Revert en cas d'erreur
        setOptimisticFavorite(!newFavoriteState);
      },
      onSuccess: () => {
        // Réinitialiser l'état optimiste après succès
        setOptimisticFavorite(null);
        // Forcer le refetch des données utilisateur
        usersData.refetch();
      }
    });
  };

  if (productData.isLoading) return <Loading status="loading" />;
  if (productData.isError) return <Loading status="failed" />;

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const similaire = categoryData.data?.find((c) => c.id === productData.data?.categoryId);
  const proSim = similaire?.products?.filter((product) =>
    product.variants?.some((variant) =>
      variant.stock?.some((stock) => stock.shop?.address?.zoneId === addressId)
    )
  );

  const autreCat = categoryData.data?.find((x) => x.id !== productData.data?.categoryId);
  const autre = categoryData.data?.filter((x) => x.id === autreCat?.id).flatMap((x) => x.products);
  const proAutre = autre?.filter((product) =>
    product?.variants?.some((variant) =>
      variant.stock?.some((stock) => stock.shop?.address?.zoneId === addressId)
    )
  );

  const addToCart = () => {
    if (productItem) {
      addOrderItem({
        variant: productItem, 
        note: "",
        promotions: promotionData.data!
      }, quantity);
    }
  };

  return (
    <div className="w-full flex flex-col items-center overflow-clip">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-24 max-w-[1400px] w-full px-6 py-7">
        <div className="flex flex-col gap-4 md:gap-7">
          {productItem?.imgUrl ? (
            <img
              src={
                productItem.imgUrl.includes("http")
                  ? productItem.imgUrl
                  : `${env?.replace(/\/$/, "")}/${productItem.imgUrl.replace(/^\//, "")}`
              }
              alt={productItem.name}
              onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
              className="w-full h-auto aspect-[4/3] rounded-[20px] object-cover border p-3"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-auto aspect-[4/3] rounded-[20px] bg-gray-100 text-white">
              <LucideDatabase size={150} />
            </div>
          )}

          <section className="hidden md:grid overflow-x-auto mx-auto">
            <div className="inline-flex gap-3">
              {productData.data?.variants?.map((x: ProductVariant, i: number) => (
                <div
                  key={i}
                  onClick={() => setCurrentvar(x.id)}
                  className={`p-1 cursor-pointer ${currentvar === x.id ? "border-b-3 border-primary" : ""}`}
                >
                  <img
                    src={
                      x.imgUrl?.includes("http")
                        ? x.imgUrl
                        : `${env?.replace(/\/$/, "")}/${x.imgUrl?.replace(/^\//, "")}`
                    }
                    onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
                    alt={x.name}
                    className="max-w-[80px] md:max-w-[120px] w-full h-auto aspect-[4/3] rounded-[6px] border object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4 md:gap-7">
          <div className="flex flex-col gap-4 pb-5 border-b border-gray-200">
            <h3 className="text-black text-center md:text-start text-[28px]">{productData.data?.name}</h3>
            <div className="flex flex-col gap-2 md:gap-3 items-center md:items-start">
              <p>{t("options")}</p>
              <section className="grid overflow-x-auto pb-1">
                <div className="inline-flex gap-5">
                  {productData.data?.variants?.map((x: ProductVariant, i: number) => (
                    <div
                      key={i}
                      onClick={() => setCurrentvar(x.id)}
                      className={`cursor-pointer flex flex-col items-center justify-center rounded-[6px] px-3 py-2 w-fit h-fit ${currentvar === x.id ? "bg-primary text-white" : "bg-white text-black border border-gray-300"
                        }`}
                    >
                      <p className="text-[14px] md:text-[18px] text-nowrap">{`${x.name + " " + x.quantity + " " + x.unit}`}</p>
                    </div>
                  ))}
                </div>
              </section>

              <PriceDisplay
                price={productItem?.price}
                stocks={productItem?.stock?.map((s) => ({
                  promotionId: s.promotionId,
                  productVariantId: s.productVariantId,
                }))}
                variants={productData.data?.variants}
                className1="text-[28px] md:text-[36px] text-primary font-medium"
                className2="text-[20px] md:text-[28px] text-gray-500 font-normal line-through"
                quantity={quantity}
              />

              <div className="flex flex-row items-center gap-2">
                <Button type="button" onClick={decrement} variant="outline" className="w-8 h-8 p-0">-</Button>
                <Input
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || "1")))}
                  className="w-12 text-center"
                />
                <Button type="button" onClick={increment} variant="outline" className="w-8 h-8 p-0">+</Button>
              </div>

              <div className="w-full grid grid-cols-2 items-center gap-4">
                {address ? (
                  !isAvailableInZone ?
                    <Tooltip>
                      <TooltipTrigger className="w-full cursor-pointer">
                        <Button
                          onClick={addToCart}
                          disabled
                          className="h-9 md:h-12 w-full rounded-[24px]">
                          <LucideShoppingCart />
                          {t("addToCart")}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[150px]">{t("onlyAvailable")}</p>
                      </TooltipContent>
                    </Tooltip>
                    :
                    <Button
                      onClick={addToCart}
                      disabled={!isAvailableInZone} 
                      className="h-9 md:h-12 rounded-[24px] w-full">
                      <LucideShoppingCart />
                      {t("addToCart")}
                    </Button>
                ) : (
                  <AddAddress>
                    <Button className="h-9 md:h-12 rounded-[24px] ">{t("addToCart")}</Button>
                  </AddAddress>
                )
                }

                <Button
                  variant="outline"
                  className={`h-9 md:h-12 rounded-[24px] ${finalFavorite ? "bg-red-500 hover:bg-red-500/80 text-white" : "bg-white/50 text-gray-600"
                    }`}
                  onClick={() => toggleFavorite(productData.data!.id)}
                  disabled={userData.isPending}
                >
                  <LucideHeart size={12} />
                  {userData.isPending ? t("loading") : t("addToWishlist")}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="flex items-center gap-1">
              <p className="text-secondary text-[16px] font-semibold">{t("categories")}:</p>
              <p className="text-gray-700 text-[14px] font-normal">{similaire?.name}</p>
            </span>
            <span className="flex items-center gap-1">
              <p className="text-secondary text-[16px] font-semibold">{t("weight")}:</p>
              <p className="text-gray-700 text-[14px] font-normal">{productItem?.weight} Kg</p>
            </span>
            {
              productData.data?.description && productData.data?.description.length > 5 && <span className="flex flex-col gap-1">
                <p className="text-secondary text-[16px] font-semibold capitalize">{t("description")}:</p>
                <p className="text-gray-700 text-[14px] font-normal first-letter:uppercase">{productData.data?.description}</p>
              </span>
            }
          </div>
        </div>
      </div>

      {similaire?.products && similaire?.products?.length >= 1 && (
        <GridProduct
          title={t("dans") + similaire.name}
          products={proSim}
          isLoading={productData.isLoading}
          isSuccess={productData.isSuccess}
          promotions={promotionData.data}
        />
      )}

      {autreCat && autreCat.products && autreCat.products?.length > 1 && (
        <GridProduct
          title={autreCat.name}
          products={proAutre}
          isLoading={productData.isLoading}
          isSuccess={productData.isSuccess}
          promotions={promotionData.data}
        />
      )}

      {/* <ReviewsProduct /> */}
    </div>
  );
};

export default ProductDetails;
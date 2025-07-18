"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product, ProductVariant, Promotion } from "@/types/types";
import { LucideDatabase, LucideShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "../ui/input";
import { useStore } from "@/providers/datastore";
import { PriceDisplay } from "../ui/promotion-price";

interface Props {
  children: React.JSX.Element;
  product: Product | undefined;
  variant: ProductVariant | undefined;
  setVariant: Dispatch<SetStateAction<ProductVariant | undefined>>;
  initialQuantity?: number;
  promotions: Promotion[] | undefined;
}

export function AddToCard({ children, product, variant, setVariant, initialQuantity = 1, promotions }: Props) {
  const { addOrderItem, currentOrderItems } = useStore();
  const t = useTranslations("Catalog.Cart");
  const [quantity, setQuantity] = useState(initialQuantity);
  const env = process.env.NEXT_PUBLIC_API_BASE_URL

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const addToCart = () => {
    if (variant) {
      addOrderItem({
        variant, note: "",
        promotions: promotions!
      }, quantity);
      console.log(currentOrderItems)
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-full">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            {t("add")}
            {!!((variant?.stock && variant?.stock[0] && variant?.stock[0].quantity <= 0) || (variant?.stock && variant?.stock.length <= 0)) && (
                <div className='bg-red-700 p-2 z-10 w-fit'>
                  <p className='text-white text-sm font-semibold'>{t("outOfStock")}</p>
                </div>
              )}
            </DialogTitle>
        </DialogHeader>
        <div className="flex flex-row gap-3 w-full">
          {variant?.imgUrl ? (
            <img
              src={variant.imgUrl.includes("http") ? variant.imgUrl : `${env}/${variant.imgUrl}`}
              alt={variant.name}
              onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
              className="w-[75px] h-[75px] aspect-square"
            />
          ) : (
            <div className="flex items-center justify-center w-[75px] h-[75px] aspect-square bg-gray-100 text-white">
              <LucideDatabase size={40} />
            </div>
          )}

          <div className="flex flex-col gap-2 flex-1 w-full">
              <p className="text-[16px] text-gray-900 font-semibold">{product?.name}</p>
            <div className="pb-1 w-full">
              <div className="inline-flex flex-wrap gap-2">
                {product?.variants?.map((va, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    onClick={() => setVariant(va)}
                    className={`px-2 py-1 h-[26px] ${variant?.id === va.id
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {va.name}
                  </Button>
                ))}
              </div>
            </div>

            <PriceDisplay
              price={variant?.price}
              stocks={variant?.stock?.map(s => ({
                promotionId: s.promotionId,
                productVariantId: s.productVariantId,
              }))}
              variants={product?.variants}
              quantity={quantity}
            />

            {/* <div className="flex gap-1 items-center">
              <p className="text-[20px] font-bold">{variant?.price} FCFA</p>
            </div> */}

            <div className="flex flex-row items-center gap-2">
              <Button type="button" onClick={decrement} variant="outline" className="w-8 h-8 p-0">
                -
              </Button>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || "1")))}
                className="w-12 text-center px-0"
              />
              <Button type="button" onClick={increment} variant="outline" className="w-8 h-8 p-0">
                +
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button disabled={!!((variant?.stock && variant?.stock[0] && variant?.stock[0].quantity <= 0) || (variant?.stock && variant?.stock.length <= 0))} onClick={addToCart}>
            <LucideShoppingCart size={16} className="mr-2" />
            {t("add")}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">{t("close")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

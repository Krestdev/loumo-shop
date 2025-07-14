import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useStore } from "@/providers/datastore"
import ProductQuery from "@/queries/product"
import { useQuery } from "@tanstack/react-query"
import { LucideDatabase } from "lucide-react"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "../ui/promotion-price"
import { useRouter } from "next/navigation"

interface Props {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function CartSheet({ open, setOpen }: Props) {
  const t = useTranslations("Cart");
  const { currentOrderItems } = useStore();
  const router = useRouter();
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;

  const product = new ProductQuery()
  const productData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAll(),
  })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="max-w-[340px] w-full max-h-[1080px] h-full overflow-y-auto flex flex-col justify-between">
        <div className="flex flex-col">
          <SheetHeader>
            <SheetTitle className="text-primary text-[36px] font-semibold border-b border-gray-200">
              {t("cart")}
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2">
            {currentOrderItems.map((item, i) => {
              const quantity = item.quantity || 1
              const product = productData.data?.find(
                (p) => p.id === item.productVariant?.productId
              )

              return (
                <div
                  key={i}
                  className="flex gap-2 px-4 py-3 rounded-[8px]"
                >
                  {item.productVariant?.imgUrl ? (
                    <img
                      src={
                        item.productVariant?.imgUrl.includes("http")
                          ? item.productVariant?.imgUrl
                          : `${env}/${item.productVariant?.imgUrl}`
                      }
                      alt={item.productVariant?.name}
                      className="w-[75px] h-[75px] rounded-[8px]"
                    />
                  ) : (
                    <div className="w-[75px] h-[75px] rounded-[8px] flex items-center bg-gray-200">
                      <LucideDatabase size={36} />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <p className="text-[16px] text-gray-900 font-semibold">{`(${quantity}x) ${product?.name} (${item.productVariant?.name})`}</p>
                    <PriceDisplay
                      price={item.productVariant?.price}
                      stocks={item.productVariant.stock?.map((s) => ({
                        promotionId: s.promotionId,
                        productVariantId: s.productVariantId,
                      }))}
                      variants={product?.variants}
                      quantity={quantity}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <Button onClick={() => router.push("/cart")}>{t("checkout")}</Button>
      </SheetContent>
    </Sheet>
  )
}

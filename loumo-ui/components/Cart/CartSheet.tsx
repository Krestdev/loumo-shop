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
import { LucideDatabase, Plus, Minus, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "../ui/promotion-price"
import { useRouter } from "next/navigation"
import PromotionQuery from "@/queries/promotion"
import { XAF } from "@/lib/utils"

interface Props {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function CartSheet({ open, setOpen }: Props) {
    const t = useTranslations("Cart");
    const {
        currentOrderItems,
        removeOrderItem,
        incrementOrderItem,
        decrementOrderItem,
        clearCart
    } = useStore();
    const router = useRouter();
    const env = process.env.NEXT_PUBLIC_API_BASE_URL;

    const product = new ProductQuery()
    const productData = useQuery({
        queryKey: ["productFetchAll"],
        queryFn: () => product.getAll(),
    })

    const promotion = new PromotionQuery()
    const promotionData = useQuery({
        queryKey: ["promotionFetchAll"],
        queryFn: () => promotion.getAll(),
    })

    const subtotal = currentOrderItems.reduce((total, item) => {
        const price = item.productVariant?.price || 0;
        const quantity = item.quantity || 1;
        return total + (price * quantity);
    }, 0);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="max-w-[340px] w-full max-h-[1080px] h-full overflow-y-auto flex flex-col">
                <div className="flex flex-col">
                    <SheetHeader>
                        <SheetTitle className="text-primary text-[36px] font-semibold border-b border-gray-200">
                            {t("cart")}
                        </SheetTitle>
                    </SheetHeader>

                    {currentOrderItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-gray-500">{t("emptyCart")}</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-2">
                                {currentOrderItems.map((item, i) => {
                                    const quantity = item.quantity || 1;
                                    const product = productData.data?.find(
                                        (p) => p.id === item.productVariant?.productId
                                    );

                                    return (
                                        <div
                                            key={i}
                                            className="flex gap-2 px-4 py-3 rounded-[8px] relative group"
                                        >
                                            {item.productVariant?.imgUrl ? (
                                                <img
                                                    src={
                                                        item.productVariant.imgUrl.includes("http")
                                                            ? item.productVariant.imgUrl
                                                            : `${env?.replace(/\/$/, "")}/${item.productVariant.imgUrl.replace(/^\//, "")}`
                                                    }
                                                    alt={item.productVariant?.name}
                                                    className="w-[75px] h-[75px] rounded-[8px] object-cover"
                                                />
                                            ) : (
                                                <div className="w-[75px] h-[75px] rounded-[8px] flex items-center bg-gray-200">
                                                    <LucideDatabase size={36} />
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1 flex-1">
                                                <p className="text-[16px] text-gray-900 font-semibold">
                                                    {product?.name} ({item.productVariant?.name + item.productVariant?.quantity + item.productVariant?.unit})
                                                </p>
                                                <PriceDisplay
                                                    price={item.productVariant?.price}
                                                    stocks={item.productVariant.stock?.map((s) => ({
                                                        promotionId: s.promotionId,
                                                        productVariantId: s.productVariantId,
                                                    }))}
                                                    variants={product?.variants}
                                                    quantity={quantity}
                                                />

                                                <div className="flex items-center gap-2 mt-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => decrementOrderItem(item.productVariant?.id, promotionData?.data ? promotionData.data : [])}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="text-sm w-6 text-center">{quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => incrementOrderItem(item.productVariant?.id, promotionData?.data ? promotionData.data : [])}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="top-1 right-1 transition-opacity"
                                                onClick={() => removeOrderItem(item.productVariant?.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-200 mt-4 pt-4 px-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">{t("subtotal")}</span>
                                    <span className="font-bold">{XAF.format(subtotal)}</span>
                                </div>

                                <Button
                                    variant="outline"
                                    className="text-red-500 mb-2 w-full"
                                    onClick={clearCart}
                                >
                                    {t("clearCart")}
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                {currentOrderItems.length > 0 && (
                    <Button
                        onClick={() => {
                            setOpen(false);
                            router.push("/cart");
                        }}
                        className="w-full mb-5 px-5 mt-10 mx-auto max-w-[330px]"
                    >
                        {t("checkout")}
                    </Button>
                )}
            </SheetContent>
        </Sheet>
    );
}
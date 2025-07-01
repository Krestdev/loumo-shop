import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Product, ProductVariant } from "@/types/types"
import { LucideDatabase, LucideShoppingCart } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"
import { Input } from "../ui/input"
import { useStore } from "@/providers/datastore"

interface Props {
    children: React.JSX.Element
    product: Product | undefined
    variant: ProductVariant | undefined
}

export function AddToCard({ children, product, variant }: Props) {

    const { addOrderItem } = useStore();
    const t = useTranslations("Catalog.Cart")
    const [variants, setVariant] = useState(variant)
    const [quantity, setQuantity] = useState(1)

    const increment = () => setQuantity(q => q + 1)
    const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1))

    const addToCart = () => {
        console.log("Ajouter au panier :", { productId: product?.id, variants, quantity })
        addOrderItem({ variant: variants!, note: "" }, quantity)
        console.log("Ajouté avec succès");
    }
    
    return (
        <Dialog>
            <DialogTrigger className="w-full" asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("add")}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-row gap-3">
                    {variants?.imgUrl ? (
                        <img src={variants.imgUrl} alt={variants.name} className="w-[75px] h-auto aspect-square" />
                    ) : (
                        <div className='flex items-center justify-center w-[75px] h-[75px] aspect-square bg-gray-100 text-white'>
                            <LucideDatabase size={40} />
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <p className="text-[16px] text-gray-900 font-semibold">{product?.name}</p>

                        <div className='flex flex-row items-center gap-2 flex-wrap'>
                            {product?.variants?.slice(0, 2).map((va, idx) => (
                                <Button
                                    key={idx}
                                    type="button"
                                    onClick={() => setVariant(va)}
                                    className='px-2 py-1 h-[26px]'
                                    variant={variants?.id === va.id ? "default" : "ghost"}
                                >
                                    {va.name}
                                </Button>
                            ))}
                            {(product?.variants?.length ?? 0) > 2 && (
                                <Link
                                    href={`/catalog/${product?.id}`}
                                    className='px-2 py-1 h-[26px] hover:bg-gray-50 rounded-[20px]'
                                >
                                    <div className='h-[18px] w-4 flex items-center justify-center'>+</div>
                                </Link>
                            )}
                        </div>

                        <div className='flex gap-1 items-center'>
                            <p className='text-[20px] font-bold'>{`${variants?.price} FCFA`}</p>
                            {/* Vous pouvez afficher l'ancien prix ici si nécessaire */}
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <Button type="button" onClick={decrement} variant="outline" className="w-8 h-8 p-0">-</Button>
                            <Input
                                // type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || "1")))}
                                className="w-12 text-center px-0"
                            />
                            <Button type="button" onClick={increment} variant="outline" className="w-8 h-8 p-0">+</Button>
                        </div>
                    </div>
                </div>
                <DialogFooter className="mt-4">
                    <Button onClick={() => addToCart()}>
                        <LucideShoppingCart size={16} className="mr-2" />
                        {t("add")}
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline">{t("close")}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

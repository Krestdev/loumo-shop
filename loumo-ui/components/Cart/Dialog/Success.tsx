"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { OrderInvoice } from "../OrderInvoice";
import { Order, ProductVariant } from "@/types/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ProductVariantQuery from "@/queries/productVariant";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/setup/loading";
import Pdfview from "./Pdfview";
import OrderQuery from "@/queries/order";
import ProductQuery from "@/queries/product";
import { format } from "date-fns";

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    order?: Order;
}

export function Success({ open, setOpen, order }: Props) {
    const t = useTranslations("Cart.Success");
    const t1 = useTranslations("Cart.Invoice");

    const variantQuery = new ProductVariantQuery();
    const orders = new OrderQuery();
    const product = new ProductQuery();

    const productData = useQuery({
        queryKey: ["productFetchAll"],
        queryFn: () => product.getAll(),
    });

    const ordersData = useQuery({
        queryKey: ["ordersFetchAll"],
        queryFn: () => orders.getAll(),
    });

    const getVariants = useQuery({
        queryKey: ["variants"],
        queryFn: () => variantQuery.getAll(),
        refetchOnWindowFocus: false,
    });

    if (getVariants.isLoading || ordersData.isLoading) return <Loading status="loading" />;
    if (ordersData.isError || getVariants.isError || !getVariants.data) return <Loading status="failed" />;
    const fileName = `${t1("order")}_#${order?.id}_${order?.createdAt ? format(
        order.createdAt,
        "dd/MM/yyyy - HH:mm"
    ) : "-"}`

return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-full h-[700px] flex flex-col gap-4">
            <DialogHeader>
                <DialogTitle>{t("title")}</DialogTitle>
            </DialogHeader>
            <Pdfview
                order={ordersData.data?.find((x) => x.id === order?.id)}
                products={productData.data}
                getVariants={ordersData.data?.find((x) => x.id === order?.id)?.orderItems?.map((item) => getVariants.data?.find((x) => x.id === item.productVariantId)) as ProductVariant[]}
                translations={
                    {
                        title: t1("title"),
                        order: t1("order"),
                        of: t1("of"),
                        client: t1("client"),
                        name: t1("name"),
                        email: t1("email"),
                        phone: t1("phone"),
                        address: t1("address"),
                        zone: t1("zone"),
                        product: t1("product"),
                        quantity: t1("quantity"),
                        unitPrice: t1("unitPrice"),
                        total: t1("total"),
                        unknownP: t1("unknownProduct"),
                        subtotal: t1("subtotal"),
                        deliveryFee: t1("deliveryFee"),
                    }
                } />
            <DialogFooter>
                <PDFDownloadLink
                    document={
                        <OrderInvoice
                            order={order}
                            variants={ordersData.data?.find((x) => x.id === order?.id)?.orderItems?.map((item) => getVariants.data?.find((x) => x.id === item.productVariantId)) as ProductVariant[]}
                            zones={Array.isArray(order?.address?.zone) ? order.address.zone : []}
                            translations={
                                {
                                    title: t1("title"),
                                    order: t1("order"),
                                    of: t1("of"),
                                    client: t1("client"),
                                    name: t1("name"),
                                    email: t1("email"),
                                    phone: t1("phone"),
                                    address: t1("address"),
                                    zone: t1("zone"),
                                    product: t1("product"),
                                    quantity: t1("quantity"),
                                    unitPrice: t1("unitPrice"),
                                    total: t1("total"),
                                    unknownP: t1("unknownProduct"),
                                    subtotal: t1("subtotal"),
                                    deliveryFee: t1("deliveryFee"),
                                }
                            }
                            products={productData.data}
                        />
                    }
                    fileName={fileName}
                    className="w-fit"
                >
                    {({ loading }) =>
                        <Button>{loading ? "Génération..." : "Télécharger PDF"}</Button>
                    }
                </PDFDownloadLink>
                <Button variant={"outline"} className="hover:bg-gray-50 hover:text-black" onClick={() => setOpen(false)}>{t("close")}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);
}

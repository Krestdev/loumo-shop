"use client";
import { OrderInvoice } from "@/components/Cart/OrderInvoice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { XAF } from "@/lib/utils";
import OrderQuery from "@/queries/order";
import ProductQuery from "@/queries/product";
import ProductVariantQuery from "@/queries/productVariant";
import PromotionQuery from "@/queries/promotion";
import ZoneQuery from "@/queries/zone";
import { Order, ProductVariant } from "@/types/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CheckCircle,
  CreditCard,
  MapPin,
  Package,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

type Props = {
  ord: Order;
  addressId: number;
  children: React.JSX.Element;
};

function ViewOrder({ ord, addressId, children }: Props) {
  const t = useTranslations("Profile.Orders.Detail")
  const t1 = useTranslations("Cart.Invoice")
  const variantQuery = new ProductVariantQuery();
  const promotion = new PromotionQuery();
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

  const promotionData = useQuery({
    queryKey: ["promotionFetchAll"],
    queryFn: () => promotion.getAll(),
  });

  const getVariants = useQuery({
    queryKey: ["variants"],
    queryFn: () => variantQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const zoneQuery = new ZoneQuery();
  const getZone = useQuery({
    queryKey: ["zones"],
    queryFn: () => zoneQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const order = ordersData.data?.find(x => x.id === ord.id)

  return (
    order &&
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[720px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {`${t("orderDetails")} ${order.id}`}
          </DialogTitle>
          <DialogDescription>
            {`${t("orderDate")} ${format(order.createdAt, "dd/MM - HH:mm")}`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t("delivery")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>{`${t("zone")}:`}</strong>{" "}
                {getZone.data?.find(x => x.id === addressId)?.name}
              </p>
              {getZone.data?.flatMap(x => x.addresses).find(x => x.id === addressId) && (
                <p>
                  <strong>{`${t("address")}:`}</strong> {getZone.data?.flatMap(x => x.addresses).find(x => x.id === addressId)?.street}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                {`${t("orderedProducts")}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getVariants.isSuccess && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{`${t("product")}`}</TableHead>
                      <TableHead>{`${t("quantity")}`}</TableHead>
                      <TableHead>{`${t("unitPrice")}`}</TableHead>
                      <TableHead>{`${t("total")}`}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.orderItems ? (
                      order.orderItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{`${getVariants.data.find(
                            (x) => x.id === item.productVariantId
                          )?.name
                            }`}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {
                              (() => {
                                const variant = getVariants.data.find(
                                  (x) => x.id === item.productVariantId
                                );

                                if (!variant) return XAF.format(0);

                                const now = new Date();

                                // On récupère l'ID de promotion (si présent dans un stock du variant)
                                const promoId = variant.stock.find(s => s.promotionId)?.promotionId;

                                // On récupère la promotion associée
                                const promo = promotionData.data?.find(p => p.id === promoId);

                                const isActivePromo = promo &&
                                  new Date(promo.expireAt) > now;

                                const promoPrice = isActivePromo
                                  ? variant.price - (variant.price * promo.percentage) / 100
                                  : variant.price;

                                return XAF.format(promoPrice);
                              })()
                            }
                          </TableCell>


                          {item.total && <TableCell>{XAF.format(item.total)}</TableCell>}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4}>
                          {`${t("noProduct")}`}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>{`${("subtotal")}:`}</span>
                  <span>{XAF.format(order.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{`${t("deliveryFee")}`}</span>
                  <span>{XAF.format(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>{`${t("total")}:`}</span>
                  <span>{XAF.format(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {`${t("paymentInfo")}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div>
                <div className="flex gap-2 items-center">
                  <strong>{`${t("status")}:`}</strong>
                  {!order.payment
                    ? <span className="text-destructive">{`${t("notPaid")}`}</span>
                    : order.payment.status === "ACCEPTED"
                      ? t("paid")
                      : order.payment.status === "PENDING"
                        ? t("pending")
                        : order.payment.status === "COMPLETED"
                          ? <span className="inline-flex gap-1 items-center font-semibold">{`${t("paid")}`} <CheckCircle size={12} className="text-green-600" /></span>
                          : <span className="text-destructive">{`${t("notPaid")}`}</span>}
                </div>
                <p>
                  <strong>{`${t("amount")}: `}</strong> {XAF.format(order.total)}
                </p>
                <p>
                  <strong>{`${t("orderDateFull")}: `}</strong>
                  {format(order.createdAt, "dd/MM/yyyy - HH:mm")}
                </p>
              </div>
              {/* <Button>
                <Download className="mr-2 h-4 w-4" />
                {`${t("downloadInvoice")}`}
              </Button> */}
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end gap-2">

          <PDFDownloadLink
            document={
              <OrderInvoice
                order={order}
                products={productData.data}
                variants={order.orderItems?.map((item) => getVariants.data?.find((x) => x.id === item.productVariantId)) as ProductVariant[]}
                zones={order.address.zone}
                translations={{
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
                  conditions: t1("conditions"),
                  status: t1("status"),
                  lieu: t1("lieu"),
                }}
              />
            }
            fileName={`facture - loumo - ${order.id}.pdf`}
          >
            {({ loading }) => (
              <Button>{loading ? "Génération..." : "Télécharger la facture"}</Button>
            )}
          </PDFDownloadLink>
          <DialogClose asChild>
            <Button variant={"outline"}>
              {`${t("close")}`}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog >
  );
}

export default ViewOrder;
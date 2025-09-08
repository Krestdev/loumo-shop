"use client";

import CartComp from "@/components/Cart/CartComp";
import { OrderFailed } from "@/components/Cart/Dialog/OrderFailed";
import OrderPending from "@/components/Cart/Dialog/OrderPending";
import { Success } from "@/components/Cart/Dialog/Success";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import PaymentQuery from "@/queries/payment";
import PromotionQuery from "@/queries/promotion";
import UserQuery from "@/queries/user";
import ZoneQuery from "@/queries/zone";
import { Order, OrderItem, Payment } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Values {
  tel: string;
  paymentMethod: "cash" | "orange" | "mtn";
  paymentNumber?: string | undefined;
}

const Page = () => {
  const orderQuery = new OrderQuery();
  const paiementQuery = new PaymentQuery();
  const userQuery = new UserQuery();
  const promotion = new PromotionQuery();
  const zoneQuery = new ZoneQuery();


  const { currentOrderItems, user, setUser, address, orderNote, setOrderNote, successMobileOpen, setFailedPaiement, setPendingPaiement, setSuccessMobileOpen } = useStore();
  const [failedOpen, setFailedOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [orders, setOrders] = useState<Order | undefined>();

  const createOrder = useMutation({
    mutationKey: ["createOrder"],
    mutationFn: (
      newOrder: Omit<Order, "id" | "orderItems" | "createdAt" | "address" | "user" | "ref"> & {
        orderItems?: (Partial<OrderItem> & { shopId?: number })[];
      }
    ) => orderQuery.create(newOrder),
  });

  const createPaiement = useMutation({
    mutationKey: ["createPayment"],
    mutationFn: (
      data: Omit<Payment, "id" | "ref"> & { orderId: number }) =>
      paiementQuery.create(data),
  });

  const promotionData = useQuery({
    queryKey: ["promotionFetchAll"],
    queryFn: () => promotion.getAll(),
  });

  const userData = useQuery({
    queryKey: ["userData"],
    queryFn: () => {
      if (user) return userQuery.getOne(user.id);
      return null;
    }
  });

  const zoneData = useQuery({
    queryKey: ["zoneData"],
    queryFn: () => zoneQuery.getAll()
  })

  const frais = zoneData.data?.find(x => x.id === address?.zoneId)?.price ?? 0

  const handleSubmitOrder = (value: Values) => {
    if (value.paymentMethod === "cash") {
      console.log("Paiement en espèces");
      if (user && address?.id && currentOrderItems.length > 0) {
        const total = frais + currentOrderItems.reduce((acc, item) => acc + (item.total || 0), 0);
        const weight = currentOrderItems.reduce((acc, item) => acc + (item.productVariant.weight * item.quantity), 0);

        const payload: Omit<Order, "id" | "createdAt" | "address" | "user" | "ref"> = {
          userId: user.id,
          addressId: address.id,
          note: orderNote,
          total,
          status: "PENDING",
          weight,
          deliveryFee: frais,
          orderItems: currentOrderItems.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            note: item.note,
            total: item.total,
            shopId: item.productVariant.stock[0].shopId
          })),
        };

        setPendingOpen(true);

        createOrder.mutate(payload, {
          onSuccess: (order) => {
            console.log(order);
            
            console.log("✅ Order received from server:", order);
            setOrders(order);
            setPendingOpen(false);
            setSuccessMobileOpen(true);
            setOrderNote("");
          },
          onError: (error) => {
            console.log("order Note", orderNote)
            setPendingOpen(false);
            console.error("❌ Error creating order:", error);
            setFailedOpen(true);
          },
        });

        userData.refetch().then(res => {
          if (res.data) setUser(res.data);
        });
      }
    } else {
      console.log(`Paiement par ${value.paymentMethod}`);
      if (user && address?.id && currentOrderItems.length > 0) {
        const total = frais + currentOrderItems.reduce((acc, item) => acc + (item.total || 0), 0);
        const weight = currentOrderItems.reduce((acc, item) => acc + (item.productVariant.weight * item.quantity), 0);

        const payload: Omit<Order, "id" | "createdAt" | "address" | "user" | "ref"> = {
          userId: user.id,
          addressId: address.id,
          note: orderNote,
          total,
          status: "PENDING",
          weight,
          deliveryFee: frais,
          orderItems: currentOrderItems.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            note: item.note,
            total: item.total,
            shopId: item.productVariant.stock[0].shopId
          })),
        };

        // setPendingOpen(true);
        setPendingPaiement(true);

        createOrder.mutate(payload, {
          onSuccess: (order) => {
            console.log("✅ Order received from server:", order);
            createPaiement.mutate({
              name: `Paiement ${order.ref}`,
              status: "PROCESSING",
              orderId: order.id,
              total: total,
              tel: `237${value.paymentNumber!}`,
              method: value.paymentMethod === "mtn" ? "MTN_MOMO_CMR" : "ORANGE_CMR"
            }, {
              onSuccess: (payment) => {
                if (payment.status === "COMPLETED") {
                  setSuccessMobileOpen(true);
                } else if (payment.status === "FAILED") {
                  setFailedPaiement(true);
                } else {
                  setPendingPaiement(true);
                }
                // Je vais verifier si le paiement a réussi ou non sur un interval de 5 secondes
                const interval = setInterval(() => {

                  console.log("Nouvel appel de paiement");

                  paiementQuery.getOne(payment.id).then(res => {
                    if (res) {
                      if (res.status === "COMPLETED") {
                        setFailedOpen(false);
                        setSuccessMobileOpen(true);
                        clearInterval(interval);
                      } else if (res.status === "FAILED") {
                        setFailedOpen(true);
                        setFailedPaiement(true);
                        clearInterval(interval);
                      } else {
                        setFailedOpen(false);
                        setPendingPaiement(true);
                      }
                    }
                  })
                }, 5000);
              },
              onError: () => {
                setFailedOpen(true);
              }
            })
            setOrders(order);
            setOrderNote("");
          },
          onError: (error) => {
            console.log("order Note", orderNote)
            console.error("❌ Error creating order:", error);
          },
        });
      }
    }

  };

  return (
    <div className="w-full flex justify-center">
      <CartComp onValidate={handleSubmitOrder} promotions={promotionData.data} />

      {/* Debug affichage */}
      {orders && <pre className="hidden">{JSON.stringify(orders, null, 2)}</pre>}

      {/* Dialogs */}
      {orders && <Success open={successMobileOpen} setOpen={setSuccessMobileOpen} order={orders} />}
      <OrderFailed open={failedOpen} setOpen={setFailedOpen} />
      <OrderPending open={pendingOpen} setOpen={setPendingOpen} />
    </div>
  );
};

export default Page;

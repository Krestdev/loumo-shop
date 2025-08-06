"use client";

import CartComp from "@/components/Cart/CartComp";
import { Failed } from "@/components/Cart/Dialog/Failed";
import Pending from "@/components/Cart/Dialog/Pending";
import { Success } from "@/components/Cart/Dialog/Success";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import PromotionQuery from "@/queries/promotion";
import UserQuery from "@/queries/user";
import ZoneQuery from "@/queries/zone";
import { Order, OrderItem } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Page = () => {
  const orderQuery = new OrderQuery();
  const userQuery = new UserQuery();
  const promotion = new PromotionQuery();
  const zoneQuery = new ZoneQuery();


  const { currentOrderItems, user, setUser, resetOrderDraft, address, orderNote, setOrderNote } = useStore();
  const [successMobileOpen, setSuccessMobileOpen] = useState(false);
  const [failedOpen, setFailedOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [orders, setOrders] = useState<Order | undefined>();

  const createOrder = useMutation({
    mutationKey: ["createOrder"],
    mutationFn: (
      newOrder: Omit<Order, "id" | "orderItems" | "createdAt" | "address" | "user"> & {
        orderItems?: Partial<OrderItem>[];
      }
    ) => orderQuery.create(newOrder),
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

  const handleSubmitOrder = () => {
    console.log("order Note", orderNote)
    if (user && address?.id && currentOrderItems.length > 0) {
      const total = frais + currentOrderItems.reduce((acc, item) => acc + (item.total || 0), 0);
      const weight = currentOrderItems.reduce((acc, item) => acc + (item.productVariant.weight || 0), 0);

      const payload: Omit<Order, "id" | "createdAt" | "address" | "user"> = {
        userId: user.id,
        addressId: address.id,
        note: orderNote,
        total,
        status: "PENDING",
        weight,
        deliveryFee: 0,
        orderItems: currentOrderItems.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          note: item.note,
          total: item.total,
        })),
      };

      setPendingOpen(true);

      createOrder.mutate(payload, {
        onSuccess: (order) => {
          console.log("✅ Order received from server:", order);
          setOrders(order);
          setPendingOpen(false);
          resetOrderDraft();
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
  };

  return (
    <div className="w-full flex justify-center">
      <CartComp onValidate={handleSubmitOrder} promotions={promotionData.data} />

      {/* Debug affichage */}
      {orders && <pre className="hidden">{JSON.stringify(orders, null, 2)}</pre>}

      {/* Dialogs */}
      {orders && <Success open={successMobileOpen} setOpen={setSuccessMobileOpen} order={orders} />}
      <Failed open={failedOpen} setOpen={setFailedOpen} />
      <Pending open={pendingOpen} setOpen={setPendingOpen} />
    </div>
  );
};

export default Page;

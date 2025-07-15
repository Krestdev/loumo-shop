"use client";

import CartComp from "@/components/Cart/CartComp";
import { Failed } from "@/components/Cart/Dialog/Failed";
import Pending from "@/components/Cart/Dialog/Pending";
import { Success } from "@/components/Cart/Dialog/Success";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import PromotionQuery from "@/queries/promotion";
import UserQuery from "@/queries/user";
import { Order, OrderItem } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {  useState } from "react";

const Page = () => {
  const order = new OrderQuery();
  const userQuery = new UserQuery();
  const promotion = new PromotionQuery();

  const { currentOrderItems, user, setUser, resetOrderDraft, address } = useStore();
  const [successOpen, setSuccessOpen] = useState(false);
  const [failedOpen, setFailedOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);

  const createOrder = useMutation({
    mutationKey: ["createOrder"],
    mutationFn: (
      newOrder: Omit<Order, "id" | "orderItems" | "createdAt" | "address" | "user"> & {
        orderItems?: Partial<OrderItem>[];
      }
    ) => order.create(newOrder),
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
  })

  const handleSubmitOrder = () => {
    if (user && address?.id && currentOrderItems.length > 0) {

      const total = currentOrderItems.reduce(
        (acc, item) => acc + (item.total || 0),
        0
      );
      const weight = currentOrderItems.reduce((acc, item) => acc + (item.productVariant.weight || 0), 0)
      const payload: Omit<Order, "id" | "createdAt" | "address" | "user"> = {
        userId: user.id,
        addressId: address?.id as number,
        note: "note",
        total: total,
        status: "PENDING",
        weight: weight,
        deliveryFee: 0,
        orderItems: currentOrderItems.map((item) => {
          console.log(item.total);
          return ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            note: item.note,
            total: item.total,
          })
        }),
      };

      setPendingOpen(true);
      createOrder.mutate(payload,
        {
          onSuccess: () => {
            setPendingOpen(false);
            resetOrderDraft();
            setSuccessOpen(true);
            // setTimeout(() => {
            //   setSuccessOpen(false);
            //   router.push("/");
            // }, 5000);
          },
          onError: (error) => {
            setPendingOpen(false);
            console.error("Error creating order:", error);
            setFailedOpen(true);
          },
        }
      );
      userData.refetch().then(res => {
        if (res.data) setUser(res.data)
      })
    }
  };


  return (
    <div className="w-full flex justify-center">
      <CartComp onValidate={handleSubmitOrder} promotions={promotionData.data} />
      <Success open={successOpen} setOpen={setSuccessOpen} />
      <Failed open={failedOpen} setOpen={setFailedOpen} />
      <Pending open={pendingOpen} setOpen={setPendingOpen} />
    </div>
  );
};

export default Page;

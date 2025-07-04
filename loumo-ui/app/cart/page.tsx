"use client";

import CartComp from "@/components/Cart/CartComp";
import RequireAuth from "@/components/RequireAuth";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import PromotionQuery from "@/queries/promotion";
import UserQuery from "@/queries/user";
import { Order, OrderItem } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const Page = () => {
  const order = new OrderQuery();
  const userQuery = new UserQuery();
  const promotion = new PromotionQuery();

  const { currentOrderItems, user, setUser, resetOrderDraft } = useStore();
  const router = useRouter();

  const createOrder = useMutation({
    mutationKey: ["createOrder"],
    mutationFn: (
      newOrder: Omit<Order, "id" | "orderItems" | "createdAt" | "address"> & {
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
    console.log(user, user?.addresses?.[0].id, currentOrderItems.length);

    if (user && user?.addresses?.[0].id && currentOrderItems.length > 0) {

      const total = currentOrderItems.reduce(
        (acc, item) => acc + (item.total || 0),
        0
      );
      const weight = currentOrderItems.reduce((acc, item) => acc + (item.productVariant.weight || 0), 0)
      const payload: Omit<Order, "id" | "createdAt" | "address"> = {
        userId: user.id,
        addressId: user?.addresses?.[0].id as number,
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

      createOrder.mutate(payload,
        {
          onSuccess: () => {
            resetOrderDraft()
            router.push("/")
          }
        }
      );
      userData.refetch().then(res => {
        if (res.data) setUser(res.data)
      })
    }
  };


  return (
    <div className="w-full flex justify-center">
      <RequireAuth>
        <CartComp onValidate={handleSubmitOrder} promotions={promotionData.data} />
      </RequireAuth>
    </div>
  );
};

export default Page;

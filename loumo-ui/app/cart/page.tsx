"use client";
import CartComp from "@/components/Cart/CartComp";
import Loading from "@/components/setup/loading";
import { Button } from "@/components/ui/button";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import { Order, OrderItem } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import JsonView from "react18-json-view";

const Page = () => {

  const order = new OrderQuery();
  const productData = useMutation({
    mutationKey: ["product"],
    mutationFn: (
      newOrder: Omit<Order, "id" | "orderItems"> & {
        orderItems: Omit<OrderItem, "id" | "orderId">[];
      }
    ) => order.create(newOrder),
  });

  const { currentOrderItems, orderNote, orderAddressId, user } =
    useStore.getState();

  const handleSubmitOrder = () => {
    if (user && orderAddressId) {
      const payload = {
        userId: user.id,
        addressId: orderAddressId,
        note: orderNote,
        orderItems: currentOrderItems.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          note: item.note,
          total: item.total,
          deliveryId: item.deliveryId,
        })),
      };
      productData.mutate(payload);
    }
  };

    return (
      <div className="w-full flex justify-center">
        <CartComp />
        {/* <div className="max-w-3xl mx-auto mt-10">
          <h1 className="text-xl font-bold mb-4">Product Data</h1>
          <JsonView src={productData.data} />
          <Button onClick={handleSubmitOrder}>
            make order
          </Button>
        </div> */}
      </div>
    );
};

export default Page;

"use client";
import Loading from "@/components/setup/loading";
import { useStore } from "@/providers/datastore";
import ProductQuery from "@/queries/order";
import { Order, OrderItem } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import JsonView from "react18-json-view";

const Page = () => {
  const order = new ProductQuery();
  const productData = useMutation({
    mutationKey: ["orderCreate"],
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

  if (productData.isPending) {
    return <Loading status={"loading"} />;
  }

  if (productData.isError) {
    return <Loading status={"failed"} />;
  }

  if (productData.isSuccess) {
    return (
      <div>
        <div className="max-w-3xl mx-auto mt-10">
          <h1 className="text-xl font-bold mb-4">Product Data</h1>
          <JsonView src={productData.data} />
          <button type="button" onClick={handleSubmitOrder}>
            make order
          </button>
        </div>
      </div>
    );
  }

  return <Loading />;
};

export default Page;

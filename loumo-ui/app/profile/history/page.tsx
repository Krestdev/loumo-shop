"use client";
import HydrationGuard from "@/components/HydrationGuard";
import HistoryTable from "@/components/Profile/History/HistoryTable";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const { user } = useStore()
  const orders = new OrderQuery();
  const ordersData = useQuery({
    queryKey: ["ordersFetchAll"],
    queryFn: () => orders.getAll(),
  });

  return (
    <HydrationGuard>
      <div className="w-full flex justify-center">
        {user && ordersData.data && <HistoryTable all={true} orders={ordersData.data?.filter(x => x.userId === user.id)} />}
      </div>
    </HydrationGuard>
  );
};

export default Page;

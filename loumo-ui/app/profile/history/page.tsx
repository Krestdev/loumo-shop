"use client";
import HistoryTable from "@/components/Profile/History/HistoryTable";
import Loading from "@/components/setup/loading";
import { useStore } from "@/providers/datastore";
import React from "react";

const Page = () => {
  const { user } = useStore()
  console.log(user?.orders);
  
  return (
    <div className="w-full flex justify-center">
        {user && user.orders && <HistoryTable all={true} orders={user.orders.slice(0, 6)} />}

      {/* <div className="max-w-3xl mx-auto mt-10">
          <h1 className="text-xl font-bold mb-4">Order History Data</h1>
          <JsonView src={orderData.data} />
        </div> */}
    </div>
  );
};

export default Page;

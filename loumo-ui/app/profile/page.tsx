"use client";
import Profile from "@/components/Profile/Profile";
import Loading from "@/components/setup/loading";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import UserQuery from "@/queries/user";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {

  const { user } = useStore();
  const users = new UserQuery();
  const userData = useQuery({
    queryKey: ["userData"],
    queryFn: () => users.getOne(user!.id),
  });
  const orders = new OrderQuery();
  const ordersData = useQuery({
    queryKey: ["ordersFetchAll"],
    queryFn: () => orders.getAll(),
  });

  if (userData.isLoading || ordersData.isLoading) {
    return <Loading status={"loading"} />;
  }

  if (userData.isError || ordersData.isError) {
    return <Loading status={"failed"} />;
  }

  if (userData.isSuccess && ordersData.isSuccess) {
    return (
      <div className="w-full flex justify-center">
        <Profile users={userData.data} orders={ordersData.data} />
      </div>
    );
  }

  return <Loading />;
};

export default Page;
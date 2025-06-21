"use client";
import Loading from "@/components/setup/loading";
import UserQuery from "@/queries/user";
import { User } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import JsonView from "react18-json-view";

const Page = () => {
  const user = new UserQuery();
  const userData = useMutation({
    mutationKey: ["userRegister"],
    mutationFn: (
      data: Omit<User, "id"> & {
        addressList?: number[];
      }
    ) => user.register(data),
  });

  if (userData.isPending) {
    return <Loading status={"loading"} />;
  }

  if (userData.isError) {
    return <Loading status={"failed"} />;
  }

  if (userData.isSuccess) {
    return (
      <div>
        <div className="max-w-3xl mx-auto mt-10">
          <h1 className="text-xl font-bold mb-4">Product Data</h1>
          <JsonView src={userData.data} />
        </div>
      </div>
    );
  }

  return <Loading />;
};

export default Page;

"use client";
import Loading from "@/components/setup/loading";
import UserQuery from "@/queries/user";
import { User } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

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
    return <div>{JSON.stringify(userData.data)}</div>;
  }

  return <Loading />;
};

export default Page;

"use client";
import UserQuery from "@/queries/user";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const user = new UserQuery();
  const userData = useQuery({
    queryKey: ["userData"],
    queryFn: () => user.getUser(),
  });
  return <div>{JSON.stringify(userData.data)}</div>;
};

export default Page;

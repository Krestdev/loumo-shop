"use client";
import Loading from "@/components/setup/loading";
import UserQuery from "@/queries/user";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import JsonView from "react18-json-view";

const Page = () => {
  const user = new UserQuery();
  const userData = useQuery({
    queryKey: ["userData"],
    queryFn: () => user.getOne(1),
  });
  if (userData.isLoading) {
    return <Loading status={"loading"} />;
  }

  if (userData.isError) {
    return <Loading status={"failed"} />;
  }

  if (userData.isSuccess) {
    return (
      <div>
        <div className="max-w-3xl mx-auto mt-10">
          <h1 className="text-xl font-bold mb-4">Profile Data</h1>
          <JsonView src={userData.data} />
        </div>
      </div>
    );
  }

  return <Loading />;
};

export default Page;

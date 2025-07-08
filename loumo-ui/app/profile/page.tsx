"use client";
import Profile from "@/components/Profile/Profile";
import RequireAuth from "@/components/RequireAuth";
import Loading from "@/components/setup/loading";
import UserQuery from "@/queries/user";
import { useQuery } from "@tanstack/react-query";
import React from "react";

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
      <div className="w-full flex justify-center">
        <RequireAuth>
          <Profile user={userData.data} />
        </RequireAuth>
      </div>
    );
  }

  return <Loading />;
};

export default Page;

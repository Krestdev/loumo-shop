"use client";
import { useStore } from "@/providers/datastore";
import UserQuery from "@/queries/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import JsonView from "react18-json-view";

const Page = () => {
  const user = new UserQuery();
  const userData = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: { email: string; password: string }) => user.login(data),
  });

  const { setUser, resetUser } = useStore();

  useEffect(() => {
    const setToken = () => {
      if (userData.isSuccess) {
        setUser(userData.data.user);
        localStorage.setItem("token", userData.data?.token);
      }
    };
    
    return () => {
      setToken();
    };
  }, [userData.data]);

  return (
    <div>
      <button
        onClick={() =>
          userData.mutate({
            email: "john@example.com",
            password: "password123",
          })
        }
      >
        login
      </button>
      <JsonView src={userData.data}/>
    </div>
  );
};

export default Page;

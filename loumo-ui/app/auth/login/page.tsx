"use client";
import { useStore } from "@/providers/datastore";
import UserQuery from "@/queries/user";
<<<<<<< HEAD:app/auth/login/page.tsx
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import JsonView from "react18-json-view";
=======
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
>>>>>>> 32c9bc60907ef40b6eab8a244335b767ca2fcb9d:loumo-ui/app/auth/login/page.tsx

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
  }, [userData.data, setUser, userData.isSuccess]);

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

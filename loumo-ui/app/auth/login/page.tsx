"use client";
import { useStore } from "@/providers/datastore";
import UserQuery from "@/queries/user";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

const Page = () => {
  const user = new UserQuery();
  const userData = useMutation({
    mutationFn: (data: { email: string; password: string }) => user.login(data),
  });

  const { setUser } = useStore();

  useEffect(() => {
    const setToken = () => {
      if (userData.isSuccess) {
        setUser(userData.data.user);
        localStorage.setItem("token", userData.data?.token);
      }
      console.log(userData.data?.token);
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
      {JSON.stringify(userData.data)}
    </div>
  );
};

export default Page;

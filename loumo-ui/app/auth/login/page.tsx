"use client";
import LoginForm from "@/components/Auth/LoginForm";
import { useStore } from "@/providers/datastore";
import UserQuery from "@/queries/user";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

const Page = () => {
  const user = new UserQuery();
  const userData = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: { email: string; password: string }) => user.login(data),
  });

  const { setUser } = useStore();

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
      <LoginForm />
    </div>
  );
};

export default Page;

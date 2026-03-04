"use client";
import Profile from "@/components/Profile/Profile";
import Loading from "@/components/setup/loading";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import UserQuery from "@/queries/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { user } = useStore();
  const router = useRouter();
  const users = new UserQuery();
  const orders = new OrderQuery();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (!user) {
      router.push("/"); 
    }
  }, [user, router]);

  const userData = useQuery({
    queryKey: ["userData", user?.id],
    queryFn: () => {
      if (!user) throw new Error("Utilisateur non connecté");
      return users.getOne(user.id);
    },
    enabled: !!user, // N'exécuter la requête que si l'utilisateur est connecté
  });

  const ordersData = useQuery({
    queryKey: ["ordersFetchAll", user?.id],
    queryFn: () => {
      if (!user) throw new Error("Utilisateur non connecté");
      return orders.getAll();
    },
    enabled: !!user, // N'exécuter la requête que si l'utilisateur est connecté
  });

  // Si l'utilisateur n'est pas connecté, afficher un chargement pendant la redirection
  if (!user) {
    return <Loading status={"loading"} />;
  }

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
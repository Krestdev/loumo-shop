"use client";
import HydrationGuard from "@/components/HydrationGuard";
import HistoryTable from "@/components/Profile/History/HistoryTable";
import Loading from "@/components/setup/loading";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { user } = useStore();
  const router = useRouter();
  const orders = new OrderQuery();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (!user) {
      router.push("/"); 
    }
  }, [user, router]);

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
    return (
      <HydrationGuard>
        <Loading status={"loading"} />
      </HydrationGuard>
    );
  }

  if (ordersData.isLoading) {
    return (
      <HydrationGuard>
        <Loading status={"loading"} />
      </HydrationGuard>
    );
  }

  if (ordersData.isError) {
    return (
      <HydrationGuard>
        <Loading status={"failed"} />
      </HydrationGuard>
    );
  }

  return (
    <HydrationGuard>
      <div className="w-full flex justify-center">
        {ordersData.data && (
          <HistoryTable 
            all={true} 
            orders={ordersData.data.filter(x => x.userId === user.id)} 
          />
        )}
      </div>
    </HydrationGuard>
  );
};

export default Page;
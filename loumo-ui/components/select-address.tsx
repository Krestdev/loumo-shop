"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddressQuery from "@/queries/address";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LucideMapPin } from "lucide-react";
import { useStore } from "@/providers/datastore";
import { useTranslations } from "next-intl";
import UserQuery from "@/queries/user";
import { useState } from "react";

interface Props {
  children: React.JSX.Element;
}

export function AddAddress({ children }: Props) {
  const { user, setUser } = useStore();
  const t = useTranslations("Address");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const address = new AddressQuery();
  const addressData = useQuery({
    queryKey: ["addressData"],
    queryFn: () => address.getAll(),
  });

  const userQuery = new UserQuery();
  const userData = useMutation({
    mutationKey: ["update-user-address"],
    mutationFn: (data: { addressIds: number[] }) => userQuery.update(user!.id, data),
    onError: (error) => {
      console.error("Échec de la mise à jour :", error);
    },
  });

  const handleSubmit = () => {
    if (!selectedAddressId || !user) return;

    const existingIds = user.addresses?.map((a) => a.id) || [];
    const newIds = Array.from(new Set([...existingIds, selectedAddressId]));
    userData.mutate(
      { addressIds: newIds },
      {
        onSuccess: () => {
          const newAddress = addressData.data?.find((a) => a.id === selectedAddressId);
          if (!newAddress) return;

          const updatedUser = {
            ...user,
            addresses: [...(user.addresses || []), newAddress],
          };
          setUser(updatedUser);
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("address")}</DialogTitle>
        </DialogHeader>

        <Select onValueChange={(value) => setSelectedAddressId(parseInt(value))}>
          <SelectTrigger className="hidden md:flex group text-nowrap gap-2 items-center px-3 py-2 rounded-[20px] cursor-pointer hover:bg-gray-50 max-w-[250px] border-none shadow-none">
            <LucideMapPin size={20} className="flex-shrink-0" />
            <div className="flex flex-col w-full overflow-hidden text-left">
              <SelectValue placeholder={user?.addresses?.[0]?.street || t("select")} />
            </div>
          </SelectTrigger>
          <SelectContent>
            {addressData.data?.map((x, i) => (
              <SelectItem key={i} value={x.id.toString()}>
                {x.local}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button onClick={handleSubmit} disabled={!selectedAddressId || userData.isPending}>
              {t("save")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="outline">{t("close")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

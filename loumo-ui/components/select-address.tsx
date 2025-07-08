"use client";

import { useStore } from "@/providers/datastore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AddressQuery from "@/queries/address";
import UserQuery from "@/queries/user";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LucideMapPin, LucideChevronDown } from "lucide-react";
import React, { useState } from "react";

interface Props {
  children: React.JSX.Element;
}

export function AddAddress({ children }: Props) {
  const { address, setAddress, user } = useStore();
  const t = useTranslations("Address");

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const addressQ = new AddressQuery();
  const addressData = useQuery({
    queryKey: ["addressData"],
    queryFn: () => addressQ.getAll(),
  });

  const userQuery = new UserQuery();
  const updateAddressMutation = useMutation({
    mutationKey: ["update-user-address"],
    mutationFn: async (data: { addressIds: number[] }) => {
      if (!user?.id) throw new Error("Utilisateur non connecté");
      return userQuery.update(user.id, data);
    },
    onSuccess: () => {
      // Pas besoin de setAddress ici car on le fait déjà dans onSelect
    },
    onError: (error) => {
      console.error("Échec de la mise à jour :", error);
    },
  });

  const handleSubmit = () => {
    if (!address?.id) return;
    updateAddressMutation.mutate({ addressIds: [address.id] });
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

        <div className="flex flex-col gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="flex group text-nowrap gap-2 items-center px-3 py-2 rounded-[20px] cursor-pointer max-w-[250px] border border-input"
              >
                <LucideMapPin size={20} className="flex-shrink-0" />
                <div className="flex flex-col w-full overflow-hidden text-left hover:text-white">
                  <p className="text-xs text-muted-foreground hover:text-white">
                    {t("address")}
                  </p>
                  <span className="truncate text-sm">
                    {address?.street || t("select")}
                  </span>
                </div>
                <LucideChevronDown size={16} className="ml-auto opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[250px] h-[400px] p-0 overflow-y-auto z-50">
              <Command>
                <CommandInput
                  placeholder={t("search")}
                  value={search}
                  onValueChange={setSearch}
                  className="h-9"
                />
                <CommandEmpty>{t("noResult")}</CommandEmpty>
                <CommandGroup>
                  {addressData.data
                    ?.filter((addr) =>
                      addr.local
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )
                    .map((addr) => (
                      <CommandItem
                        key={addr.id}
                        value={addr.id.toString()}
                        onSelect={() => {
                          setAddress(addr);
                          setOpen(false);
                        }}
                      >
                        {addr.street}
                        {address?.id === addr.id && (
                          <LucideMapPin className="ml-auto h-4 w-4 opacity-50" />
                        )}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={handleSubmit}
            disabled={!address?.id || updateAddressMutation.isPending}
          >
            {t("save")}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

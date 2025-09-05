"use client";

import { useStore } from "@/providers/datastore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AddressQuery from "@/queries/address";
import { LucideMapPin } from "lucide-react";
import React, { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import ZoneQuery from "@/queries/zone";

interface Props {
  children: React.ReactNode;
}

export function AddAddress({ children }: Props) {
  const { address, setAddress } = useStore();
  const t = useTranslations("Address");

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const addressQ = new AddressQuery();
  const zoneQuery = new ZoneQuery();

  const zoneData = useQuery({
    queryKey: ["zoneData"],
    queryFn: () => zoneQuery.getAll()
  })
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addressData"],
    queryFn: () => addressQ.getAll(),
  });

  const filteredAddresses = zoneData.data
    ?.filter((zone) => zone.status === "ACTIVE")
    .flatMap((zone) => zone.addresses)
    .filter((addr) =>
      addr.street?.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (!a.street) return 1;
      if (!b.street) return -1;
      return a.street.localeCompare(b.street);
    });


  const handleSelectAddress = (addrId: number) => {
    const selectedAddr = addresses.find((addr) => addr.id === addrId);
    if (selectedAddr) {
      setAddress(selectedAddr);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="w-fit">{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] aspect-auto">
        <DialogHeader>
          <DialogTitle>{t("address")}</DialogTitle>
        </DialogHeader>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t("search")}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="py-4 text-center text-sm">
                {t("loading")}
              </div>
            ) : (
              <>
                <CommandEmpty>{t("noResult")}</CommandEmpty>
                <CommandGroup>
                  {filteredAddresses?.map((addr) => (
                    <CommandItem
                      key={addr.id}
                      value={addr.id.toString()}
                      className="cursor-pointer"
                      onSelect={() => handleSelectAddress(addr.id)}
                    >
                      <div className="flex items-center gap-2">
                        {addr.street}
                        {address?.id === addr.id && (
                          <LucideMapPin className="ml-auto opacity-50" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant={"ghost"}>
              {t("close")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
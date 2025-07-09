"use client";

import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LucideChevronDown, LucideMapPin, LucideSearch } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useStore } from "@/providers/datastore";
import AddressQuery from "@/queries/address";
import { useQuery } from "@tanstack/react-query";
import LocaleSwitcher from "./localSwitcher";
import CategoryQuery from "@/queries/category";
import ProductQuery from "@/queries/product";
import { ProductVariant } from "@/types/types";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";

interface Props {
  children: React.JSX.Element;
}

export function Menu({ children }: Props) {
  const [addressSearch, setAddressSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [selectOpen, setSelectOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { currentOrderItems, address, setAddress, user } = useStore();
  const t = useTranslations("Header");
  const router = useRouter();

  const addressQuery = new AddressQuery();
  const categoryQuery = new CategoryQuery();
  const productQuery = new ProductQuery();

  const addressData = useQuery({
    queryKey: ["addressFetchAll"],
    queryFn: () => addressQuery.getAll(),
  });

  const categoryData = useQuery({
    queryKey: ["categoryFetchAll"],
    queryFn: () => categoryQuery.getAll(),
  });

  const productData = useQuery({
    queryKey: ["productsFetchAll"],
    queryFn: () => productQuery.getAll(),
  });

  const isVariantVisible = (
    variant: ProductVariant,
    selectedZoneId: number | undefined
  ) => {
    if (!selectedZoneId) return true;
    return variant.stock?.some(
      (s) => s.shop?.address?.zoneId === selectedZoneId
    );
  };

  const visibleProducts = React.useMemo(() => {
    if (!productData.data) return [];
    return productData.data.filter((product) =>
      product.variants?.some((v) =>
        isVariantVisible(v, address?.zoneId ?? undefined)
      )
    );
  }, [productData.data, address]);

  const visibleCategories = React.useMemo(() => {
    if (!categoryData.data) return [];
    return categoryData.data.filter((cat) =>
      visibleProducts.some((prod) => prod.categoryId === cat.id)
    );
  }, [categoryData.data, visibleProducts]);

  const normalizeText = (text: string) => text.toLowerCase().trim();

  const filteredAddresses = React.useMemo(() => {
    if (!addressData.data) return [];
    if (!addressSearch.trim()) return addressData.data;

    const term = normalizeText(addressSearch);
    return addressData.data.filter((addr) =>
      normalizeText(addr.street).includes(term) ||
      normalizeText(addr.local || "").includes(term) ||
      normalizeText(addr.zone?.name || "").includes(term)
    );
  }, [addressData.data, addressSearch]);

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild className="flex md:hidden">
        {children}
      </DrawerTrigger>
      <DrawerContent className="md:hidden h-screen overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-sm min-h-screen flex flex-col overflow-y-auto pb-20">
          {!user && (
            <DrawerTitle className="sticky top-0 bg-white z-10">
              <div className="w-full flex flex-col items-center gap-2 px-6 py-3">
                <Button
                  onClick={() => router.push("/auth/login")}
                  className="w-full"
                >
                  {t("login")}
                </Button>
                <div className="flex items-center gap-2 w-full">
                  <div className="h-[1px] bg-gray-200 w-full" />
                  <p className="text-[10px] font-medium text-gray-200">
                    {t("or")}
                  </p>
                  <div className="h-[1px] bg-gray-200 w-full" />
                </div>
                <Button
                  onClick={() => router.push("/auth/register")}
                  className="w-full bg-black text-white"
                >
                  {t("register")}
                </Button>
              </div>
            </DrawerTitle>
          )}

          <div className="w-full flex flex-col items-start px-7 border-b">
            {currentOrderItems.length <= 0 ? (
              <Select
                open={selectOpen}
                onOpenChange={(open) => setSelectOpen(open)}
                onValueChange={(value) => {
                  const selected = addressData.data?.find(
                    (a) => a.id === parseInt(value)
                  );
                  if (selected) {
                    setAddress(selected);
                    setSelectOpen(false);
                    setAddressSearch("");
                  }
                }}
                value={address?.id?.toString()}
              >
                <SelectTrigger className="flex group text-nowrap gap-2 items-center px-3 py-2 rounded-[20px] cursor-pointer max-w-[250px] border border-input">
                  <LucideMapPin size={20} className="flex-shrink-0" />
                  <div className="flex flex-col w-full overflow-hidden text-left">
                    <p className="text-xs text-muted-foreground">
                      {t("address")}
                    </p>
                    <SelectValue placeholder={t("select")} />
                  </div>
                </SelectTrigger>

                <SelectContent className="overflow-y-auto max-h-[300px]">
                  <div className="sticky top-0 bg-white z-10 p-2 border-b" tabIndex={-1}>
                    <div className="relative">
                      <LucideSearch
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                      />
                      <Input
                        ref={inputRef}
                        type="search"
                        placeholder={t("search") + "..."}
                        value={addressSearch}
                        onChange={(e) => setAddressSearch(e.target.value)}
                        className="pl-7"
                        onFocus={() => setSelectOpen(true)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {filteredAddresses.length > 0 ? (
                    filteredAddresses.map((addr) => (
                      <SelectItem key={addr.id} value={addr.id.toString()}>
                        <div className="flex flex-col">
                          {addr.street && (
                            <span className="text-xs text-muted-foreground">
                              {addr.street}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      {t("noAddress")}
                    </div>
                  )}
                </SelectContent>
              </Select>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-not-allowed">
                    <LucideMapPin size={16} className="text-gray-300" />
                    <div className="flex flex-col w-full overflow-hidden text-left">
                      <p className="text-xs text-muted-foreground text-nowrap">
                        {t("address")}
                      </p>
                      <p className="text-sm text-black">{address?.street}</p>
                    </div>
                    <LucideChevronDown size={20} className="text-gray-300" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="flex flex-col gap-2 justify-center">
                  <p className="w-[150px]">{t("emptyCart")}</p>
                  <Button
                    variant="ghost"
                    className="bg-white text-black hover:bg-gray-50 hover:text-black"
                  >
                    {t("goCart")}
                  </Button>
                </TooltipContent>
              </Tooltip>
            )}
            <LocaleSwitcher />
          </div>

          <div className="flex flex-col">
            {visibleCategories.map((cat) => {
              const productsInCat = visibleProducts.filter(
                (p) => p.categoryId === cat.id
              );

              return (
                <div key={cat.id} className="flex flex-col py-5">
                  <div className="flex px-6 py-4 gap-2">
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="text-[18px] font-bold text-gray-900"
                    >
                      {cat.name}
                    </Link>
                  </div>
                  <div className="flex flex-col">
                    {productsInCat.map((p) => (
                      <div key={p.id} className="py-4 px-6">
                        <Link
                          href={`/catalog/${p.slug}`}
                          className="text-[16px] text-gray-900"
                        >
                          {p.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

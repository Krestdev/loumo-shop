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
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LucideChevronDown, LucideCircleUser, LucideMapPin, LucideSearch } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useStore } from "@/providers/datastore";
import AddressQuery from "@/queries/address";
import { useQuery } from "@tanstack/react-query";
import CategoryQuery from "@/queries/category";
// import ProductQuery from "@/queries/product";
// import { ProductVariant } from "@/types/types";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface Props {
  children: React.JSX.Element;
}

export function Menu({ children }: Props) {
  const [addressSearch, setAddressSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [selectOpen, setSelectOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { currentOrderItems, address, setAddress, user, logout } = useStore();
  const t = useTranslations("Header");
  const router = useRouter();

  const addressQuery = new AddressQuery();
  const categoryQuery = new CategoryQuery();
  // const productQuery = new ProductQuery();

  const addressData = useQuery({
    queryKey: ["addressFetchAll"],
    queryFn: () => addressQuery.getAll(),
  });

  const categoryData = useQuery({
    queryKey: ["categoryFetchAll"],
    queryFn: () => categoryQuery.getAll(),
  });

  // const productData = useQuery({
  //   queryKey: ["productsFetchAll"],
  //   queryFn: () => productQuery.getAll(),
  // });

  // const isVariantVisible = (
  //   variant: ProductVariant,
  //   selectedZoneId: number | undefined
  // ) => {
  //   if (!selectedZoneId) return true;
  //   return variant.stock?.some(
  //     (s) => s.shop?.address?.zoneId === selectedZoneId
  //   );
  // };

  // const visibleProducts = React.useMemo(() => {
  //   if (!productData.data) return [];
  //   return productData.data.filter((product) =>
  //     product.variants?.some((v) =>
  //       isVariantVisible(v, address?.zoneId ?? undefined)
  //     )
  //   );
  // }, [productData.data, address]);

  const visibleCategories = categoryData.data?.filter(category => category.display === true && category.products?.some(product => product.status === true && product.variants && product.variants.length > 0))

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

  const path = usePathname()

  const isCurentCaretory = (slug: string) => {
    return slug === path.split("/")[2]
  }

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild className="flex md:hidden">
        {children}
      </DrawerTrigger>
      <DrawerContent className="md:hidden max-w-[260px] w-full h-screen overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-sm min-h-screen flex flex-col overflow-y-auto pb-20">
          {!user && (
            <DrawerTitle className="sticky top-0 bg-primary h-fit text-white z-10">
              <div className="w-full flex flex-col items-center px-6 py-3">
                <Button
                  onClick={() => router.push("/auth/login")}
                  className="w-full bg-white text-black"
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

          <div className="flex flex-col bg-primary gap-2 py-5 px-4">
            {user && <DropdownMenu>
              <div className="w-full flex flex-col gap-1">
                <Label className="text-white">{t("myAccount")}</Label>
                <DropdownMenuTrigger className="flex group text-nowrap gap-2 items-center justify-center border border-input rounded-full px-3 py-1  cursor-pointer bg-white data-[state=open]:bg-gray-100">
                  <LucideCircleUser size={18} className="flex-shrink-0 text-gray-400" />
                  {user?.name}
                  {/* <LucideChevronDown size={16} className="transition-transform duration-200 group-data-[state=open]:rotate-180" /> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>{t("profile")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/profile/history")}>{t("history")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/favorite")}>{t("favorites")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>{t("logOut")}</DropdownMenuItem>
                </DropdownMenuContent>
              </div>
            </DropdownMenu>}
          </div>

          <div className="w-full flex flex-col gap-1">

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
                <div className="w-full px-6 py-3 flex flex-col gap-[6px]">
                  <SelectTrigger className="flex group text-nowrap gap-2 items-center px-3 py-2 rounded-full cursor-pointer w-full border-none shadow-none">
                    <LucideMapPin size={24} className="flex-shrink-0 text-black" />
                    <div className="flex flex-col w-full overflow-hidden text-left">
                      <Label className="first-letter:uppercase text-[#A1A1AA] text-[12px] font-medium">{t("address")}</Label>
                      <SelectValue placeholder={t("select")} className="text-[14px] text-black" />
                    </div>
                  </SelectTrigger>
                </div>

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
                            <span className="text-[14px] text-black">
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
                  <div className="w-full px-6 py-3 flex items-center gap-[6px] cursor-not-allowed">
                    <LucideMapPin size={24} className="flex-shrink-0 text-black" />
                    <div className="flex flex-col w-full overflow-hidden text-left">
                      <Label className="first-letter:uppercase text-[#A1A1AA] text-[12px] font-medium">{t("address")}</Label>
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
          </div>
          {/* <div className="flex gap-1 px-2 py-3">
            <Label className="text-[14px] text-nowrap">{t("language")}</Label>
            <span className="border rounded-full w-fit">
              <LocaleSwitcher />
            </span>
          </div> */}

          <div className="flex flex-col gap-2 pt-2">
            {/* <div className="flex flex-col border bg-primary text-white p-2">
              <div className={`flex  items-center justify-between ${path === "/categories" ? "text-primary" : ""}`}>
                <Link
                  onClick={() => setOpen(false)}
                  href={`/categories`}
                  className="text-[18px] font-bold flex"
                >
                  {t("categories")}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div> */}
            {visibleCategories?.map((cat) => {
              return (
                <div key={cat.id} className={`flex flex-col p-2 ${isCurentCaretory(cat.slug) ? "bg-[#F4F4F5]" : ""}`}>
                  <div className={`flex  items-center justify-between`}>
                    <Link
                      onClick={() => setOpen(false)}
                      href={`/categories/${cat.slug}`}
                    className="text-[16px] flex text-nowrap"
                    >
                      {cat.name}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
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

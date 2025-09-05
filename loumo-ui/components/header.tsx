"use client";

import { useStore } from "@/providers/datastore";
import {
  LucideChevronDown,
  LucideMapPin,
  LucideMenu,
  LucideShoppingCart,
  LucideUserCircle,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import CategoriesNav from "./CategoriesNav";
import LocalSwitcher from "./localSwitcher";
import { Menu } from "./menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddAddress } from "./select-address";

const Header = () => {
  const t = useTranslations("Header");
  const { user, currentOrderItems, logout, address } = useStore();
  const router = useRouter();
  const [isClient, setIsClient] = React.useState(true);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const cartItemCount = currentOrderItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="w-full flex flex-col items-center sticky top-0 z-50 bg-background border-b">
      <div className="flex flex-row items-center justify-between gap-4 md:gap-10 px-4 md:px-7 max-w-[1400px] w-full h-[60px]">
        <Menu>
          <Button variant={"ghost"}>
            <LucideMenu size={20} />
          </Button>
        </Menu>

        <div className="flex items-center gap-4">
          <img
            onClick={() => router.push("/")}
            src="/Images/Logo.png"
            alt="logo"
            className="sm:h-7 sm:max-w-[102px] w-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
          />

          <div className="hidden md:flex w-full">
            <div className="relative flex-row items-center max-w-[640px] w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder={t("search")}
                className="max-w-[640px] w-full pl-3 pr-8"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center gap-1 md:gap-4">
          {/* Adresse sélectionnable uniquement si panier vide */}

          {currentOrderItems.length <= 0 ? (
            <AddAddress>
              <Button
                variant="outline"
                role="combobox"
                className="hidden md:flex group text-nowrap gap-2 items-center px-3 py-2 rounded-[20px] cursor-pointer max-w-[250px] border border-input"
              >
                <LucideMapPin size={20} className="flex-shrink-0" />
                <div className="flex flex-col w-full overflow-hidden text-left hover:text-white">
                  {/* <p className="text-xs text-muted-foreground hover:text-white">{t("address")}</p> */}
                  <span className="truncate text-sm">
                    {address?.street || t("select")}
                  </span>
                </div>
                <LucideChevronDown size={16} className="ml-auto opacity-50" />
              </Button>
            </AddAddress>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild className="border px-4 rounded-[20px]">
                <div className="hidden md:flex items-center gap-2 cursor-not-allowed">
                  <LucideMapPin size={16} className="flex-shrink-0 text-gray-300" />
                  <div className="flex flex-col w-full overflow-hidden text-left">
                    {/* <p className="text-xs text-muted-foreground text-nowrap">{t("address")}</p> */}
                    <p className="text-sm text-black">{address?.street}</p>
                  </div>
                  <LucideChevronDown size={20} className="text-gray-300" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col gap-2 justify-center">
                <p className="w-[150px]">{t("emptyCart")}</p>
                <Button onClick={() => router.push("/cart")} variant={"ghost"} className="bg-white text-black hover:bg-gray-50 hover:text-black">{t("goCart")}</Button>
              </TooltipContent>
            </Tooltip>
          )}

          <LocalSwitcher />

          {user ?
            <DropdownMenu>
              <DropdownMenuTrigger className="md:hidden flex group text-nowrap gap-2 items-center border border-input px-3 py-2 rounded-[20px] cursor-pointer hover:bg-gray-50">
                <LucideUserCircle size={18} />
                {t("myAccount")}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push("/profile")}>{t("profile")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile/history")}>{t("history")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/favorite")}>{t("favorites")}</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>{t("logOut")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> :
            <Button variant={"outline"} onClick={() => router.push("/auth/login")} className="flex md:hidden">
              <LucideUserCircle size={18} />
              {t("login")}
            </Button>
          }

          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full h-9 w-9"
            onClick={() => router.push("/cart")}
          >
            {cartItemCount > 0 && (
              <div className="absolute px-1.5 py-0.5 min-w-[20px] h-5 rounded-full bg-primary flex items-center justify-center top-0 right-0">
                <p className="text-xs text-white">{cartItemCount}</p>
              </div>
            )}
            <LucideShoppingCart size={20} />
          </Button>

          {!isClient ? (
            <Skeleton className="h-9 w-24 rounded-md" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden md:flex group text-nowrap gap-2 items-center border border-input px-3 py-2 rounded-[20px] cursor-pointer hover:bg-gray-50 data-[state=open]:bg-gray-100">
                {t("myAccount")}
                <LucideChevronDown size={16} className="transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push("/profile")}>{t("profile")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile/history")}>{t("history")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/favorite")}>{t("favorites")}</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>{t("logOut")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => router.push("/auth/login")}
              variant="outline"
              className="hidden sm:flex items-center gap-2"
            >
              <LucideUserCircle size={18} />
              <span>{t("login")}</span>
            </Button>
          )}
        </div>
      </div>

      {address && (
        <div className="flex md:hidden items-center justify-center px-7 py-2 gap-2 w-full mx-auto bg-secondary">
          <div className="flex items-center gap-2">
            <LucideMapPin size={16} className="text-white flex-shrink-0" />
            <div className="flex flex-row items-center gap-1 w-full overflow-hidden">
              <p className="text-xs text-white">{t("address")}</p>
              <p className="text-sm truncate text-white">{address?.street}</p>
            </div>
          </div>
        </div>
      )}

      <CategoriesNav />
    </div>
  );
};

export default Header;

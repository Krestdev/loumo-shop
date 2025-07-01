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
} from "@/components/ui/dropdown-menu"


const Header = () => {
  const t = useTranslations("Header");
  const { user, currentOrderItems, logout } = useStore();
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
      <div className="flex flex-row items-center gap-4 md:gap-10 px-4 md:px-7 max-w-[1400px] w-full h-[60px]">
        {/* Logo */}
        <Menu>
          <Button variant={"ghost"}>
            <LucideMenu size={20} />
          </Button>
        </Menu>
        <div className="flex items-center gap-4 w-full">
          <img
            onClick={() => router.push("/")}
            src="/Images/logo.png"
            alt="logo"
            className="h-7 w-[102px] object-cover cursor-pointer hover:opacity-80 transition-opacity"
          />

          {/* Barre de recherche */}
          <div className="relative hidden md:flex flex-row items-center w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder={t("search")}
              className="max-w-[640px] w-full pl-3 pr-8"
            />
          </div>
        </div>

        {/* Actions utilisateur */}
        <div className="flex flex-row items-center gap-2 md:gap-4">
          {/* Adresse */}
          {isClient && (user?.addresses?.length ?? 0) > 0 && (
            <div className="hidden md:flex justify-center items-center gap-2 max-w-[160px] w-full">
              <LucideMapPin size={20} className="flex-shrink-0" />
              <div className="flex flex-col w-full overflow-hidden">
                <p className="text-xs text-muted-foreground">{t("address")}</p>
                <p className="text-sm truncate">
                  {user?.addresses?.[0]?.street}
                </p>
              </div>
            </div>
          )}

          <span className='hidden md:flex'>
            <LocalSwitcher />
          </span>

          <Button variant={"ghost"} className="flex sm:hidden">
            <LucideUserCircle size={36} />
          </Button>
          {/* Panier */}
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

          {/* Profil/Connexion */}
          {!isClient ? (
            <Skeleton className="h-9 w-24 rounded-md" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="text-nowrap flex gap-2 items-center border border-input px-3 py-2 rounded-[20px] cursor-pointer hover:bg-gray-50">
                  {t("myAccount")}
                  <LucideChevronDown size={16} className="" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push("/profile")}>{t("profile")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile/history")}>{t("history")}</DropdownMenuItem>
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
      {isClient && (user?.addresses?.length ?? 0) > 0 && (
        <div className="flex md:hidden items-center justify-center px-7 py-2 gap-2 w-full mx-auto bg-secondary">
          <div className="flex items-center gap-2">
            <LucideMapPin size={24} className="text-white flex-shrink-0" />
            <div className="flex flex-row w-full overflow-hidden">
              <p className="text-xs text-white">{t("address")}</p>
              <p className="text-sm truncate">{user?.addresses?.[0]?.street}</p>
            </div>
          </div>
        </div>
      )}
      <CategoriesNav />
    </div>
  );
};

export default Header;

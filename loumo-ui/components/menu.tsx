"use client";

import * as React from "react";

import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerTitle
} from "@/components/ui/drawer"
import { useStore } from "@/providers/datastore"
import { LucideMapPin } from "lucide-react"
import { useTranslations } from "next-intl"
import LocaleSwitcher from "./localSwitcher"
import CategoryQuery from "@/queries/category"
import { useQuery } from "@tanstack/react-query"
import Loading from "./setup/loading"

interface Props {
  children: React.JSX.Element;
}

export function Menu({ children }: Props) {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild className="flex md:hidden">
        {children}
      </DrawerTrigger>
      <DrawerContent className="flex md:hidden">
        <div className="mx-auto w-full max-w-sm">
          <DrawerTitle>Hello</DrawerTitle>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

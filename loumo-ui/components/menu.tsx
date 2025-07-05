"use client";

import * as React from "react";

import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerTitle
} from "@/components/ui/drawer"

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

"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/providers/datastore";
import { CartSheet } from "./CartSheet";
import { usePathname } from "next/navigation";

export default function CartController() {
  const { currentOrderItems } = useStore();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const prevItemsJson = useRef(JSON.stringify(currentOrderItems));

  useEffect(() => {
    const currentItemsJson = JSON.stringify(currentOrderItems);

    // Ouvre seulement si la route n'est PAS "/cart" ET que le panier a changé
    if (pathname !== "/cart" && currentItemsJson !== prevItemsJson.current) {
      setOpen(true);
    }
    prevItemsJson.current = currentItemsJson;
  }, [currentOrderItems, pathname]);

  return <CartSheet open={open} setOpen={setOpen} />;
}
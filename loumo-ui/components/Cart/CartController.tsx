"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useStore } from "@/providers/datastore";
import { CartSheet } from "./CartSheet";
import { usePathname } from "next/navigation";

export default function CartController() {
  const { currentOrderItems } = useStore();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const prevOrderItemsRef = useRef(currentOrderItems);
  const userClosedRef = useRef(false);

  // Gérer les changements de page
  useEffect(() => {
    if (pathname !== "/cart") {
      userClosedRef.current = false;
    }
  }, [pathname]);

  // Gérer l'ouverture automatique avec un timeout
  useEffect(() => {
    const itemsChanged = currentOrderItems !== prevOrderItemsRef.current;
    
    if (itemsChanged && pathname !== "/cart" && !userClosedRef.current && !open) {
      // Utiliser un timeout pour éviter d'appeler setOpen pendant le rendu
      const timer = setTimeout(() => {
        setOpen(true);
      }, 0);
      
      prevOrderItemsRef.current = currentOrderItems;
      return () => clearTimeout(timer);
    } else {
      prevOrderItemsRef.current = currentOrderItems;
    }
  }, [currentOrderItems, pathname, open]);

  // Créer un setOpen compatible
  const setOpenWrapper = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    if (typeof value === "function") {
      setOpen((prev) => {
        const newValue = (value as (prev: boolean) => boolean)(prev);
        if (!newValue) userClosedRef.current = true;
        return newValue;
      });
    } else {
      setOpen(value);
      if (!value) userClosedRef.current = true;
    }
  }, []);

  return <CartSheet open={open} setOpen={setOpenWrapper} />;
}
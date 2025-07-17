// components/HydrationGuard.tsx
"use client";

import { useStore } from "@/providers/datastore";
import { Loader2 } from "lucide-react";
import React from "react";
import useAuthGuard from "./useAuthGuard";

interface Props {
  children: React.ReactNode;
}

export default function HydrationGuard({ children }: Props) {
  const { isHydrated } = useStore();
  useAuthGuard();

  if (!isHydrated) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

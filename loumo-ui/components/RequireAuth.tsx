// components/RequireAuth.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "@/providers/datastore";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  return <>{children}</>;
}

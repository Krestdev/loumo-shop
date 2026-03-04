"use client";
import { useTranslations } from "next-intl";
import React from "react";

const Loading = ({ status }: { status?: "failed" | "loading" }) => {
  const t = useTranslations("Loading");

  // Déterminer le message directement sans état
  const message = React.useMemo(() => {
    switch (status) {
      case "loading":
        return t("loading");
      case "failed":
        return t("error");
      default:
        return t("loading");
    }
  }, [status, t]);

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-4 font-bold rounded-lg px-12 py-4">
      <img
        src={status === "loading" ? "/loading.gif" : "/error.gif"}
        alt={t("loading")}
        className={`object-contain ${status === "loading" ? " max-w-[150px]" : "max-w-[70px]"} h-auto aspect-square`}
      />
      <p className="text-center max-w-[350px]">{message}</p>
    </div>
  );
};

export default Loading;
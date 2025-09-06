"use client";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

const Loading = ({ status }: { status?: "failed" | "loading" }) => {
  const [message, setMessage] = useState("");
  const t = useTranslations("Loading");

  useEffect(() => {
    switch (status) {
      case "loading":
        setMessage(t("loading"));
        break;
      case "failed":
        setMessage(t("error"));
        break;
      default:
        setMessage(t("loading"));
        break;
    }
  }, [status, t]);

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-4 font-bold rounded-lg px-12 py-4 border border-gray-500">
      <img
        src={status === "loading" ? "/loading.gif" : "/error.gif"}
        alt={t("loading")}
        className="aspect-video object-contain w-full max-w-[250px] h-[150px]"
      />
      <p className="text-center max-w-[350px]">{message}</p>
    </div>
  );
};

export default Loading;

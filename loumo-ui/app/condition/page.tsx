"use client";

import Redaction from "@/components/redaction";
import { useTranslations } from "next-intl";
import React from "react";

const Page = () => {
  const t = useTranslations("Maintenance");


  return (
    <div className="w-full flex justify-between">
        <Redaction message={t("redaction")} />
    </div>
  );
};

export default Page;

"use client";

import Redaction from "@/components/redaction";
// import Loading from "@/components/setup/loading";
// import SettingQuery from "@/queries/setting";
// import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React from "react";

const Page = () => {
  const t = useTranslations("Maintenance");

  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ["topicData"],
  //   queryFn: () => new SettingQuery().getAll("maintenance"),
  // });

  // if (isLoading) return <Loading status="loading" />;
  // if (isError) return <Loading status="failed" />;

  // const content = data?.[0]?.value; 

  return (
    <div className="w-full flex justify-between">
      {/* {content ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : ( */}
        <Redaction message={t("redaction")} />
      {/* )} */}
    </div>
  );
};

export default Page;

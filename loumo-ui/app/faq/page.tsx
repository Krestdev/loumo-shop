"use client";

import QuestionSection from "@/components/FAQ/QuestionSection";
import Redaction from "@/components/redaction";
import Loading from "@/components/setup/loading";
import TopicQuery from "@/queries/topic";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React from "react";

const Page = () => {
  const t = useTranslations("Maintenance")
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["topicData"],
    queryFn: () => new TopicQuery().getAll(),
  });

  if (isLoading) return <Loading status="loading" />;
  if (isError) return <Loading status="failed" />;
  if (!isSuccess) return null;

  return (
    <div className="w-full flex justify-between">
      {data.length > 0 ?
        <QuestionSection topic={data} isSuccess={isSuccess} />
        :
        <Redaction message={t("redaction")} />
      }
    </div>
  );
};


export default Page;

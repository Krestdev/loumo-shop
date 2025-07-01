"use client";

import QuestionSection from "@/components/FAQ/QuestionSection";
import Loading from "@/components/setup/loading";
import TopicQuery from "@/queries/topic";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["topicData"],
    queryFn: () => new TopicQuery().getAll(),
  });

  if (isLoading) return <Loading status="loading" />;
  if (isError) return <Loading status="failed" />;
  if (!isSuccess) return null;

  return (
    <div className="w-full flex justify-between">
      <QuestionSection topic={data} isSuccess={isSuccess} />
    </div>
  );
};


export default Page;

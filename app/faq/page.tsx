"use client";
import Loading from "@/components/setup/loading";
import FaqQuery from "@/queries/faq";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const faq = new FaqQuery();
  const faqData = useQuery({
    queryKey: ["faqData"],
    queryFn: () => faq.getAll,
  });

  if (faqData.isLoading) {
    return <Loading status={"loading"} />;
  }

  if (faqData.isError) {
    return <Loading status={"failed"} />;
  }

  if (faqData.isSuccess) {
    return <div>{JSON.stringify(faqData.data)}</div>;
  }

  return <Loading />;
};

export default Page;

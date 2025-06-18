"use client";
import Loading from "@/components/setup/loading";
import FaqQuery from "@/queries/faq";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import JsonView from "react18-json-view";

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
    return (
      <div>
        <div className="max-w-3xl mx-auto mt-10">
          <h1 className="text-xl font-bold mb-4">Product Data</h1>
          <JsonView src={faqData.data} />
        </div>
      </div>
    );
  }

  return <Loading />;
};

export default Page;

"use client";
import ContactForm from "@/components/Contact/ContactForm";
import Loading from "@/components/setup/loading";
import SettingQuery from "@/queries/setting";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {

  const { isLoading, isError, isSuccess } = useQuery({
    queryKey: ["topicData"],
    queryFn: () => new SettingQuery().getAll(),
  });

  if (isLoading) return <Loading status="loading" />;
  if (isError) return <Loading status="failed" />;
  if (!isSuccess) return null;

  return (
    <div>
      <ContactForm />
    </div>
  );
};

export default Page;

"use client";
import Loading from "@/components/setup/loading";
import SettingQuery from "@/queries/setting";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import JsonView from "react18-json-view";

const Page = () => {
  const setting = new SettingQuery();
  const settingData = useQuery({
    queryKey: ["settingData"],
    queryFn: () => setting.getAll("contact"),
  });

  if (settingData.isLoading) {
    return <Loading status={"loading"} />;
  }

  if (settingData.isError) {
    return <Loading status={"failed"} />;
  }

  if (settingData.isSuccess) {
    return (
      <div>
        <div className="max-w-3xl mx-auto mt-10">
          <h1 className="text-xl font-bold mb-4">Product Data</h1>
          <JsonView src={settingData.data} />
        </div>
      </div>
    );
  }

  return <Loading />;
};

export default Page;

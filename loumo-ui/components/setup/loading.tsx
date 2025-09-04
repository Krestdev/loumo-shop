"use client";
import React, { useEffect, useState } from "react";

const Loading = ({ status }: { status?: "failed" | "loading" }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    switch (status) {
      case "loading":
        setMessage("Loading...");
        break;
      case "failed":
        setMessage("We could not get the data you are looking for");
        break;
      default:
        setMessage("Loading...");
        break;
    }
  }, [status]);

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-4 font-bold rounded-lg px-12 py-4 border border-gray-500">
      <img
        src="/loading.gif"
        alt="Loading..."
        className="aspect-video object-contain w-full max-w-[250px] h-[150px]"
      />
      <p>{message}</p>
    </div>
  );
};

export default Loading;

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
        setMessage("An unexpected error occured");
        break;
    }
  }, []);

  return (
    <div className="flex items-center justify-center font-bold absolute inset-1/2 -translate-x-1/5 rounded-lg px-12 p-4 w-fit min-w-[100px] border-gray-500 border shadow">
      {message}
    </div>
  );
};

export default Loading;

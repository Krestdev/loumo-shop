"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found | Loumo";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div className="text-center max-w-xl">
        <DotLottieReact
          src="https://lottie.host/c55bc4c9-d97d-446e-b05a-85c7ae166281/fhAsEiYf5s.lottie"
          loop
          autoplay
        />
        {/* <h1 className="mb-4">404 Not found page going here</h1> */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {"Oops! This page doesn’t exist."}
        </h2>
        <p className="text-gray-500 mb-6">
          {
            "The page you're looking for might have been removed, renamed, or is temporarily unavailable."
          }
        </p>

        <Link
          href="/"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition duration-300"
        >
          Go back to homepage
        </Link>
      </div>
    </div>
  );
}

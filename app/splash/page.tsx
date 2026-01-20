"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/home");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-600 text-white">
      <h1 className="text-6xl font-bold">NavCart</h1>
      <p className="mt-4 text-xl">Smart Shopping Starts Here</p>

      <div className="mt-10 animate-pulse">
        <p>Loading...</p>
      </div>
    </div>
  );
}

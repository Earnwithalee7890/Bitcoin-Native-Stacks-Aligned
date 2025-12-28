"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(
  () => import("@/components/Dashboard").then((mod) => mod.Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5546FF]/30 border-t-[#5546FF] rounded-full animate-spin" />
      </div>
    )
  }
);

export default function Home() {
  return <Dashboard />;
}

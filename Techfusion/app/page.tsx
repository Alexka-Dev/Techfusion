"use client";

import CryptoNewsGrid from "./components/CryptoNewsGrid";
import LatestNews from "@/components/LatestNews";
import TechNewsGrid from "@/components/TechNewsGrid";

export default function Home() {
  return (
    <div className="pt-24 pb-0 font-tech">
      <CryptoNewsGrid />
      <TechNewsGrid />
      <LatestNews />
    </div>
  );
}

"use client";
import { useState } from "react";
import { type Region } from "@/types/region";

export default function Home() {
  const [gridPoint, setGridPoint] = useState<Record<string, number>>({ nx: 60, ny: 127 }); // 기본값 : 서울 종로구
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null); // GPS로 감지된 상세 지역 정보 (시/군/구 등)

  return (
    <div>
      <h1>날씨 카드</h1>
      <p>룰루랄라</p>
    </div>
  );
}

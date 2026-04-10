"use client";
import { useState } from "react";

export default function Home() {
  const [gridPoint, setGridPoint] = useState<Record<string, number>>({ nx: 60, ny: 127 });
  return (
    <div>
      <h1>날씨 카드</h1>
      <p>룰루랄라</p>
    </div>
  );
}

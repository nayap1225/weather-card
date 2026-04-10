"use client";

import { useState } from "react";
import { getApiDateTime } from "./utils";

export default function ApiTestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const dt = getApiDateTime();

  const testApi = async (key: string, endpoint: string, params: Record<string, any>) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    const queryString = new URLSearchParams(params).toString();
    const url = `${endpoint}?${queryString}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setResults((prev) => ({ ...prev, [key]: data }));
    } catch (error) {
      setResults((prev) => ({ ...prev, [key]: { error: String(error) } }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const apiGroups = [
    {
      title: "기상청 (단기/초단기)",
      apis: [
        { key: "weather", name: "초단기실황", endpoint: "/api/weather", params: { base_date: dt.baseDate, base_time: dt.baseTime, nx: "60", ny: "127" } },
        { key: "ultra-srt-fcst", name: "초단기예보", endpoint: "/api/ultra-srt-fcst", params: { base_date: dt.baseDate, base_time: dt.baseTime, nx: "60", ny: "127" } },
        { key: "forecast", name: "단기예보", endpoint: "/api/forecast", params: { base_date: dt.baseDate, base_time: "0500", nx: "60", ny: "127" } },
      ],
    },
    {
      title: "중기예보",
      apis: [
        { key: "mid-land", name: "중기육상예보", endpoint: "/api/mid-land", params: { regId: "11B00000", tmFc: dt.tmFc } },
        { key: "mid-ta", name: "중기기온조회", endpoint: "/api/mid-ta", params: { regId: "11B10101", tmFc: dt.tmFc } },
      ],
    },
    {
      title: "미세먼지 (에어코리아)",
      apis: [
        { key: "tm-coord", name: "TM 좌표 조회", endpoint: "/api/tm-coord", params: { umdName: "정자동" } },
        { key: "nearby-station", name: "근접 측정소 조회", endpoint: "/api/nearby-station", params: { tmX: "200000", tmY: "450000" } },
        { key: "sido-dust", name: "시도별 먼지 정보", endpoint: "/api/sido-dust", params: { sidoName: "서울" } },
        { key: "dust", name: "측정소별 실시간 정보", endpoint: "/api/dust", params: { stationName: "종로구", dataTerm: "DAILY" } },
      ],
    },
    {
      title: "생활지수 & 카카오",
      apis: [
        { key: "uv", name: "자외선지수", endpoint: "/api/uv", params: { areaNo: "1100000000", time: dt.time } },
        { key: "air-diffusion", name: "대기정체지수", endpoint: "/api/air-diffusion", params: { areaNo: "1100000000", time: dt.time } },
        { key: "kakao", name: "카카오 주소 변환", endpoint: "/api/kakao-address", params: { x: "127.1086228", y: "37.4012191" } },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-dongle">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-6xl font-jua mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            API Test Dashboard
          </h1>
          <p className="text-xl text-slate-400">기준 시각: {dt.now}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {apiGroups.map((group) => (
            <div key={group.title} className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
              <h2 className="text-3xl font-jua mb-6 text-cyan-300 border-b border-slate-700 pb-2">{group.title}</h2>
              <div className="space-y-4">
                {group.apis.map((api) => (
                  <div key={api.key} className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 transition-all hover:border-cyan-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-medium">{api.name}</span>
                      <button
                        onClick={() => testApi(api.key, api.endpoint, api.params)}
                        disabled={loading[api.key]}
                        className={`px-6 py-2 rounded-xl text-xl font-jua transition-all ${
                          loading[api.key]
                            ? "bg-slate-700 cursor-not-allowed"
                            : "bg-cyan-600 hover:bg-cyan-500 active:scale-95 shadow-lg shadow-cyan-900/20"
                        }`}
                      >
                        {loading[api.key] ? "Loading..." : "Execute"}
                      </button>
                    </div>
                    
                    {results[api.key] && (
                      <div className="mt-4 overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Response Data</span>
                          <button 
                            onClick={() => setResults(prev => { const n = {...prev}; delete n[api.key]; return n; })}
                            className="text-slate-500 hover:text-rose-400 text-sm"
                          >
                            Clear
                          </button>
                        </div>
                        <pre className="bg-black/50 p-4 rounded-xl overflow-auto max-h-60 text-sm font-mono text-cyan-400/80 thin-scrollbar">
                          {JSON.stringify(results[api.key], null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

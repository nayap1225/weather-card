import type { NextConfig } from "next";

const weatherConfig = {
  serviceKey: process.env.NEXT_PUBLIC_WEATHER_API_KEY || "",
  datatype: "JSON",
  pageNo: 1,
};

const dustConfig = {
  serviceKey: process.env.NEXT_PUBLIC_DUST_API_KEY || "",
  datatype: "JSON",
};

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      // 1. [기상청] 초단기실황 조회
      {
        source: "/api/weather",
        destination: `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${encodeURIComponent(weatherConfig.serviceKey)}&dataType=${weatherConfig.datatype}&pageNo=${weatherConfig.pageNo}&numOfRows=1000`,
      },
      // 2. [기상청] 초단기예보 조회
      {
        source: "/api/ultra-srt-fcst",
        destination: `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${encodeURIComponent(weatherConfig.serviceKey)}&dataType=${weatherConfig.datatype}&pageNo=${weatherConfig.pageNo}&numOfRows=1000`,
      },
      // 3. [기상청] 단기예보 조회
      {
        source: "/api/forecast",
        destination: `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${encodeURIComponent(weatherConfig.serviceKey)}&dataType=${weatherConfig.datatype}&pageNo=${weatherConfig.pageNo}&numOfRows=1000`,
      },
      // 4. [기상청] 중기육상예보 조회
      {
        source: "/api/mid-land",
        destination: `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${encodeURIComponent(weatherConfig.serviceKey)}&dataType=${weatherConfig.datatype}&pageNo=${weatherConfig.pageNo}&numOfRows=10`,
      },
      // 5. [기상청] 중기기온조회
      {
        source: "/api/mid-ta",
        destination: `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${encodeURIComponent(weatherConfig.serviceKey)}&dataType=${weatherConfig.datatype}&pageNo=${weatherConfig.pageNo}&numOfRows=10`,
      },
      // 6. [에어코리아] TM 좌표 조회 (읍면동 -> TM)
      {
        source: "/api/tm-coord",
        destination: `https://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getTMStdrCrdnt?serviceKey=${encodeURIComponent(dustConfig.serviceKey)}&returnType=${dustConfig.datatype}`,
      },
      // 7. [에어코리아] 근접 측정소 목록 조회 (TM -> 측정소)
      {
        source: "/api/nearby-station",
        destination: `https://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?serviceKey=${encodeURIComponent(dustConfig.serviceKey)}&returnType=${dustConfig.datatype}`,
      },
      // 8. [에어코리아] 시도별 실시간 측정정보 조회
      {
        source: "/api/sido-dust",
        destination: `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${encodeURIComponent(dustConfig.serviceKey)}&returnType=${dustConfig.datatype}&numOfRows=1000`,
      },
      // 9. [에어코리아] 측정소별 실시간 측정정보 조회 (최종 데이터)
      {
        source: "/api/dust",
        destination: `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=${encodeURIComponent(dustConfig.serviceKey)}&returnType=${dustConfig.datatype}`,
      },
      // 10. [기상청] 생활기상지수 - 자외선지수 조회
      {
        source: "/api/uv",
        destination: `https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getUVIdxV4?serviceKey=${encodeURIComponent(weatherConfig.serviceKey)}&dataType=${weatherConfig.datatype}&pageNo=${weatherConfig.pageNo}&numOfRows=10`,
      },
      // 11. [기상청] 생활기상지수 - 대기정체지수 조회
      {
        source: "/api/air-diffusion",
        destination: `https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getAirDiffusionIdxV4?serviceKey=${encodeURIComponent(weatherConfig.serviceKey)}&dataType=${weatherConfig.datatype}&pageNo=${weatherConfig.pageNo}&numOfRows=10`,
      },
    ];
  },
};

export default nextConfig;

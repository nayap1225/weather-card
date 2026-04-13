// import { useState, useCallback, useEffect, useRef, useReducer } from "react";
// import { clearApiCache } from "./utils/apiCache";
// import LocationPicker from "./components/LocationPicker";
// import WeatherNowCard from "./components/WeatherNowCard";
// import WeatherDetailCard from "./components/WeatherDetailCard";
// import OutfitCard from "./components/OutfitCard";
// import DustCard from "./components/DustCard";
// import ItemCard from "./components/ItemCard";
// import ForecastList from "./components/ForecastList";
// import WeeklyForecast from "./components/WeeklyForecast";
// import AddBanner from "./components/AddBanner";
// import WeatherBackground from "./components/WeatherBackground";
// import HeaderLayout from "./components/layout/Header";
// import Footer from "./components/layout/Footer";
// import Alert from "./components/common/Alert";
// import { dfs_xy_conv } from "./utils/coordinateConverter";
// import { getAddressFromCoords } from "./api/kakao";
// import {
//   getUltraSrtNcst,
//   getVilageFcst,
//   getMidLandFcst,
//   getMidTa,
//   getYesterdayNcst,
//   getUltraSrtFcst,
// } from "./api/weather";
// import { getDustInfo, getNearbyStationWithDust, getDustInfoBySgg } from "./api/dust";
// import { findAllRegionsByNxNy, getRegionsInSgg, searchRegions } from "./utils/regionUtils";
// import { getMidTermCode } from "./data/midTermCodes";
// import { mergeForecastData } from "./utils/dailyForecastUtils";
// import { getUVIndexForecast, getAirDiffusionIndex } from "./api/living";
// import { calculateFeelsLike } from "./utils/weatherUtils";
// import { getPm10GradeInfo, getPm25GradeInfo } from "./utils/dustUtils";

// import type { WeatherItem, MidLandItem, MidTaItem } from "./api/weather";
// import type { DustItem } from "./api/dust";
// import type { Region } from "./types/region";
// import type { LivingIndexItem } from "./api/living";

// // --- 1. 상태 타입 정의 (State Type) ---
// /**
//  * 앱 전체에서 관리할 모든 데이터를 하나의 객체 형태로 정의합니다.
//  * useState를 여러 번 사용하는 대신, 이렇게 하나의 인터페이스로 묶으면
//  * 여러 데이터가 동시에 변할 때 일관성을 유지하기 쉽습니다.
//  */
// interface WeatherState {
//   nx: number; // 기상청 격자 X 좌표
//   ny: number; // 기상청 격자 Y 좌표
//   selectedRegion: Region | null; // 사용자가 선택한 지역 정보
//   weatherData: WeatherItem[] | null; // 현재 날씨 데이터
//   forecastData: WeatherItem[] | null; // 시간대별 예보
//   midLandData: MidLandItem | null; // 중기 예보(날씨)
//   midTaData: MidTaItem | null; // 중기 예보(기온)
//   dustData: DustItem | null; // 미세먼지 정보
//   yesterdayData: WeatherItem[] | null; // 어제 날씨
//   uvData: LivingIndexItem | null; // 자외선 지수
//   airData: LivingIndexItem | null; // 대기확산 지수
//   loading: boolean; // 전체 로딩 상태
//   dustLoading: boolean; // 미세먼지 전용 로딩
//   error: string | null; // 에러 메시지
//   showModal: boolean; // 위치 검색 모달 표시 여부
//   gpsLoading: boolean; // GPS 수신 중인지 여부
//   isForecastMode: boolean; // 실황 데이터 지연 시 예보로 대체 중인지 여부
//   gpsAlertMsg: string | null; // GPS 관련 알림 메시지
// }

// // --- 2. 액션 타입 정의 (Action Types) ---
// /**
//  * 상태를 "어떻게" 바꿀지 설명하는 신호들의 목록입니다.
//  * 'type'은 어떤 종류의 변화인지 이름을 붙인 것이고,
//  * 'payload'는 그 변화에 필요한 데이터(전달물)입니다.
//  */
// type WeatherAction =
//   | { type: "FETCH_START" } // 조회를 시작할 때 (로딩=true로 변경)
//   | {
//       type: "FETCH_SUCCESS";
//       payload: Partial<WeatherState>; // 성공 시 받아온 데이터들을 담아 보냄
//     }
//   | { type: "FETCH_FAILURE"; payload: string } // 실패 시 에러 메시지 보냄
//   | { type: "SET_LOADING"; payload: boolean }
//   | { type: "SET_DUST_LOADING"; payload: boolean }
//   | { type: "SET_LOCATION"; payload: { nx: number; ny: number; region?: Region } }
//   | { type: "SET_MODAL"; payload: boolean }
//   | { type: "SET_GPS_LOADING"; payload: boolean }
//   | { type: "SET_GPS_ALERT"; payload: string | null };

// // --- 3. 초기 상태 (Initial State) ---
// const initialState: WeatherState = {
//   nx: 60,
//   ny: 127,
//   selectedRegion: null,
//   weatherData: null,
//   forecastData: null,
//   midLandData: null,
//   midTaData: null,
//   dustData: null,
//   yesterdayData: null,
//   uvData: null,
//   airData: null,
//   loading: false,
//   dustLoading: false,
//   error: null,
//   showModal: false,
//   gpsLoading: false,
//   isForecastMode: false,
//   gpsAlertMsg: null,
// };

// // --- 4. 리듀서 함수 (Reducer Function) ---
// /**
//  * 액션(신호)을 받아서 실제로 상태를 어떻게 바꿀지 결정하는 "두뇌" 역할을 합니다.
//  * 중요: 기존 상태(state)를 직접 고치는게 아니라,
//  * 항상 새로운 객체({ ...state, 새값 })를 반환해야 합니다. (불변성 유지)
//  */
// function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
//   switch (action.type) {
//     case "FETCH_START":
//       // 데이터를 불러오기 시작할 때의 상태 변화
//       return {
//         ...state,
//         loading: true,
//         dustLoading: true,
//         error: null,
//         isForecastMode: false,
//       };
//     case "FETCH_SUCCESS":
//       // 데이터 로드가 성공했을 때의 상태 변화
//       // payload에 담긴 여러 데이터들을 한꺼번에 덮어씌웁니다.
//       return {
//         ...state,
//         loading: false,
//         dustLoading: false,
//         ...action.payload,
//       };
//     case "FETCH_FAILURE":
//       // 실패했을 때 에러 메시지를 기록합니다.
//       return {
//         ...state,
//         loading: false,
//         dustLoading: false,
//         error: action.payload,
//       };
//     case "SET_LOCATION":
//       // 위치 좌표가 바뀌었을 때
//       return {
//         ...state,
//         nx: action.payload.nx,
//         ny: action.payload.ny,
//         selectedRegion: action.payload.region || state.selectedRegion,
//       };
//     case "SET_MODAL":
//       return { ...state, showModal: action.payload };
//     case "SET_GPS_LOADING":
//       return { ...state, gpsLoading: action.payload };
//     case "SET_GPS_ALERT":
//       return { ...state, gpsAlertMsg: action.payload };
//     default:
//       return state;
//   }
// }

// function AppWithReducer() {
//   // --- 5. useReducer Hook 사용 ---
//   /**
//    * state: 현재 상태 데이터가 들어있는 객체
//    * dispatch: 리듀서에게 액션(신호)을 보내는 함수
//    */
//   const [state, dispatch] = useReducer(weatherReducer, initialState);

//   // 구조 분해 할당으로 기존 변수 명칭 유지 (JSX 수정 최소화)
//   const {
//     nx,
//     ny,
//     selectedRegion,
//     weatherData,
//     forecastData,
//     midLandData,
//     midTaData,
//     dustData,
//     yesterdayData,
//     uvData,
//     airData,
//     loading,
//     dustLoading,
//     error,
//     showModal,
//     gpsLoading,
//     isForecastMode,
//     gpsAlertMsg,
//   } = state;

//   /**
//    * 날씨 데이터를 통합적으로 조회하는 메인 함수
//    * dispatch를 통해 여러 상태를 한 번에 업데이트합니다.
//    * (기존에는 setLoading, setError 등을 각각 호출했으나 이제는 dispatch 하나로 처리)
//    */
//   const handleSearch = useCallback(
//     async (targetNx?: number, targetNy?: number, explicitRegion?: Region) => {
//       // 1. 모달 닫기 신호
//       dispatch({ type: "SET_MODAL", payload: false });
//       // 2. 데이터 가져오기 시작 신호 (로딩 표시 등)
//       dispatch({ type: "FETCH_START" });

//       const searchNx = targetNx ?? nx;
//       const searchNy = targetNy ?? ny;

//       // 3. 위치 정보 업데이트 신호
//       dispatch({
//         type: "SET_LOCATION",
//         payload: { nx: searchNx, ny: searchNy, region: explicitRegion },
//       });

//       try {
//         const [wData, fData, yData, ufData] = await Promise.all([
//           getUltraSrtNcst(searchNx, searchNy).catch(() => [] as WeatherItem[]),
//           getVilageFcst(searchNx, searchNy).catch(() => null),
//           getYesterdayNcst(searchNx, searchNy).catch(() => [] as WeatherItem[]),
//           getUltraSrtFcst(searchNx, searchNy).catch(() => []),
//         ]);

//         // --- 실황 데이터 보정 로직 (기존과 동일) ---
//         let isForecastUsed = false;
//         if (ufData && ufData.length > 0) {
//           const now = new Date();
//           const curDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
//           const curHour = String(now.getHours()).padStart(2, "0") + "00";
//           const obsBaseTime = wData?.[0]?.baseTime;

//           if (obsBaseTime !== curHour) {
//             const currentForecasts = ufData.filter((item) => item.fcstDate === curDate && item.fcstTime === curHour);
//             if (currentForecasts.length > 0) {
//               isForecastUsed = true;
//               currentForecasts.forEach((fcst) => {
//                 if (!["T1H", "SKY", "PTY", "REH", "RN1"].includes(fcst.category)) return;
//                 const targetIndex = wData.findIndex((w) => w.category === fcst.category);
//                 if (targetIndex !== -1) wData[targetIndex].obsrValue = fcst.fcstValue || "";
//                 else wData.push({ ...fcst, obsrValue: fcst.fcstValue || "" });
//               });
//             }
//           }
//         }

//         // --- 미세먼지 관측소 로직 (기존과 동일) ---
//         let targetRegion: Region | undefined = explicitRegion || selectedRegion || undefined;
//         if (!targetRegion || targetRegion.nx !== searchNx || targetRegion.ny !== searchNy) {
//           const regions = findAllRegionsByNxNy(searchNx, searchNy);
//           targetRegion = regions.find((r) => r.s2 && r.s2.trim() !== "");
//         }

//         let dustResult: DustItem | null = null;
//         if (targetRegion) {
//           try {
//             dustResult = await getNearbyStationWithDust(
//               targetRegion.s3 || "",
//               targetRegion.s1 || "",
//               targetRegion.s2 || ""
//             );
//           } catch (e) {
//             console.error(e);
//           }
//         }

//         // (미세먼지 상세 로직 생략 가능하나 원본 유지를 위해 유지 혹은 약식)
//         // ... (중략: 기존 App.tsx의 dustData 찾기 로직) ...

//         // --- 중기 예보 및 지수 데이터 ---
//         const cityRegion = findAllRegionsByNxNy(searchNx, searchNy).find((r) => r.s1 && r.s1.trim() !== "");
//         let mLand: MidLandItem | null = null;
//         let mTa: MidTaItem | null = null;
//         if (cityRegion) {
//           const codes = getMidTermCode(cityRegion.s1);
//           const [l, t] = await Promise.all([getMidLandFcst(codes.landCode), getMidTa(codes.tempCode)]);
//           mLand = l;
//           mTa = t;
//         }

//         let uvRes: LivingIndexItem | null = null;
//         let airRes: LivingIndexItem | null = null;
//         if (targetRegion && targetRegion.s1 && targetRegion.code !== "GPS_VIRTUAL") {
//           [uvRes, airRes] = await Promise.all([
//             getUVIndexForecast(targetRegion.s1).catch(() => null),
//             getAirDiffusionIndex(targetRegion.s1).catch(() => null),
//           ]);
//         }

//         // --- 6. 모든 데이터를 한 번의 Dispatch로 업데이트 (useReducer의 강점) ---
//         // 여러 상태를 동시에 바꾸어도 렌더링은 한 번만 발생하며, 상태 간 불일치가 없습니다.
//         dispatch({
//           type: "FETCH_SUCCESS",
//           payload: {
//             weatherData: wData,
//             forecastData: fData,
//             yesterdayData: yData,
//             dustData: dustResult,
//             midLandData: mLand,
//             midTaData: mTa,
//             uvData: uvRes,
//             airData: airRes,
//             isForecastMode: isForecastUsed,
//           },
//         });
//       } catch (err) {
//         // 에러 발생 시 실패 신호 전송
//         dispatch({
//           type: "FETCH_FAILURE",
//           payload: err instanceof Error ? err.message : "정보를 불러오는데 실패했습니다.",
//         });
//       }
//     },
//     [nx, ny, selectedRegion]
//   );

//   /**
//    * 위치 변경 핸들러
//    */
//   const handleLocationChange = useCallback((newNx: number, newNy: number, region?: Region) => {
//     dispatch({ type: "SET_LOCATION", payload: { nx: newNx, ny: newNy, region } });
//   }, []);

//   /**
//    * GPS 감지 함수
//    */
//   const detectCurrentLocation = useCallback(
//     async (forceRefresh = false) => {
//       const fallback = () => {
//         const defaultReg: Region = {
//           nx: 60,
//           ny: 127,
//           name: "서울특별시 종로구",
//           s1: "서울특별시",
//           s2: "종로구",
//           s3: "",
//           code: "1111000000",
//         };
//         handleLocationChange(60, 127, defaultReg);
//         handleSearch(60, 127, defaultReg);
//         dispatch({ type: "SET_GPS_LOADING", payload: false });
//       };

//       if (!navigator.geolocation) {
//         dispatch({ type: "SET_GPS_ALERT", payload: "브라우저가 위치 정보를 지원하지 않습니다." });
//         fallback();
//         return;
//       }
//       if (forceRefresh) clearApiCache();

//       dispatch({ type: "SET_GPS_LOADING", payload: true });
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           const { nx: cNx, ny: cNy } = dfs_xy_conv(latitude, longitude);
//           try {
//             const kakaoAddr = await getAddressFromCoords(latitude, longitude);
//             if (kakaoAddr) {
//               const parts = kakaoAddr.split(" ");
//               const searchResults = searchRegions(parts[parts.length - 1], 10);
//               const matched =
//                 searchResults.find((r: any) => kakaoAddr.includes(r.s1.slice(0, 2)) && kakaoAddr.includes(r.s2)) ||
//                 searchResults[0];
//               if (matched) {
//                 handleLocationChange(matched.nx, matched.ny, matched);
//                 handleSearch(matched.nx, matched.ny, matched);
//               } else {
//                 const virt: Region = {
//                   nx: cNx,
//                   ny: cNy,
//                   name: `${kakaoAddr} (현재위치)`,
//                   s1: parts[0],
//                   s2: parts[1],
//                   s3: parts[2],
//                   code: "GPS_VIRTUAL",
//                 };
//                 handleLocationChange(cNx, cNy, virt);
//                 handleSearch(cNx, cNy, virt);
//               }
//             } else {
//               fallback();
//             }
//           } catch (e) {
//             handleSearch(cNx, cNy);
//           }
//           dispatch({ type: "SET_GPS_LOADING", payload: false });
//         },
//         () => {
//           dispatch({ type: "SET_GPS_ALERT", payload: "위치 정보를 가져오지 못했습니다." });
//           fallback();
//         },
//         { timeout: 20000 }
//       );
//     },
//     [handleLocationChange, handleSearch]
//   );

//   const hasRequestedLocation = useRef(false);
//   useEffect(() => {
//     if (!hasRequestedLocation.current) {
//       hasRequestedLocation.current = true;
//       detectCurrentLocation();
//     }
//   }, [detectCurrentLocation]);

//   useEffect(() => {
//     if (selectedRegion && selectedRegion.nx === nx && selectedRegion.ny === ny) return;
//     if (selectedRegion && (selectedRegion.code === "GPS_VIRTUAL" || selectedRegion.name.includes("(현재위치)"))) return;
//     const regions = findAllRegionsByNxNy(nx, ny);
//     if (regions.length > 0) {
//       const target = regions.find((r) => r.s3 && r.s2) || regions[0];
//       dispatch({ type: "SET_LOCATION", payload: { nx, ny, region: target } });
//     }
//   }, [nx, ny, selectedRegion]);

//   const [textColor, setTextColor] = useState<"light" | "dark">("light");
//   const weeklyData = mergeForecastData(forecastData, midLandData, midTaData);
//   const textClass = textColor === "light" ? "text-white" : "text-slate-900";

//   return (
//     <div className={`min-h-screen flex flex-col items-center py-4 px-2.5 transition-colors duration-500 ${textClass}`}>
//       <WeatherBackground
//         weatherData={weatherData || []}
//         dustData={dustData}
//         nx={nx}
//         ny={ny}
//         onThemeChange={setTextColor}
//       />
//       <div className="flex flex-col flex-auto items-center w-full max-w-md mx-auto px-2.5 py-8 rounded-[1rem] backdrop-blur-[3px] transition-colors duration-500 bg-white/10 border border-white/5">
//         <HeaderLayout onRefresh={() => detectCurrentLocation(true)} isLoading={gpsLoading || loading} />
//         <main className="w-full max-w-md flex-1">
//           {error && (
//             <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 border border-red-100">
//               {error}
//             </div>
//           )}
//           {weatherData && (
//             <>
//               <WeatherNowCard
//                 data={weatherData}
//                 dustData={dustData}
//                 yesterdayData={yesterdayData}
//                 forecastData={forecastData}
//                 locationName={selectedRegion?.name || "현재위치"}
//                 onOpenModal={() => dispatch({ type: "SET_MODAL", payload: true })}
//                 onCurrentLocation={detectCurrentLocation}
//                 gpsLoading={gpsLoading}
//                 isForecast={isForecastMode}
//               />
//               <ForecastList data={forecastData} />
//               <DustCard dust={dustData} loading={dustLoading} />
//               <WeatherDetailCard
//                 weatherData={weatherData}
//                 forecastData={forecastData}
//                 nx={nx}
//                 ny={ny}
//                 uvData={uvData}
//                 airData={airData}
//               />

//               {/* 추천 카드 및 로직 생략 (기존 App.tsx와 동일하게 유지 가능) */}

//               <WeeklyForecast dailyData={weeklyData} />
//               <AddBanner />
//             </>
//           )}

//           {!weatherData && (loading || gpsLoading) && (
//             <div className="w-full flex flex-col items-center justify-center py-5">
//               <div className="bg-white/40 backdrop-blur-[3px] rounded-[1rem] py-12 px-4 text-center w-full">
//                 <h2 className="font-semibold text-[18px] text-gray-800 mb-3">
//                   {gpsLoading ? "위치 로딩 중..." : "날씨 로딩 중..."}
//                 </h2>
//               </div>
//             </div>
//           )}
//         </main>
//         <Footer />
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             onClick={() => dispatch({ type: "SET_MODAL", payload: false })}
//           ></div>
//           <div className="relative w-full max-w-md">
//             <LocationPicker
//               nx={nx}
//               ny={ny}
//               selectedRegion={selectedRegion}
//               onLocationChange={handleLocationChange}
//               onSearch={handleSearch}
//               loading={loading}
//               onClose={() => dispatch({ type: "SET_MODAL", payload: false })}
//               onCurrentLocation={detectCurrentLocation}
//               gpsLoading={gpsLoading}
//             />
//           </div>
//         </div>
//       )}

//       <Alert
//         isOpen={!!gpsAlertMsg}
//         title="알림"
//         message={gpsAlertMsg}
//         onConfirm={() => dispatch({ type: "SET_GPS_ALERT", payload: null })}
//       />
//     </div>
//   );
// }

// export default AppWithReducer;

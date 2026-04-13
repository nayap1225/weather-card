# 📖 프로젝트 API 상세 스키마 가이드

본 문서는 프로젝트에서 사용하는 모든 API의 상세 응답 구조(Schema), 파라미터 정보, 코드 정의 및 TypeScript 인터페이스를 정리한 기술 가이드입니다.

---

## 1. 기상청 단기예보 서비스 (VilageFcstInfoService_2.0)

### 📍 엔드포인트
- **초단기실황**: `/api/weather` (getUltraSrtNcst)
- **초단기예보**: `/api/ultra-srt-fcst` (getUltraSrtFcst)
- **단기예보**: `/api/forecast` (getVilageFcst)

### 📋 주요 응답 필드 (JSON)
```json
{
  "response": {
    "header": { "resultCode": "00", "resultMsg": "NORMAL_SERVICE" },
    "body": {
      "dataType": "JSON",
      "items": {
        "item": [
          {
            "category": "TMP",
            "fcstDate": "20240410",
            "fcstTime": "1800",
            "fcstValue": "15",
            "nx": 60,
            "ny": 127
          }
        ]
      },
      "totalCount": 80
    }
  }
}
```

### 🔢 주요 Category 코드 및 의미
| 코드 | 항목명 | 단위 | 코드값 정의 |
| :--- | :--- | :--- | :--- |
| **TMP** | 1시간 기온 | ℃ | - |
| **SKY** | 하늘상태 | 코드 | 맑음(1), 구름많음(3), 흐림(4) |
| **PTY** | 강수형태 | 코드 | 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4) |
| **POP** | 강수확률 | % | - |
| **REH** | 습도 | % | - |
| **WSD** | 풍속 | m/s | - |
| **VEC** | 풍향 | deg | - |

---

## 2. 기상청 중기예보 서비스 (MidFcstInfoService)

### 📍 엔드포인트
- **중기육상예보**: `/api/mid-land` (getMidLandFcst)
- **중기기온조회**: `/api/mid-ta` (getMidTa)

### 📋 주요 응답 필드 (MidLandFcst)
- `wf3Am ~ wf10`: 3일~10일 후 날씨 상태 (예: "맑음", "흐리고 비")
- `rnSt3Am ~ rnSt10`: 3일~10일 후 강수 확률 (%)

### 📋 주요 응답 필드 (MidTa)
- `taMin3 ~ taMin10`: 3일~10일 후 아침 최저 기온
- `taMax3 ~ taMax10`: 3일~10일 후 낮 최고 기온

---

## 3. 에어코리아 실시간 대기오염 정보 (ArpltnInforInqireSvc)

### 📍 엔드포인트
- **측정소별 실시간 측정**: `/api/dust` (getMsrstnAcctoRltmMesureDnsty)
- **시도별 측정정보**: `/api/sido-dust` (getCtprvnRltmMesureDnsty)

### 🔢 등급(Grade) 코드 정의
모든 오염 물질 및 통합대기환경지수(KHAI)의 등급은 **1~4** 숫자로 반환됩니다.
- **1**: 좋음 (Blue)
- **2**: 보통 (Green)
- **3**: 나쁨 (Yellow)
- **4**: 매우 나쁨 (Red)

### 📋 주요 응답 필드
- `pm10Value / pm25Value`: 미세먼지 / 초미세먼지 농도 (㎍/㎥)
- `pm10Grade / pm25Grade`: 미세먼지 / 초미세먼지 등급
- `o3Value / o3Grade`: 오존 농도 및 등급
- `khaiValue / khaiGrade`: 통합대기환경지수 수치 및 등급

---

## 4. 기상청 생활기상지수 (LivingWthrIdxServiceV4)

### 📍 엔드포인트
- **자외선지수**: `/api/uv` (getUVIdxV4)
- **대기정체지수**: `/api/air-diffusion` (getAirDiffusionIdxV4)

### 📋 데이터 구조 특이사항
결과 배열의 `h0, h3, h6...` 등의 필드에 시간대별 지수 값이 담겨 있습니다.
- **자외선지수 등급**: 낮음(0~2), 보통(3~5), 높음(6~7), 매우높음(8~10), 위험(11 이상)

---

## 5. 카카오 로컬 서비스 (Local API)

### 📍 엔드포인트
- **좌표-주소 변환**: `/api/kakao-address` (coord2address.json)

### 📋 주요 응답 필드
```json
{
  "documents": [
    {
      "address": {
        "address_name": "경기도 성남시 분당구 정자동 178-1",
        "region_1depth_name": "경기도",
        "region_2depth_name": "성남시 분당구",
        "region_3depth_name": "정자동"
      },
      "road_address": {
        "address_name": "경기도 성남시 분당구 불정로 6"
      }
    }
  ]
}
```

---

## 💻 TypeScript Interface 예시

```typescript
// 기상청 단기예보 아이템
export interface WeatherItem {
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

// 미세먼지 실시간 데이터
export interface DustData {
  dataTime: string;
  stationName: string;
  pm10Value: string;
  pm10Grade: string;
  pm25Value: string;
  pm25Grade: string;
  khaiValue: string;
  khaiGrade: string;
}
```

---

### 🔄 실행 기록

- 날짜: 2026-04-13
- 워크플로우: API 상세 필드 정의 보완
- 요청 요약: 응답 데이터(nx, ny 등)의 의미와 설명 추가

## 📝 상세 필드 정의 보완 (v1.1)

기존 스키마 가이드에서 생략되었던 각 응답 필드의 상세 의미와 데이터 형식을 보완합니다.

### 1. 기상청 단기예보 필드 정의
| 필드명 | 의미 | 상세 설명 |
| :--- | :--- | :--- |
| **baseDate** | 발표 일자 | 예보를 발표한 날짜 (YYYYMMDD) |
| **baseTime** | 발표 시각 | 예보를 발표한 시간 (HHMM) |
| **fcstDate** | 예보 일자 | 예측 대상 날짜 (YYYYMMDD) |
| **fcstTime** | 예보 시각 | 예측 대상 시간 (HHMM) |
| **fcstValue** | 예보 값 | 해당 항목(category)의 예측 수치 |
| **nx** | X 좌표 | 기상청 격자 좌표 X (위경도 아님) |
| **ny** | Y 좌표 | 기상청 격자 좌표 Y (위경도 아님) |
| **category** | 항목 코드 | 기온(TMP), 하늘(SKY), 강수(PTY) 등 구분 코드 |

### 2. 에어코리아 실시간 대기측정 필드 정의
| 필드명 | 의미 | 상세 설명 |
| :--- | :--- | :--- |
| **dataTime** | 측정 시각 | 대기질 정보가 측정된 일시 (YYYY-MM-DD HH:mm) |
| **stationName** | 측정소명 | 데이터를 수집한 관측소 이름 (예: 강남구) |
| **pm10Value** | 미세먼지 농도 | PM10 농도 (㎍/㎥) |
| **pm10Grade** | 미세먼지 등급 | PM10 등급 (1:좋음, 2:보통, 3:나쁨, 4:매우나쁨) |
| **pm25Value** | 초미세먼지 농도| PM25 농도 (㎍/㎥) |
| **pm25Grade** | 초미세먼지 등급| PM25 등급 (1~4) |
| **khaiValue** | 통합대기환경지수| 종합적인 대기 상태 수치 |
| **khaiGrade** | 통합대기환경등급| 종합 대기 상태 등급 (1~4) |

### 3. 카카오 로컬(주소) 필드 정의
| 필드명 | 의미 | 상세 설명 |
| :--- | :--- | :--- |
| **address_name** | 전체 주소 | 지번 주소 또는 도로명 주소 전체 명칭 |
| **region_1depth_name**| 시/도 | 광역 단위 (예: 서울특별시, 경기도) |
| **region_2depth_name**| 구/군 | 기초 단위 (예: 강남구, 성남시 분당구) |
| **region_3depth_name**| 동/읍/면 | 행정구역 단위 (예: 정자동) |
| **x / y** | 경도 / 위도 | WGS84 좌표계 기준 (x:경도, y:위도) |

### 💻 보완된 TypeScript Interface

```typescript
/**
 * 기상청 단기예보 개별 항목
 */
export interface WeatherItem {
  category: string;   // 항목 코드 (예: TMP, SKY)
  fcstDate: string;   // 예보 일자 (YYYYMMDD)
  fcstTime: string;   // 예보 시각 (HHMM)
  fcstValue: string;  // 예보 값
  nx: number;         // 예보 지점 X 좌표
  ny: number;         // 예보 지점 Y 좌표
}

/**
 * 에어코리아 대기질 측정 데이터
 */
export interface DustData {
  dataTime: string;    // 측정 시간
  stationName: string; // 측정소 이름
  pm10Value: string;   // 미세먼지 농도
  pm10Grade: string;   // 미세먼지 등급 (1~4)
  pm25Value: string;   // 초미세먼지 농도
  pm25Grade: string;   // 초미세먼지 등급 (1~4)
  khaiValue: string;   // 통합대기환경지수
  khaiGrade: string;   // 통합대기환경등급 (1~4)
}
```


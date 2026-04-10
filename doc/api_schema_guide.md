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

/**
 * API 호출에 필요한 날짜 및 시간 포맷팅 유틸리티
 */

export const getApiDateTime = () => {
    const now = new Date();
    
    // YYYYMMDD
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const baseDate = `${year}${month}${day}`;
    
    // HH00 (현재 시각 기준으로 분을 00으로 고정)
    const hours = String(now.getHours()).padStart(2, '0');
    const baseTime = `${hours}00`;
    
    // 중기예보용 tmFc (06:00 또는 18:00 기준)
    const midTermHours = now.getHours() < 12 ? '0600' : '1800';
    const tmFc = `${baseDate}${midTermHours}`;
    
    // 지수용 time (YYYYMMDDHH)
    const time = `${baseDate}${hours}`;
    
    return {
      baseDate,
      baseTime,
      tmFc,
      time,
      now: now.toLocaleString()
    };
  };
  
  export const formatJSON = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

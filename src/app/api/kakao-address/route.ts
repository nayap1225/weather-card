import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const queryString = searchParams.toString();

  const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_API_KEY;

  // 1. 키 체크
  if (!KAKAO_KEY) {
    console.error("[Kakao API Proxy] API KEY가 설정되지 않았습니다.");
    return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
  }

  try {
    const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?${queryString}`, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_KEY}`,
      },
      next: { revalidate: 3600 },
    });

    // 3. API 응답 상태 확인
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: "Kakao API Error", detail: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("카카오 API 오류:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

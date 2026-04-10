import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "웨더리프",
  description: "오늘 날씨에 맞는 옷차림과 준비물을 추천해드려요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

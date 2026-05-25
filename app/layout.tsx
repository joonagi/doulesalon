import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOULE SALON | 신앙으로 문화를 읽는 매거진",
  description:
    "인터뷰, 에세이, 문화 브리핑, 가이드, 뉴스레터를 엮는 기독교 문화 매거진입니다.",
  metadataBase: new URL("http://doulesalon.com")
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

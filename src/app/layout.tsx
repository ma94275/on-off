import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ON & OFF",
  description: "전등 스위치를 통합 관리할 수 있습니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

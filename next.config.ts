import type { NextConfig } from "next";

// 프론트(브라우저 origin)와 백엔드가 서로 다른 도메인이라, 백엔드가 내려주는
// 로그인 쿠키(Domain 미지정 + SameSite=Lax)는 브라우저가 백엔드 도메인에만
// 저장하고 프론트로의 fetch/페이지 이동에는 실어 보내지 않는다.
// /api/v1/* 요청을 프론트 서버가 백엔드로 그대로 중계(rewrite)하면 브라우저
// 입장에서는 모든 요청이 프론트와 같은 origin이 되어 쿠키가 정상적으로 붙는다.
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!BACKEND_ORIGIN) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_ORIGIN}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

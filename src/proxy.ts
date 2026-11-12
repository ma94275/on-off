import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { USE_MOCK } from "@/lib/env";

// 백엔드가 발급하는 JWT httpOnly 쿠키의 이름을 프론트가 알지 못하므로,
// 쿠키 존재 여부 대신 GET /auth/me를 그대로 위임해 로그인 여부를 확인한다.
//
// 이 요청은 서버(Next.js) → 백엔드로 직접 나가는 서버 간 통신이라
// BACKEND_ORIGIN(서버 전용 env)을 쓴다. 브라우저 쿠키는 next.config.ts의
// rewrite 덕분에 프론트와 같은 origin에 저장되므로 그대로 실려 온다.
export async function proxy(request: NextRequest) {
  // 목 모드에서는 로그인 상태가 브라우저(localStorage)에만 있으므로
  // 서버에서 확인하지 않고, 클라이언트의 401 처리로 로그인 화면에 보낸다.
  if (USE_MOCK) return NextResponse.next();

  const backendOrigin = process.env.BACKEND_ORIGIN;
  if (!backendOrigin) {
    console.error(
      "[proxy] BACKEND_ORIGIN이 설정되지 않았습니다. .env.local을 확인하거나 NEXT_PUBLIC_USE_MOCK=true로 실행하세요.",
    );
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const cookie = request.headers.get("cookie") ?? "";

  try {
    const res = await fetch(`${backendOrigin}/api/v1/auth/me`, {
      headers: { cookie },
      cache: "no-store",
    });
    if (res.status === 200) {
      return NextResponse.next();
    }
  } catch (err) {
    console.error("[proxy] GET /auth/me 확인 실패:", err);
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!login|api|_next|favicon.ico|.*\\.(?:svg|png|ico|jpg)$).*)"],
};

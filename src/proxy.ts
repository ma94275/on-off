import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 백엔드가 발급하는 JWT httpOnly 쿠키의 이름을 프론트가 알지 못하므로,
// 쿠키 존재 여부 대신 GET /auth/me를 그대로 위임해 로그인 여부를 확인한다.
// (api.md 참고 — 쿠키 이름/만료 정책 미기재로 인한 임시 조치)
//
// 이 요청은 서버(Next.js) → 백엔드로 직접 나가는 서버 간 통신이라
// BACKEND_ORIGIN(서버 전용 env)을 쓴다. 브라우저가 보낸 쿠키는 이제
// next.config.ts의 rewrite 덕분에 프론트와 같은 origin에 저장되므로
// request.headers의 cookie에 정상적으로 실려 있다.
export async function proxy(request: NextRequest) {
  const backendOrigin = process.env.BACKEND_ORIGIN;
  const cookie = request.headers.get("cookie") ?? "";

  try {
    const res = await fetch(`${backendOrigin}/api/v1/auth/me`, {
      headers: { cookie },
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
  matcher: ["/((?!login|api|_next|favicon.ico).*)"],
};

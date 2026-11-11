"use client";
import { useEffect, useState } from "react";
import { getMe } from "@/entities/auth/api";

// 페이지 이동마다 헤더가 다시 그려져도 깜빡이지 않도록 한 번 받은 계정명을 기억한다.
let cachedUsername: string | null = null;

/** 로그아웃 시 호출해 다음 로그인 계정이 이전 이름을 보지 않게 한다. */
export function clearCachedAdmin() {
  cachedUsername = null;
}

/** 헤더의 관리자 표시. 계정명은 GET /auth/me에서 가져온다. */
export default function AdminIdentity() {
  const [username, setUsername] = useState<string | null>(cachedUsername);

  useEffect(() => {
    if (cachedUsername) return;
    let alive = true;
    getMe()
      .then((user) => {
        cachedUsername = user.username;
        if (alive) setUsername(user.username);
      })
      .catch(() => {
        // 실패해도 헤더는 역할 라벨만으로 표시한다 (401은 apiFetch가 로그인으로 보냄)
      });
    return () => {
      alive = false;
    };
  }, []);

  const initial = (username ?? "A").slice(0, 1).toUpperCase();

  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center rounded-md bg-subtle text-xs font-semibold text-ink-2"
      >
        {initial}
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-[13px] font-medium text-ink">
          {username ?? "…"}
        </span>
        <span className="text-[11px] text-ink-3">관리자</span>
      </span>
    </span>
  );
}

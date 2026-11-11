"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/entities/auth/api";
import { ApiRequestError } from "@/lib/api";
import { USE_MOCK } from "@/lib/env";
import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-4 hover:border-ink-4 focus:border-ink-3 focus:shadow-[0_0_0_3px_rgba(18,22,19,0.08)]";

export default function LoginView() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ username, password });
      router.push("/");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiRequestError && err.code === "UNAUTHORIZED") {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else if (err instanceof ApiRequestError && err.code === "NETWORK_ERROR") {
        setError("서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
      } else {
        setError("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 py-12">
      <div className="flex w-full max-w-[360px] flex-col gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo size={36} withText={false} />
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight text-ink">
              on &amp; off 관리자 로그인
            </h1>
            <p className="text-[13px] text-ink-3">
              스위치 관리 콘솔에 접속하려면 로그인하세요
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-6"
        >
          {USE_MOCK && (
            <p className="rounded-md bg-partial-bg px-3 py-2 text-xs leading-relaxed text-partial-text">
              <b className="font-semibold">목데이터 모드</b> · 아무 값으로나
              로그인할 수 있어요
            </p>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-ink-2">아이디</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-ink-2">비밀번호</span>
            <span className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-ink-3 transition-colors hover:bg-subtle hover:text-ink"
              >
                <EyeIcon off={showPassword} />
              </button>
            </span>
          </label>

          {error && (
            <p role="alert" className="text-[13px] text-danger">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={loading} className="mt-1 h-10 w-full">
            {loading ? "로그인 중…" : "로그인"}
          </Button>
        </form>

        <p className="text-center text-xs text-ink-4">
          계정 문의는 시스템 관리자에게 연락하세요
        </p>
      </div>
    </div>
  );
}

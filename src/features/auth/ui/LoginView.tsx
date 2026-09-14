"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/entities/auth/api";
import { ApiRequestError } from "@/lib/api";

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="w-5 h-5 text-text-20"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="w-5 h-5 text-text-20"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="w-5 h-5"
    >
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="w-5 h-5"
    >
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.16 5.32C10.06 5.11 11 5 12 5c6 0 9.5 6.5 9.5 6.5a15.6 15.6 0 0 1-3.24 4.06M6.6 6.6C4.3 8.06 2.5 10.5 2.5 12.5c0 0 3.5 6.5 9.5 6.5 1.2 0 2.28-.24 3.24-.63"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      } else {
        setError("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-bg-default">
      <div className="pointer-events-none absolute -top-32 -left-24 w-80 h-80 rounded-full bg-[rgba(74,222,128,0.14)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 w-96 h-96 rounded-full bg-[rgba(74,222,128,0.1)] blur-3xl" />

      <div className="relative flex flex-col gap-8 w-full max-w-lg mx-4 p-12 border-2 border-border-hover rounded-3xl bg-surface-20 shadow-2xl shadow-black/50">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex items-center px-[3px] py-[3px] w-16 h-9 rounded-full bg-green-10 border border-green-10 shadow-[0_0_20px_rgba(74,222,128,0.6)]">
            <div className="w-[30px] h-[30px] rounded-full bg-white translate-x-7 transition-transform" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-4xl font-sans">on & off</span>
            <span className="text-text-10 text-base">관리자 계정으로 로그인하세요</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-text-10 text-sm font-mono font-medium">아이디</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <MailIcon />
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-border-hover bg-bg-default text-text-10 text-base outline-none focus:border-green-10 focus:shadow-[0_0_0_4px_rgba(74,222,128,0.2)] transition-shadow"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-text-10 text-sm font-mono font-medium">비밀번호</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <LockIcon />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-border-hover bg-bg-default text-text-10 text-base outline-none focus:border-green-10 focus:shadow-[0_0_0_4px_rgba(74,222,128,0.2)] transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-20 hover:text-text-10 hover:cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-300 text-sm font-mono font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 py-4 rounded-full bg-green-10 text-bg-default font-bold text-base cursor-pointer shadow-[0_0_24px_rgba(74,222,128,0.3)] transition-shadow hover:shadow-[0_0_32px_rgba(74,222,128,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}

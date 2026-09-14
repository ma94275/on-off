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
      className="w-4 h-4 text-text-30"
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
      className="w-4 h-4 text-text-30"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginView() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      <div className="pointer-events-none absolute -top-32 -left-24 w-80 h-80 rounded-full bg-[rgba(74,222,128,0.12)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 w-96 h-96 rounded-full bg-[rgba(74,222,128,0.08)] blur-3xl" />

      <div className="relative flex flex-col gap-7 w-full max-w-md mx-4 p-10 border border-border-default rounded-3xl bg-surface-10 shadow-2xl shadow-black/40">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center px-[3px] py-[3px] w-14 h-8 rounded-full bg-green-10 border border-green-10 shadow-[0_0_16px_rgba(74,222,128,0.5)]">
            <div className="w-[26px] h-[26px] rounded-full bg-white translate-x-6 transition-transform" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-2xl font-sans">on & off</span>
            <span className="text-text-20 text-sm">관리자 계정으로 로그인하세요</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-text-20 text-xs font-mono">아이디</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <MailIcon />
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border-default bg-bg-default text-text-10 text-sm outline-none focus:border-green-10 focus:shadow-[0_0_0_3px_rgba(74,222,128,0.15)] transition-shadow"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-text-20 text-xs font-mono">비밀번호</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <LockIcon />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border-default bg-bg-default text-text-10 text-sm outline-none focus:border-green-10 focus:shadow-[0_0_0_3px_rgba(74,222,128,0.15)] transition-shadow"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 rounded-full bg-green-10 text-bg-default font-semibold text-sm cursor-pointer shadow-[0_0_20px_rgba(74,222,128,0.25)] transition-shadow hover:shadow-[0_0_28px_rgba(74,222,128,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}

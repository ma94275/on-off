"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/entities/auth/api";
import { ApiRequestError } from "@/lib/api";

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
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-6 w-full max-w-md p-8 border border-border-default rounded-md bg-surface-10">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-xl font-sans">on & off</span>
          <span className="text-text-20 text-sm">관리자 로그인</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-text-20 text-xs font-mono">아이디</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
              className="px-3 py-2 rounded-md border border-border-default bg-bg-default text-text-10 text-sm outline-none focus:border-border-hover"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-text-20 text-xs font-mono">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="px-3 py-2 rounded-md border border-border-default bg-bg-default text-text-10 text-sm outline-none focus:border-border-hover"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-2 rounded-md bg-green-10 text-bg-default font-medium text-sm cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
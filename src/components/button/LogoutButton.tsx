"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/entities/auth/api";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (err) {
      console.error("[API] 로그아웃 실패:", err);
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="text-xs font-mono text-text-20 hover:text-text-10 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
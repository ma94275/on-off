"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/entities/auth/api";
import Button from "@/components/ui/Button";
import { clearCachedAdmin } from "@/components/layout/AdminIdentity";

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
      clearCachedAdmin();
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loading}>
      {loading ? "로그아웃 중…" : "로그아웃"}
    </Button>
  );
}

"use client";
import { useDeviceContext, ApiStatus } from "@/context/DeviceContext";

const STATUS_CONFIG: Record<
  ApiStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  connecting: {
    label: "연결 중",
    dotClass: "bg-yellow-400 animate-pulse",
    textClass: "text-yellow-400",
  },
  connected: {
    label: "시스템 정상",
    dotClass: "bg-green-400",
    textClass: "text-green-400",
  },
  disconnected: {
    label: "연결 끊김",
    dotClass: "bg-gray-400",
    textClass: "text-gray-400",
  },
  error: {
    label: "연결 오류",
    dotClass: "bg-red-400 animate-pulse",
    textClass: "text-red-400",
  },
};

export default function ApiStatusBadge() {
  const { apiStatus } = useDeviceContext();
  const config = STATUS_CONFIG[apiStatus];

  return (
    <div
      className={`flex items-center gap-2 font-mono text-xs ${config.textClass}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
      {config.label}
    </div>
  );
}
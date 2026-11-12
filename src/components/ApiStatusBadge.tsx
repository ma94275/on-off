"use client";
import { useDeviceContext, ApiStatus } from "@/context/DeviceContext";

const STATUS_CONFIG: Record<
  ApiStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  connecting: {
    label: "연결 중",
    dotClass: "bg-partial animate-pulse",
    textClass: "text-partial-text",
  },
  connected: {
    label: "시스템 정상",
    dotClass: "bg-on",
    textClass: "text-ink-2",
  },
  disconnected: {
    label: "연결 끊김",
    dotClass: "bg-off",
    textClass: "text-ink-3",
  },
  error: {
    label: "연결 오류",
    dotClass: "bg-danger animate-pulse",
    textClass: "text-danger",
  },
};

export default function ApiStatusBadge() {
  const { apiStatus } = useDeviceContext();
  const config = STATUS_CONFIG[apiStatus];

  return (
    <span
      className={`flex items-center gap-2 text-[13px] ${config.textClass}`}
      title={`백엔드 연결 상태: ${config.label}`}
    >
      <span className="relative flex h-2 w-2">
        {apiStatus === "connected" && (
          <span className="absolute inset-0 animate-ping rounded-full bg-on opacity-40 [animation-duration:2.5s]" />
        )}
        <span className={`relative h-2 w-2 rounded-full ${config.dotClass}`} />
      </span>
      <span className="hidden sm:inline">{config.label}</span>
    </span>
  );
}

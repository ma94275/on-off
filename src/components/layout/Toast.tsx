"use client";
import { useEffect } from "react";
import { useDeviceContext } from "@/context/DeviceContext";

const AUTO_HIDE_MS = 4000;

export default function Toast() {
  const { notice, dismissNotice } = useDeviceContext();

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(dismissNotice, AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [notice, dismissNotice]);

  if (!notice) return null;

  const isError = notice.tone === "error";
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <div
        key={notice.id}
        role={isError ? "alert" : "status"}
        className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-lg bg-ink px-4 py-3 text-[13px] text-white shadow-pop"
      >
        <span
          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${isError ? "bg-[#ff7a70]" : "bg-partial"}`}
        />
        <span className="flex-1 leading-relaxed">{notice.message}</span>
        <button
          type="button"
          onClick={dismissNotice}
          aria-label="알림 닫기"
          className="-mr-1 rounded px-1 text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

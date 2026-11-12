import Link from "next/link";
import Logo from "./Logo";
import AdminIdentity from "./AdminIdentity";
import ApiStatusBadge from "@/components/ApiStatusBadge";
import LogoutButton from "@/components/button/LogoutButton";
import { USE_MOCK } from "@/lib/env";

function Divider() {
  return <span aria-hidden="true" className="h-5 w-px bg-line" />;
}

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="홈으로" className="rounded-md">
            <Logo />
          </Link>
          <span className="hidden text-[13px] text-ink-3 sm:inline">
            스위치 관리 콘솔
          </span>
          {USE_MOCK && (
            <span
              className="rounded bg-partial-bg px-1.5 py-0.5 text-[11px] font-medium text-partial-text"
              title="NEXT_PUBLIC_USE_MOCK=true — 백엔드 대신 목데이터 사용 중"
            >
              목데이터
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ApiStatusBadge />
          <Divider />
          <AdminIdentity />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

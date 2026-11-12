"use client";
import { useState } from "react";
import Link from "next/link";
import { useDeviceContext } from "@/context/DeviceContext";
import PageShell from "@/components/layout/PageShell";
import ActivateBadge from "@/components/badge/ActivateBadge";
import SwitchStrip from "@/components/indicator/SwitchStrip";
import Button, { LinkButton } from "@/components/ui/Button";
import { getZoneStatus } from "@/entities/status/util";
import { Status } from "@/entities/status/type";

type Filter = "all" | "on" | "off";

const FILTERS: { key: Filter; label: string; hint: string }[] = [
  { key: "all", label: "전체", hint: "모든 구역" },
  { key: "on", label: "켜짐", hint: "스위치가 하나라도 켜진 구역" },
  { key: "off", label: "꺼짐", hint: "모든 스위치가 꺼진 구역" },
];

// 데스크톱 표 열: 구역 | 상태 | 스위치 | 켜짐 | 동작
const ROW_GRID =
  "md:grid md:grid-cols-[minmax(0,2.4fr)_112px_minmax(0,1.3fr)_72px_104px] md:items-center md:gap-4";

function Stat({
  label,
  value,
  suffix,
  caption,
  children,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  caption: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 border-line px-4 py-4 sm:px-5 [&:not(:first-child)]:border-l">
      <span className="text-xs text-ink-3">{label}</span>
      <span className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold tabular-nums tracking-tight text-ink">
          {value}
        </span>
        {suffix && (
          <span className="text-sm tabular-nums text-ink-4">{suffix}</span>
        )}
      </span>
      {children}
      <span className="text-xs text-ink-3">{caption}</span>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="m6 3.5 4.5 4.5L6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RowSkeleton() {
  return (
    <div className={`border-b border-line px-4 py-3.5 ${ROW_GRID}`}>
      <div className="flex flex-col gap-1.5">
        <div className="h-3.5 w-28 animate-pulse rounded bg-subtle" />
        <div className="h-3 w-44 animate-pulse rounded bg-subtle" />
      </div>
      <div className="hidden h-5 w-16 animate-pulse rounded bg-subtle md:block" />
      <div className="hidden h-4 w-20 animate-pulse rounded bg-subtle md:block" />
    </div>
  );
}

export default function MainView() {
  const { zones, isLoading, apiStatus, refresh } = useDeviceContext();
  const [filter, setFilter] = useState<Filter>("all");

  const rows = zones.map((z) => ({
    zone: z,
    status: getZoneStatus(z.deviceStatus.map((d) => d.status)),
    onCount: z.deviceStatus.filter((d) => d.status === "on").length,
  }));

  const count = {
    all: rows.length,
    on: rows.filter((r) => r.status === "on").length,
    partial: rows.filter((r) => r.status === "partial").length,
    off: rows.filter((r) => r.status === "off").length,
  };
  const totalSwitches = zones.reduce((acc, z) => acc + z.deviceStatus.length, 0);
  const activeSwitches = rows.reduce((acc, r) => acc + r.onCount, 0);
  const activeRate =
    totalSwitches === 0 ? 0 : Math.round((activeSwitches / totalSwitches) * 100);

  // "켜짐" 필터는 스위치가 하나라도 켜진 구역(전체 켜짐 + 일부 켜짐)을 보여준다.
  const matches = (status: Status, f: Filter) =>
    f === "all" || (f === "on" ? status !== "off" : status === "off");
  const tabCount = (f: Filter) => rows.filter((r) => matches(r.status, f)).length;
  const visible = rows.filter((r) => matches(r.status, filter));
  const loadFailed = !isLoading && apiStatus === "error";

  return (
    <PageShell>
      {/* 페이지 제목 */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-ink">관리 구역</h1>
          <p className="text-[13px] text-ink-3">
            구역을 선택해 스위치를 켜고 끌 수 있어요
          </p>
        </div>
        <LinkButton href="/new" variant="primary">
          <PlusIcon />
          구역 추가
        </LinkButton>
      </div>

      {/* 개요 */}
      <section
        aria-label="개요"
        className="grid grid-cols-3 rounded-lg border border-line bg-surface lg:grid-cols-[1fr_1fr_1.2fr_1.8fr]"
      >
        <Stat label="총 구역" value={isLoading ? "–" : zones.length} caption="등록된 관리 구역" />
        <Stat label="총 스위치" value={isLoading ? "–" : totalSwitches} caption="전체 제어 스위치" />
        <Stat
          label="켜진 스위치"
          value={isLoading ? "–" : activeSwitches}
          suffix={isLoading ? undefined : `/ ${totalSwitches}`}
          caption={`현재 가동률 ${activeRate}%`}
        />
        <div className="col-span-3 flex flex-col gap-2.5 border-t border-line px-4 py-4 sm:px-5 lg:col-span-1 lg:border-l lg:border-t-0">
          <span className="text-xs text-ink-3">구역 상태</span>
          <div className="flex h-2 gap-[2px] overflow-hidden rounded-sm bg-subtle">
            {(["on", "partial", "off"] as const)
              .filter((k) => count[k] > 0)
              .map((k) => (
                <span
                  key={k}
                  className={`h-full ${k === "on" ? "bg-on" : k === "partial" ? "bg-partial" : "bg-off"}`}
                  style={{ flexGrow: count[k], flexBasis: 0 }}
                />
              ))}
          </div>
          <dl className="grid grid-cols-3 gap-2">
            {(
              [
                ["on", "전체 켜짐", "bg-on"],
                ["partial", "일부 켜짐", "bg-partial"],
                ["off", "꺼짐", "bg-off"],
              ] as const
            ).map(([k, label, dot]) => (
              <div key={k} className="flex flex-col gap-0.5">
                <dt className="flex items-center gap-1.5 text-xs text-ink-3">
                  <span className={`h-2 w-2 rounded-[2px] ${dot}`} />
                  {label}
                </dt>
                <dd className="pl-3.5 text-base font-semibold tabular-nums text-ink">
                  {isLoading ? "–" : count[k]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 구역 목록 */}
      <section className="overflow-hidden rounded-lg border border-line bg-surface">
        <div className="flex flex-col gap-3 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-ink">
            구역 목록
            <span className="ml-1.5 font-normal tabular-nums text-ink-4">{count.all}</span>
          </h2>
          <div role="tablist" aria-label="상태 필터" className="flex gap-0.5 overflow-x-auto rounded-md bg-subtle p-0.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filter === f.key}
                title={f.hint}
                onClick={() => setFilter(f.key)}
                className={`flex h-7 shrink-0 items-center gap-1.5 rounded px-2.5 text-[13px] transition-colors ${
                  filter === f.key
                    ? "bg-surface font-medium text-ink shadow-[0_1px_2px_rgba(18,22,19,0.08)]"
                    : "text-ink-3 hover:text-ink"
                }`}
              >
                {f.label}
                <span className="tabular-nums text-ink-4">{tabCount(f.key)}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          aria-hidden="true"
          className={`hidden border-b border-line bg-canvas/60 px-4 py-2 text-xs text-ink-3 ${ROW_GRID}`}
        >
          <span>구역</span>
          <span>상태</span>
          <span>스위치</span>
          <span className="text-right">켜짐</span>
          <span />
        </div>

        {loadFailed ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <span className="text-sm font-semibold text-ink">구역 목록을 불러오지 못했어요</span>
            <span className="text-[13px] text-ink-3">서버 연결을 확인한 뒤 다시 시도해주세요.</span>
            <Button size="sm" onClick={() => refresh()}>
              다시 시도
            </Button>
          </div>
        ) : isLoading ? (
          Array.from({ length: 4 }, (_, i) => <RowSkeleton key={i} />)
        ) : visible.length === 0 ? (
          <div className="px-6 py-12 text-center text-[13px] text-ink-3">
            {count.all === 0 ? "아직 등록된 구역이 없어요." : "이 상태에 해당하는 구역이 없어요."}
          </div>
        ) : (
          <ul>
            {visible.map(({ zone, status, onCount }) => (
              <li key={zone.id} className="border-b border-line last:border-b-0">
                <Link
                  href={`/${zone.id}`}
                  className={`group flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-canvas ${ROW_GRID}`}
                >
                  <div className="flex min-w-0 items-start justify-between gap-3 md:block">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{zone.title}</p>
                      <p className="truncate text-[13px] text-ink-3">
                        {zone.description || "설명 없음"}
                      </p>
                    </div>
                    <span className="md:hidden">
                      <ActivateBadge status={status} />
                    </span>
                  </div>

                  <span className="hidden md:block">
                    <ActivateBadge status={status} />
                  </span>

                  <div className="flex items-center justify-between gap-3 md:contents">
                    <SwitchStrip
                      switches={zone.deviceStatus.map((d) => ({ title: d.title, status: d.status }))}
                    />
                    <span className="mr-auto text-[13px] tabular-nums md:mr-0 md:text-right">
                      <span className="font-semibold text-ink">{onCount}</span>
                      <span className="text-ink-4"> / {zone.deviceStatus.length}</span>
                    </span>
                    <span className="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-line px-2.5 text-[13px] font-medium text-ink-2 transition-colors group-hover:border-line-strong group-hover:bg-surface group-hover:text-ink md:justify-self-end">
                      제어하기
                      <ChevronIcon />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

      </section>
    </PageShell>
  );
}

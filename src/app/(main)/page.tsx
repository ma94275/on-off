"use client";

import { useEffect, useState } from "react";

type SwitchItem = {
  n: string;
  d: string;
  ic: string;
};

type Zone = {
  name: string;
  desc: string;
  icon: string;
  sw: SwitchItem[];
};

export default function SwitchControlPanel() {
  const [currentPage, setCurrentPage] = useState<"zones" | "ctrl">("zones");

  const [currentZone, setCurrentZone] = useState(0);

  const [clock, setClock] = useState("--:--");

  const [activeTab, setActiveTab] = useState<"a" | "b">("a");

  const [lastChange, setLastChange] = useState("—");

  const zones: Zone[] = [
    {
      name: "1층 서버실",
      desc: "메인 서버 랙 및 네트워크 장비 전원 제어",
      icon: "🏢",
      sw: [
        { n: "전원 모듈", d: "메인 전원 공급 제어", ic: "⚡" },
        { n: "네트워크", d: "무선 통신 인터페이스", ic: "📡" },
        { n: "오디오", d: "출력 장치 활성화", ic: "🔊" },
      ],
    },
    {
      name: "2층 오피스",
      desc: "조명, 공조, 오디오 시스템 통합 제어",
      icon: "🏗️",
      sw: [
        { n: "조명 시스템", d: "전체 조명 회로 제어", ic: "💡" },
        { n: "공조 장치", d: "냉난방 통합 제어", ic: "🌡️" },
        { n: "오디오", d: "회의실 음향 장치", ic: "🔉" },
      ],
    },
    {
      name: "지하 기계실",
      desc: "냉각 시스템 및 발전기 보조 전원 제어",
      icon: "🔧",
      sw: [
        { n: "냉각 펌프", d: "메인 냉각 순환 펌프", ic: "❄️" },
        { n: "보조 발전기", d: "비상 전원 공급 장치", ic: "⚙️" },
        { n: "배기 팬", d: "환기 시스템 제어", ic: "🌀" },
      ],
    },
    {
      name: "창고 동",
      desc: "재고 관리 구역 보안등 및 환기 제어",
      icon: "📦",
      sw: [
        { n: "보안 조명", d: "외부 보안등 회로", ic: "🔦" },
        { n: "환기 시스템", d: "창고 내부 공기 순환", ic: "💨" },
        { n: "셔터 제어", d: "자동 도어 시스템", ic: "🚪" },
      ],
    },
  ];

  const [zoneStates, setZoneStates] = useState<boolean[][]>(
    zones.map(() => [false, false, false]),
  );

  useEffect(() => {
    const tick = () => {
      const n = new Date();

      setClock(
        `${n.getHours().toString().padStart(2, "0")}:${n
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      );
    };

    tick();

    const interval = setInterval(tick, 10000);

    return () => clearInterval(interval);
  }, []);

  const currentStates = zoneStates[currentZone];

  const updateSwitch = (idx: number, value: boolean) => {
    const copy = [...zoneStates];

    copy[currentZone][idx] = value;

    setZoneStates(copy);
  };

  const toggleSwitch = (idx: number) => {
    updateSwitch(idx, !currentStates[idx]);
  };

  const setAllSwitches = (value: boolean) => {
    const copy = [...zoneStates];

    copy[currentZone] = [value, value, value];

    setZoneStates(copy);
  };

  const goToZone = (idx: number) => {
    setCurrentZone(idx);
    setCurrentPage("ctrl");
  };

  const goBack = () => {
    setLastChange("방금 전");
    setCurrentPage("zones");
  };

  const totalOn = zoneStates.flat().filter(Boolean).length;

  const zoneOnCount = currentStates.filter(Boolean).length;

  const fullZones = zoneStates.filter(
    (s) => s.filter(Boolean).length === 3,
  ).length;

  const partialZones = zoneStates.filter((s) => {
    const c = s.filter(Boolean).length;

    return c > 0 && c < 3;
  }).length;

  const offZones = zoneStates.filter(
    (s) => s.filter(Boolean).length === 0,
  ).length;

  return (
    <div className="min-h-screen bg-[#0e0f11] text-[#f0f0f0]">
      {/* PAGE ZONES */}
      {currentPage === "zones" && (
        <div className="flex min-h-screen flex-col">
          {/* NAV */}
          <nav className="sticky top-0 z-50 flex h-[60px] items-center justify-between border-b border-white/10 bg-[#0e0f11]/90 px-10 backdrop-blur-xl">
            <span className="cursor-pointer font-mono text-sm font-medium tracking-wide">
              ctrl<span className="text-green-400">.</span>panel
            </span>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
                <div className="h-[7px] w-[7px] rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>

                <span>시스템 정상</span>
              </div>

              <span className="font-mono text-xs text-zinc-500">{clock}</span>
            </div>
          </nav>

          {/* MAIN */}
          <main className="flex-1 p-10">
            {/* HEADER */}
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h1 className="mb-1 text-[26px] font-semibold tracking-tight">
                  관리 구역
                </h1>

                <p className="text-sm text-zinc-500">
                  구역을 선택해 스위치를 제어하세요
                </p>
              </div>

              <div className="flex gap-2">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#16181c] px-4 py-2 font-mono text-xs text-zinc-400">
                  <div className="h-[6px] w-[6px] rounded-full bg-green-400"></div>
                  <b className="text-white">{fullZones}</b> 활성
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#16181c] px-4 py-2 font-mono text-xs text-zinc-400">
                  <div className="h-[6px] w-[6px] rounded-full bg-amber-400"></div>
                  <b className="text-white">{partialZones}</b> 부분
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#16181c] px-4 py-2 font-mono text-xs text-zinc-400">
                  <div className="h-[6px] w-[6px] rounded-full bg-zinc-600"></div>
                  <b className="text-white">{offZones}</b> 비활성
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="mb-8 grid grid-cols-4 gap-3">
              <div className="rounded-xl border border-green-500/20 bg-[#16181c] p-5">
                <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  총 구역
                </div>

                <div className="text-3xl font-semibold text-green-400">4</div>

                <div className="mt-1 text-xs text-zinc-500">
                  등록된 관리 구역
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#16181c] p-5">
                <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  총 스위치
                </div>

                <div className="text-3xl font-semibold">12</div>

                <div className="mt-1 text-xs text-zinc-500">
                  전체 제어 포인트
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#16181c] p-5">
                <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  활성 스위치
                </div>

                <div className="text-3xl font-semibold">{totalOn}</div>

                <div className="mt-1 text-xs text-zinc-500">
                  현재 켜진 스위치
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#16181c] p-5">
                <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  마지막 변경
                </div>

                <div className="text-lg font-semibold">{lastChange}</div>

                <div className="mt-1 text-xs text-zinc-500">최근 조작 시각</div>
              </div>
            </div>

            {/* SECTION LABEL */}
            <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              구역 목록
            </div>

            {/* GRID */}
            <div className="grid grid-cols-3 gap-4">
              {zones.map((z, zi) => {
                const s = zoneStates[zi];

                const on = s.filter(Boolean).length;

                const isFull = on === 3;

                const isPartial = on > 0 && on < 3;

                return (
                  <div
                    key={zi}
                    onClick={() => goToZone(zi)}
                    className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1
                      
                      ${
                        isFull
                          ? "border-green-500/30 bg-green-500/[0.03]"
                          : isPartial
                            ? "border-amber-400/30 bg-amber-400/[0.03]"
                            : "border-white/10 bg-[#16181c]"
                      }
                    `}
                  >
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#1e2127] text-xl">
                        {z.icon}
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 font-mono text-[11px]
                          
                          ${
                            isFull
                              ? "border-green-500/20 bg-green-500/10 text-green-400"
                              : isPartial
                                ? "border-amber-400/20 bg-amber-400/10 text-amber-400"
                                : "border-white/10 bg-[#1e2127] text-zinc-500"
                          }
                        `}
                      >
                        {isFull ? "활성" : isPartial ? "부분 활성" : "비활성"}
                      </span>
                    </div>

                    <div className="mb-1 text-[15px] font-medium">{z.name}</div>

                    <div className="mb-6 text-sm leading-relaxed text-zinc-500">
                      {z.desc}
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                      <div className="flex gap-[5px]">
                        {s.map((v, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full
                              
                              ${
                                v
                                  ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                                  : "bg-zinc-700"
                              }
                            `}
                          />
                        ))}
                      </div>

                      <span className="text-zinc-500 transition-all duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* ADD CARD */}
              <div className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-[#16181c] transition-all duration-200 hover:-translate-y-1 hover:border-zinc-500">
                <div className="text-2xl text-zinc-500">＋</div>

                <div className="text-sm text-zinc-500">구역 추가</div>
              </div>
            </div>
          </main>

          {/* FOOTER */}
          <footer className="flex items-center justify-between border-t border-white/10 px-10 py-4">
            <span className="font-mono text-xs text-zinc-500">
              ctrl.panel v0.1
            </span>

            <span className="font-mono text-xs text-zinc-500">
              총 4개 구역 · 12개 스위치
            </span>
          </footer>
        </div>
      )}

      {/* CONTROL PAGE */}
      {currentPage === "ctrl" && (
        <div className="flex min-h-screen flex-col">
          {/* NAV */}
          <nav className="sticky top-0 z-50 flex h-[60px] items-center justify-between border-b border-white/10 bg-[#0e0f11]/90 px-10 backdrop-blur-xl">
            <span className="font-mono text-sm font-medium tracking-wide">
              ctrl<span className="text-green-400">.</span>panel
            </span>

            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={goBack}
                className="text-zinc-500 transition-colors hover:text-white"
              >
                관리 구역
              </button>

              <span className="text-zinc-700">/</span>

              <span>{zones[currentZone].name}</span>
            </div>

            <div className="font-mono text-xs text-zinc-500">
              {zoneOnCount > 0 ? "활성 디바이스 있음" : "대기 중"}
            </div>
          </nav>

          {/* MAIN */}
          <main className="flex-1 p-10">
            {/* HEAD */}
            <div className="mb-8 flex items-center gap-4">
              <button
                onClick={goBack}
                className="rounded-lg border border-white/10 bg-[#16181c] px-4 py-2 text-sm text-zinc-400 transition-all hover:bg-[#1e2127] hover:text-white"
              >
                ← 목록
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#1e2127] text-lg">
                {zones[currentZone].icon}
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {zones[currentZone].name}
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                  {zones[currentZone].desc}
                </p>
              </div>
            </div>

            {/* TABS */}
            <div className="mb-7 flex gap-1">
              <button
                onClick={() => setActiveTab("a")}
                className={`rounded-md border px-4 py-2 text-sm transition-all
                  
                  ${
                    activeTab === "a"
                      ? "border-white/20 bg-[#1e2127] text-white"
                      : "border-white/10 text-zinc-500 hover:text-white"
                  }
                `}
              >
                가로 목록
              </button>

              <button
                onClick={() => setActiveTab("b")}
                className={`rounded-md border px-4 py-2 text-sm transition-all
                  
                  ${
                    activeTab === "b"
                      ? "border-white/20 bg-[#1e2127] text-white"
                      : "border-white/10 text-zinc-500 hover:text-white"
                  }
                `}
              >
                세로 카드
              </button>
            </div>

            {/* TAB A */}
            {activeTab === "a" && (
              <>
                {/* MASTER */}
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-[#16181c] p-5">
                  <div>
                    <h2 className="text-sm font-medium">전체 제어</h2>

                    <p className="mt-1 font-mono text-xs text-zinc-500">
                      {zoneOnCount === 0
                        ? "모든 스위치가 꺼져 있습니다"
                        : `${zoneOnCount}개 스위치 활성 중`}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={zoneOnCount === 3}
                    onChange={(e) => setAllSwitches(e.target.checked)}
                    className="h-5 w-5 accent-green-400"
                  />
                </div>

                {/* ROWS */}
                <div className="flex flex-col gap-2">
                  {zones[currentZone].sw.map((sw, i) => (
                    <div
                      key={i}
                      onClick={() => toggleSwitch(i)}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border p-5 transition-all
                        
                        ${
                          currentStates[i]
                            ? "border-green-500/20 bg-green-500/[0.03]"
                            : "border-white/10 bg-[#16181c] hover:bg-[#1e2127]"
                        }
                      `}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border text-lg
                          
                          ${
                            currentStates[i]
                              ? "border-green-500/20 bg-green-500/10"
                              : "border-white/10 bg-[#1e2127]"
                          }
                        `}
                      >
                        {sw.ic}
                      </div>

                      <div className="flex-1">
                        <div className="text-sm font-medium">{sw.n}</div>

                        <div className="mt-1 text-xs text-zinc-500">{sw.d}</div>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 font-mono text-[11px]
                          
                          ${
                            currentStates[i]
                              ? "border-green-500/20 bg-green-500/10 text-green-400"
                              : "border-white/10 bg-[#1e2127] text-zinc-500"
                          }
                        `}
                      >
                        {currentStates[i] ? "켜짐" : "꺼짐"}
                      </span>

                      <input
                        type="checkbox"
                        checked={currentStates[i]}
                        onChange={(e) => updateSwitch(i, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-5 w-5 accent-green-400"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* TAB B */}
            {activeTab === "b" && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  {zones[currentZone].sw.map((sw, i) => (
                    <div
                      key={i}
                      onClick={() => toggleSwitch(i)}
                      className={`flex min-h-[260px] cursor-pointer flex-col rounded-2xl border p-6 transition-all hover:-translate-y-1
                        
                        ${
                          currentStates[i]
                            ? "border-green-500/20 bg-green-500/[0.03]"
                            : "border-white/10 bg-[#16181c]"
                        }
                      `}
                    >
                      <div className="mb-auto flex items-start justify-between">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl
                            
                            ${
                              currentStates[i]
                                ? "border-green-500/20 bg-green-500/10"
                                : "border-white/10 bg-[#1e2127]"
                            }
                          `}
                        >
                          {sw.ic}
                        </div>

                        <span className="font-mono text-xs text-zinc-500">
                          #{String(i + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="mt-6 border-t border-white/10 pt-5">
                        <div className="mb-1 text-sm font-medium">{sw.n}</div>

                        <div className="mb-4 text-xs leading-relaxed text-zinc-500">
                          {sw.d}
                        </div>

                        <div
                          className={`flex items-center gap-2 font-mono text-xs
                            
                            ${
                              currentStates[i]
                                ? "text-green-400"
                                : "text-zinc-500"
                            }
                          `}
                        >
                          <div
                            className={`h-[6px] w-[6px] rounded-full
                              
                              ${
                                currentStates[i]
                                  ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                                  : "bg-zinc-700"
                              }
                            `}
                          />

                          {currentStates[i] ? "켜짐" : "꺼짐"}
                        </div>
                      </div>

                      <div className="mt-4">
                        <input
                          type="checkbox"
                          checked={currentStates[i]}
                          onChange={(e) => updateSwitch(i, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-5 w-5 accent-green-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </main>

          {/* FOOTER */}
          <footer className="flex items-center justify-between border-t border-white/10 px-10 py-4">
            <span className="font-mono text-xs text-zinc-500">
              구역: {zones[currentZone].name}
            </span>

            <div className="flex gap-2">
              {currentStates.map((v, i) => (
                <span
                  key={i}
                  className={`rounded-full border px-3 py-1 font-mono text-[11px]
                    
                    ${
                      v
                        ? "border-green-500/20 bg-green-500/10 text-green-400"
                        : "border-white/10 bg-[#16181c] text-zinc-500"
                    }
                  `}
                >
                  SW{i + 1}: {v ? "켜짐" : "꺼짐"}
                </span>
              ))}
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

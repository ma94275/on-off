"use client";
import { useState } from "react";
import { useMqttContext } from "@/context/MqttContext";
import LiveDot from "@/components/dot/LiveDot";
import StatusBadge from "@/components/badge/StatusBadge";
import SummaryCard from "@/components/card/SummaryCard";
import ZoneCard from "@/components/card/ZoneCard";
import AddButton from "@/components/button/AddButton";
import Link from "next/link";

export default function MainView() {
  const [isOn, setIsOn] = useState("zone");
  const { zones: ZONES } = useMqttContext();

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed top-0 flex items-center justify-between w-full px-10 py-5 border-b border-border-default bg-bg-default">
        <span className="font-bold font-snas">on & off</span>
        <div className="flex items-center gap-2 font-mono text-xs text-text-20">
          <LiveDot />
          시스템 정상
        </div>
      </div>

      <div className="flex flex-col pt-25 p-10 gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-2xl">관리 구역</span>
            <span className="text-text-20 text-sm">
              구역을 선택해 스위치를 제어하세요
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge
              number={
                ZONES.filter((z) =>
                  z.deviceStatus.some((ds) => ds.status === "on"),
                ).length
              }
              title="활성"
              status="on"
            />
            <StatusBadge
              number={
                ZONES.filter((z) =>
                  z.deviceStatus.every((ds) => ds.status === "off"),
                ).length
              }
              title="비활성"
              status="off"
            />
            <StatusBadge
              number={
                ZONES.filter(
                  (z) =>
                    z.deviceStatus.some((ds) => ds.status === "on") &&
                    z.deviceStatus.some((ds) => ds.status === "off"),
                ).length
              }
              title="부분"
              status="partial"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-3">
          <SummaryCard
            title="총 구역"
            number={ZONES.length}
            description="등록된 관리 구역"
            status={isOn === "zone" ? "on" : "off"}
            onClick={() => setIsOn("zone")}
          />
          <SummaryCard
            title="총 스위치"
            number={ZONES.reduce((acc, z) => acc + z.deviceStatus.length, 0)}
            description="전체 제어 스위치"
            status={isOn === "switch" ? "on" : "off"}
            onClick={() => setIsOn("switch")}
          />
          <SummaryCard
            title="활성 스위치"
            number={ZONES.reduce(
              (acc, z) =>
                acc + z.deviceStatus.filter((ds) => ds.status === "on").length,
              0,
            )}
            description="현재 활성화된 스위치"
            status={isOn === "active" ? "on" : "off"}
            onClick={() => setIsOn("active")}
          />
          <div className="invisible" />
        </div>

        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs text-text-20">구역 목록</span>
          <div className="gap-4 grid grid-cols-3">
            {ZONES.map((zone) => (
              <Link key={zone.id} href={`/main/${zone.id}`}>
                <ZoneCard
                  title={zone.title}
                  description={zone.description}
                  deviceStatus={zone.deviceStatus.map((ds) => ds.status)}
                />
              </Link>
            ))}
            <AddButton />
          </div>
        </div>
      </div>
    </div>
  );
}

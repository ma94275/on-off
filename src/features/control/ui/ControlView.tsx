"use client";
import { useState } from "react";
import { ZONES } from "@/entities/zone/mock";
import SortRow from "./SortRow";
import SortCol from "./SortCol";
import LiveDot from "@/components/dot/LiveDot";
import BackButton from "@/components/button/BackButton";
import CardButton from "@/components/button/CardButton";
import Link from "next/link";

export default function Page() {
  const [selected, setSelected] = useState("row");
  const zone = ZONES.find((z) => z.id === 1);

  if (!zone) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed top-0 flex items-center justify-between w-full px-10 py-5 border-b border-border-default bg-bg-default">
        <span className="font-bold font-snas">on & off</span>
        <div className="flex items-center gap-2 font-mono text-xs text-text-20">
          <LiveDot />
          활성 데이터
        </div>
      </div>

      <div className="flex flex-col pt-25 p-10 gap-8">
        <div className="flex items-center gap-4">
          <Link href={`/main`}>
            <BackButton />
          </Link>
          <div className="w-10 h-10 border border-border-default rounded-lg bg-surface-10"></div>
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-semibold tracking-tight">
              {zone.title}
            </span>
            <span className="text-sm text-text-20">{zone.description}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CardButton
            title="가로 버튼"
            isSelected={selected === "row"}
            onClick={() => setSelected("row")}
          />
          <CardButton
            title="세로 버튼"
            isSelected={selected === "col"}
            onClick={() => setSelected("col")}
          />
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {selected === "row" ? <SortRow /> : <SortCol />}
        </div>
      </div>
    </div>
  );
}

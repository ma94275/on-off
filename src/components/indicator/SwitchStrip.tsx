import { BinaryStatus } from "@/entities/status/type";

interface SwitchStripProps {
  switches: { title: string; status: BinaryStatus }[];
}

/**
 * 구역의 스위치를 순서대로 한 칸씩 보여주는 표시.
 * 켜진 칸은 초록, 꺼진 칸은 회색이라 몇 번째 스위치가 켜졌는지까지 한눈에 보인다.
 */
export default function SwitchStrip({ switches }: SwitchStripProps) {
  if (switches.length === 0) {
    return <span className="text-xs text-ink-4">스위치 없음</span>;
  }

  return (
    <span
      className="flex flex-wrap gap-[3px]"
      aria-label={switches
        .map((s) => `${s.title} ${s.status === "on" ? "켜짐" : "꺼짐"}`)
        .join(", ")}
    >
      {switches.map((s, i) => (
        <span
          key={i}
          title={`${s.title} · ${s.status === "on" ? "켜짐" : "꺼짐"}`}
          className={`h-4 w-2.5 rounded-[2px] ${
            s.status === "on" ? "bg-on" : "bg-off/60"
          }`}
        />
      ))}
    </span>
  );
}

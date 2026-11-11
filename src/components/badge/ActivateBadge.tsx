import { Status } from "@/entities/status/type";

interface ActivateBadgeProps {
  status: Status;
  onLabel?: string;
  offLabel?: string;
  partialLabel?: string;
}

const STYLE: Record<Status, { box: string; dot: string }> = {
  on: { box: "bg-on-bg text-on-text", dot: "bg-on" },
  partial: { box: "bg-partial-bg text-partial-text", dot: "bg-partial" },
  off: { box: "bg-off-bg text-off-text", dot: "bg-off" },
};

/** 상태 라벨. 알약형 대신 작은 사각형 + 점 */
export default function ActivateBadge({
  status,
  onLabel = "전체 켜짐",
  offLabel = "꺼짐",
  partialLabel = "일부 켜짐",
}: ActivateBadgeProps) {
  const label =
    status === "on" ? onLabel : status === "partial" ? partialLabel : offLabel;
  const s = STYLE[status];

  return (
    <span
      className={`inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded px-1.5 text-xs font-medium ${s.box}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}

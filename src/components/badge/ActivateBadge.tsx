import { StatusProps } from "@/entities/status/type";

interface ActivateBadgeProps extends StatusProps {
  onLabel?: string;
  offLabel?: string;
  partialLabel?: string;
}

export default function ActivateBadge({
  status,
  onLabel = "활성",
  offLabel = "비활성",
  partialLabel = "부분 활성",
}: ActivateBadgeProps) {
  const label =
    status === "on" ? onLabel : status === "partial" ? partialLabel : offLabel;

  return (
    <span
      className={`items-center border px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-[-0.1em]
        ${
          status === "on"
            ? "bg-green-30 border-green-20 text-green-10"
            : status === "partial"
              ? "bg-yellow-30 border-yellow-20 text-yellow-10"
              : "bg-surface-20 border-border-default text-text-30"
        }`}
    >
      {label}
    </span>
  );
}

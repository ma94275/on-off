import { StatusProps } from "@/entities/status/type";

export default function ActivateBadge({ status }: StatusProps) {
  return (
    <span
      className={`items-cneter border px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-[-0.1em]
        ${
          status === "on"
            ? "bg-green-30 border-green-20 text-green-10"
            : status === "partial"
              ? "bg-yellow-30 border-yellow-20 text-yellow-10"
              : "bg-surface-20 border-border-default text-text-30"
        }`}
    >
      {status === "on" ? "활성" : status === "partial" ? "부분 활성" : "비활성"}
    </span>
  );
}

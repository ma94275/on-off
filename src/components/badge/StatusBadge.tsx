import StatusDot from "../dot/StatusDot";
import { Status } from "@/entities/status/type";

interface StatusBadgeProps {
  number: number;
  title: string;
  status: Status;
}

export default function StatusBadge({
  number,
  title,
  status,
}: StatusBadgeProps) {
  return (
    <span
      className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-border-default rounded-full
      font-mono text-[12px] bg-surface-10"
    >
      <StatusDot status={status} />
      <span className="font-bold font-sans">{number}</span>
      <span className="text-text-20 ml-1.5">{title}</span>
    </span>
  );
}

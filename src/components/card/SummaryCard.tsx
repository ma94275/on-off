import { BinaryStatus } from "@/entities/status/type";

interface SummaryCardProps {
  title: string;
  number: number;
  description: string;
  status: BinaryStatus;
  onClick?: () => void;
}

export default function SummaryCard({
  title,
  number,
  description,
  status,
  onClick,
}: SummaryCardProps) {
  return (
    <div
      className={`flex flex-col items-start w-full p-4 gap-1 rounded-xl border bg-surface-10 font-sans text-text-30 duration-200
      ${status === "on" ? "border-green-20" : "border-border-default"}`}
      onClick={onClick}
    >
      <span className="font-mono text-[11px] tracking-tight">{title}</span>
      <span
        className={`font-semibold text-[24px] duration-200
        ${status === "on" ? "text-green-10" : "text-white"}`}
      >
        {number}
      </span>
      <span className="text-[12px]">{description}</span>
    </div>
  );
}

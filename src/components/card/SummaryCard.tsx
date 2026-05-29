import { BinaryStatus } from "@/entities/status/type";

interface SummaryCardProps {
  title: string;
  number: number;
  description: string;
  status: BinaryStatus;
}

export default function SummaryCard({
  title,
  number,
  description,
  status,
}: SummaryCardProps) {
  return (
    <div
      className={`flex flex-col items-start p-4 gap-1 rounded-xl border font-sans text-text-30
      ${status === "on" ? "border-green-20" : "border-border-default"}`}
    >
      <span className="font-mono text-[11px] tracking-tight">{title}</span>
      <span
        className={`font-semibold text-[24px]
        ${status === "on" ? "text-green-10" : "text-white"}`}
      >
        {number}
      </span>
      <span className="text-[12px]">{description}</span>
    </div>
  );
}

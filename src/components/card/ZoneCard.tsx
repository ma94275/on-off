import ActivateBadge from "../badge/ActivateBadge";
import StatusDot from "../dot/StatusDot";
import { BinaryStatus } from "@/entities/status/type";

interface ZoneCardProps {
  title: string;
  description: string;
  deviceStatus: BinaryStatus[];
}

export default function ZoneCard({
  title,
  description,
  deviceStatus,
}: ZoneCardProps) {
  const status = deviceStatus.every((d) => d === "on")
    ? "on"
    : deviceStatus.every((d) => d === "off")
      ? "off"
      : "partial";

  return (
    <div
      className={`flex flex-col border rounded-2xl p-5 gap-6 bg-surface-10 font-sans 
      ${status === "on" ? "border-green-20" : status === "partial" ? "border-yellow-20" : "border-border-default"}
      group hover:cursor-pointer hover:-translate-y-2 transition-transform duration-200`}
    >
      <div>
        <ActivateBadge status={status} />
      </div>
      <div>
        <span className="text-[15px] font-semibold">{title}</span>
        <p className="text-text-30 text-sm">{description}</p>
      </div>
      <div className="flex justify-between items-center border-t border-border-default pt-4">
        <div className="flex gap-[5px]">
          {deviceStatus.map((status, index) => (
            <StatusDot key={index} status={status} />
          ))}
        </div>
        <span className="text-text-20 text-sm group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </div>
  );
}

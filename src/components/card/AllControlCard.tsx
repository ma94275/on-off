import Switch from "../switch/Switch";
import { Status } from "@/entities/status/type";

interface AllControlCardProps {
  partNumber: number;
  allNumber: number;
  isOn: boolean;
  status: Status;
  onClick: () => void;
}

export default function AllControlCard({
  partNumber,
  allNumber,
  isOn,
  status,
  onClick,
}: AllControlCardProps) {
  let description = "";
  if (partNumber === allNumber || isOn === true) {
    description = "모든 스위치가 켜져 있습니다";
    isOn = true;
    status = "on";
  } else if (partNumber === 0) {
    description = "모든 스위치가 꺼져 있습니다";
    status = "off";
  } else {
    description = `${partNumber}개 스위치 활성 중`;
    status = "partial";
  }

  if (isOn === true) {
    status = "on";
    partNumber = allNumber;
  }

  return (
    <div
      className={`flex items-center w-full justify-between px-5 py-4 rounded-[14px] border bg-surface-10
        ${
          status === "on"
            ? "border-green-20"
            : status === "partial"
              ? "border-yellow-20"
              : "border-border-default"
        }`}
    >
      <div className="flex flex-col gap-1">
        <span className="font-sans text-sm font-medium">전체 제어</span>
        <span className={`font-mono text-xs text-text-30`}>{description}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-text-20">
          <span className="text-green-10">{partNumber}</span> / {allNumber} 켜짐
        </span>
        <Switch isOn={isOn} onClick={onClick} />
      </div>
    </div>
  );
}

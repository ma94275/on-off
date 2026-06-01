import StatusDot from "../dot/StatusDot";
import Switch from "../switch/Switch";
import ControlProps from "@/entities/control/type";

export default function ColControl({
  title,
  description,
  isOn,
  onClick,
}: ControlProps) {
  return (
    <div
      className={`flex flex-col w-100% px-5 py-4 rounded-[14px] border
      ${isOn ? "border-green-20 bg-green-50" : "border-border-default bg-surface-10"}`}
    >
      <div className="flex flex-col gap-1 mb-5">
        <span className="font-sans text-sm font-medium">{title}</span>
        <span className="font-sans text-xs text-text-30">{description}</span>
      </div>
      <div className="flex flex-col items-start gap-2 border-t border-border-default pt-4">
        <span className="flex items-center gap-2">
          <StatusDot status={isOn ? "on" : "off"} />
          <span
            className={`font-mono text-xs
            ${isOn ? "text-green-10" : "text-text-30"}`}
          >
            {isOn ? "켜짐" : "꺼짐"}
          </span>
        </span>
        <Switch isOn={isOn} onClick={onClick} />
      </div>
    </div>
  );
}

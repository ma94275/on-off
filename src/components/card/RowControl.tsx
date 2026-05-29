import ActivateBadge from "../badge/ActivateBadge";
import Switch from "../switch/Switch";
import ControlProps from "@/entities/control/type";

export default function RowControl({
  title,
  description,
  isOn,
  onClick,
}: ControlProps) {
  return (
    <div
      className={`flex items-center w-full justify-between px-5 py-4 rounded-[14px] border
        ${
          isOn
            ? "border-green-20 bg-green-50"
            : "border-border-default bg-surface-10"
        }`}
    >
      <div className="flex flex-col">
        <span className="font-sans text-sm font-medium">{title}</span>
        <span className="font-sans text-xs text-text-30">{description}</span>
      </div>
      <div className="flex items-center gap-3">
        <ActivateBadge
          status={isOn ? "on" : "off"}
          onLabel="켜짐"
          offLabel="꺼짐"
        />
        <Switch isOn={isOn} onClick={onClick} />
      </div>
    </div>
  );
}

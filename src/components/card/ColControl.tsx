import Switch from "../switch/Switch";
import ControlProps from "@/entities/control/type";

/** 카드형 보기의 타일. 켜진 타일만 왼쪽에 상태색 띠를 둔다. */
export default function ColControl({
  number,
  title,
  description,
  isOn,
  onClick,
}: ControlProps) {
  return (
    <div
      onClick={onClick}
      className="relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-md border border-line bg-surface px-4 py-3.5 transition-colors hover:border-line-strong"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-[3px] ${isOn ? "bg-on" : "bg-transparent"}`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs tabular-nums text-ink-4">
            {String(number).padStart(2, "0")}
          </p>
          <p className="truncate text-sm font-medium text-ink">{title}</p>
        </div>
        <Switch isOn={isOn} onClick={onClick} label={`${title} 전원`} />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line pt-2.5">
        <span className="truncate text-[13px] text-ink-3">
          {description || "설명 없음"}
        </span>
        <span
          className={`flex shrink-0 items-center gap-1.5 text-xs font-medium ${isOn ? "text-on-text" : "text-ink-3"}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isOn ? "bg-on" : "bg-off"}`} />
          {isOn ? "켜짐" : "꺼짐"}
        </span>
      </div>
    </div>
  );
}

import Switch from "../switch/Switch";
import ControlProps from "@/entities/control/type";

/** 목록형 보기의 한 행. 행 어디를 눌러도 토글된다. */
export default function RowControl({
  number,
  title,
  description,
  isOn,
  onClick,
}: ControlProps) {
  return (
    <li
      onClick={onClick}
      className="grid cursor-pointer grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 border-b border-line px-4 py-3 transition-colors last:border-b-0 hover:bg-canvas sm:grid-cols-[28px_minmax(0,1fr)_88px_auto]"
    >
      <span className="text-xs tabular-nums text-ink-4">
        {String(number).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{title}</p>
        <p className="truncate text-[13px] text-ink-3">
          {description || "설명 없음"}
        </p>
      </div>
      <span
        className={`hidden items-center gap-1.5 text-[13px] sm:flex ${isOn ? "text-on-text" : "text-ink-3"}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isOn ? "bg-on" : "bg-off"}`} />
        {isOn ? "켜짐" : "꺼짐"}
      </span>
      <Switch isOn={isOn} onClick={onClick} label={`${title} 전원`} />
    </li>
  );
}

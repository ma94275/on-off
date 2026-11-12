import { BinaryStatus } from "@/entities/status/type";
import Button from "@/components/ui/Button";

interface AllControlCardProps {
  partNumber: number;
  allNumber: number;
  onControl: (target: BinaryStatus) => void;
}

/** 구역 전체 켜기/끄기 + 현재 가동 현황 */
export default function AllControlCard({
  partNumber,
  allNumber,
  onControl,
}: AllControlCardProps) {
  const allOn = allNumber > 0 && partNumber === allNumber;
  const allOff = partNumber === 0;
  const percent = allNumber === 0 ? 0 : (partNumber / allNumber) * 100;

  const description =
    allNumber === 0
      ? "등록된 스위치가 없습니다"
      : allOn
        ? "모든 스위치가 켜져 있습니다"
        : allOff
          ? "모든 스위치가 꺼져 있습니다"
          : `${allNumber - partNumber}개 스위치가 꺼져 있습니다`;

  return (
    <section
      aria-label="전체 제어"
      className="flex flex-col gap-4 rounded-lg border border-line bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:max-w-md">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-semibold text-ink">전체 제어</span>
          <span className="text-[13px] tabular-nums text-ink-3">
            <span className="font-semibold text-ink">{partNumber}</span> / {allNumber} 켜짐
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-sm bg-subtle">
          <div
            className={`h-full rounded-sm transition-[width] duration-300 ${allOn ? "bg-on" : "bg-partial"}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-ink-3">{description}</span>
      </div>

      <div className="flex gap-2">
        <Button
          className="flex-1 sm:flex-none"
          onClick={() => onControl("off")}
          disabled={allOff}
        >
          모두 끄기
        </Button>
        <Button
          variant="primary"
          className="flex-1 sm:flex-none"
          onClick={() => onControl("on")}
          disabled={allOn || allNumber === 0}
        >
          모두 켜기
        </Button>
      </div>
    </section>
  );
}

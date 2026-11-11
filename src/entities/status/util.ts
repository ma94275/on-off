import { BinaryStatus, Status } from "./type";

/** 스위치 상태 목록 → 구역 상태. 스위치가 하나도 없으면 꺼짐으로 본다. */
export function getZoneStatus(statuses: BinaryStatus[]): Status {
  const onCount = statuses.filter((s) => s === "on").length;
  if (onCount === 0) return "off";
  if (onCount === statuses.length) return "on";
  return "partial";
}

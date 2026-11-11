"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeviceContext } from "@/context/DeviceContext";
import SortRow from "./SortRow";
import SortCol from "./SortCol";
import CardButton from "@/components/button/CardButton";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ActivateBadge from "@/components/badge/ActivateBadge";
import AllControlCard from "@/components/card/AllControlCard";
import Button, { LinkButton } from "@/components/ui/Button";
import { getZoneStatus } from "@/entities/status/util";

type Layout = "row" | "col";

export default function ControlView() {
  const [layout, setLayout] = useState<Layout>("row");
  const [deleting, setDeleting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { zones, isLoading, deleteZone, controlAll } = useDeviceContext();
  const zone = zones.find((z) => z.id === Number(id));

  const handleDelete = async () => {
    if (!zone) return;
    if (
      !window.confirm(
        `"${zone.title}" 구역을 삭제할까요?\n하위 스위치와 명령 기록도 함께 삭제됩니다.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      await deleteZone(zone.id);
      router.push("/");
    } catch (err) {
      console.error("[API] 구역 삭제 실패:", err);
      alert("구역 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex flex-col gap-3">
          <div className="h-4 w-32 animate-pulse rounded bg-line" />
          <div className="h-6 w-48 animate-pulse rounded bg-line" />
        </div>
        <div className="h-24 animate-pulse rounded-lg bg-line/60" />
        <div className="h-56 animate-pulse rounded-lg bg-line/60" />
      </PageShell>
    );
  }

  if (!zone) {
    return (
      <PageShell>
        <Breadcrumb current="찾을 수 없음" />
        <div className="flex flex-col items-center gap-2 rounded-lg border border-line bg-surface px-6 py-14 text-center">
          <span className="text-sm font-semibold text-ink">구역을 찾을 수 없어요</span>
          <span className="text-[13px] text-ink-3">삭제되었거나 존재하지 않는 구역입니다.</span>
          <LinkButton href="/" size="sm" className="mt-2">
            구역 목록으로
          </LinkButton>
        </div>
      </PageShell>
    );
  }

  const status = getZoneStatus(zone.deviceStatus.map((d) => d.status));
  const activeCount = zone.deviceStatus.filter((d) => d.status === "on").length;

  return (
    <PageShell>
      <div className="flex flex-col gap-3">
        <Breadcrumb current={zone.title} />
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-semibold tracking-tight text-ink">{zone.title}</h1>
              <ActivateBadge status={status} />
            </div>
            <p className="text-[13px] text-ink-3">{zone.description || "설명 없음"}</p>
          </div>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
            {deleting ? "삭제 중…" : "구역 삭제"}
          </Button>
        </div>
      </div>

      <AllControlCard
        partNumber={activeCount}
        allNumber={zone.deviceStatus.length}
        onControl={(target) => controlAll(zone.id, target)}
      />

      <section className="overflow-hidden rounded-lg border border-line bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
          <h2 className="text-sm font-semibold text-ink">
            스위치
            <span className="ml-1.5 font-normal tabular-nums text-ink-4">
              {zone.deviceStatus.length}
            </span>
          </h2>
          <div role="group" aria-label="보기 방식" className="flex gap-0.5 rounded-md bg-subtle p-0.5">
            <CardButton title="목록형" isSelected={layout === "row"} onClick={() => setLayout("row")} />
            <CardButton title="카드형" isSelected={layout === "col"} onClick={() => setLayout("col")} />
          </div>
        </div>

        {zone.deviceStatus.length === 0 ? (
          <p className="px-4 py-10 text-center text-[13px] text-ink-3">등록된 스위치가 없어요.</p>
        ) : layout === "row" ? (
          <SortRow zoneId={zone.id} />
        ) : (
          <SortCol zoneId={zone.id} />
        )}
      </section>
    </PageShell>
  );
}

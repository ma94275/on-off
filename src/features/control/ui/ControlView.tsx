"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeviceContext } from "@/context/DeviceContext";
import SortRow from "./SortRow";
import SortCol from "./SortCol";
import ApiStatusBadge from "@/components/ApiStatusBadge";
import BackButton from "@/components/button/BackButton";
import CardButton from "@/components/button/CardButton";
import LogoutButton from "@/components/button/LogoutButton";
import Link from "next/link";

export default function Page() {
  const [selected, setSelected] = useState("row");
  const [deleting, setDeleting] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const { zones, deleteZone } = useDeviceContext();
  const zone = zones.find((z) => z.id === Number(id));

  const handleDelete = async () => {
    if (!zone) return;
    if (!window.confirm(`"${zone.title}" 구역을 삭제할까요? 하위 스위치와 명령 기록도 함께 삭제됩니다.`)) {
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

  if (!zone) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed top-0 flex items-center justify-between w-full px-10 py-5 border-b border-border-default bg-bg-default">
        <span className="font-bold font-snas">on & off</span>
        <div className="flex items-center gap-4">
          <ApiStatusBadge />
          <LogoutButton />
        </div>
      </div>

      <div className="flex flex-col pt-25 p-10 gap-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <BackButton />
            </Link>
            <div className="w-10 h-10 border border-border-default rounded-lg bg-surface-10"></div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold tracking-tight">
                {zone.title}
              </span>
              <span className="text-sm text-text-20">{zone.description}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center border border-border-default rounded-lg bg-surface-10 py-[7px] px-3.5
            text-[13px] font-sans font-medium text-text-20
            hover:bg-surface-20 hover:border-red-400/40 hover:text-red-400 hover:cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "삭제 중..." : "구역 삭제"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <CardButton
            title="가로 버튼"
            isSelected={selected === "row"}
            onClick={() => setSelected("row")}
          />
          <CardButton
            title="세로 버튼"
            isSelected={selected === "col"}
            onClick={() => setSelected("col")}
          />
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {selected === "row" ? (
            <SortRow zoneId={zone.id} />
          ) : (
            <SortCol zoneId={zone.id} />
          )}
        </div>
      </div>
    </div>
  );
}

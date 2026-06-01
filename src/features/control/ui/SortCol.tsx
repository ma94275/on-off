"use client";
import { useState } from "react";
import { ZONES } from "@/entities/zone/mock";
import AllControlCard from "@/components/card/AllControlCard";
import ColControl from "@/components/card/ColControl";

export default function SortRow() {
  const zone = ZONES.find((z) => z.id === 1);
  const [isAllOn, setIsAllOn] = useState(false);

  if (!zone) {
    return <div>존재하지 않는 구역입니다.</div>;
  }

  const activeCount = zone.deviceStatus.filter(
    (device) => device.status === "on",
  ).length;
  const totalCount = zone.deviceStatus.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {zone.deviceStatus.map((device) => (
          <ColControl
            key={device.id}
            title={device.title}
            description={device.description}
            isOn={isAllOn || device.status === "on"}
            onClick={() => {
              console.log(device.id);
            }}
          />
        ))}
      </div>

      <AllControlCard
        partNumber={activeCount}
        allNumber={totalCount}
        isOn={isAllOn}
        status="off"
        onClick={() => setIsAllOn(!isAllOn)}
      />
    </div>
  );
}

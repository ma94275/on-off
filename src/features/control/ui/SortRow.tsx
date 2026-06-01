"use client";
import { useMqttContext } from "@/context/MqttContext";
import AllControlCard from "@/components/card/AllControlCard";
import RowControl from "@/components/card/RowControl";

interface SortRowProps {
  zoneId: number;
}

export default function SortRow({ zoneId }: SortRowProps) {
  const { zones, toggleDevice, controlAll } = useMqttContext();
  const zone = zones.find((z) => z.id === zoneId);

  if (!zone) {
    return <div>존재하지 않는 구역입니다.</div>;
  }

  const activeCount = zone.deviceStatus.filter(
    (device) => device.status === "on",
  ).length;
  const totalCount = zone.deviceStatus.length;
  const isAllOn = activeCount === totalCount;

  return (
    <div className="flex flex-col gap-4">
      <AllControlCard
        partNumber={activeCount}
        allNumber={totalCount}
        isOn={isAllOn}
        status={isAllOn ? "on" : "off"}
        onClick={() => controlAll(zone.id, isAllOn ? "off" : "on")}
      />

      <div className="flex flex-col gap-2">
        {zone.deviceStatus.map((device) => (
          <RowControl
            key={device.id}
            title={device.title}
            description={device.description}
            isOn={device.status === "on"}
            onClick={() => toggleDevice(zone.id, device.id)}
          />
        ))}
      </div>
    </div>
  );
}

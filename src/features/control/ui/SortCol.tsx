"use client";
import { useDeviceContext } from "@/context/DeviceContext";
import AllControlCard from "@/components/card/AllControlCard";
import ColControl from "@/components/card/ColControl";

interface SortColProps {
  zoneId: number;
}

export default function SortCol({ zoneId }: SortColProps) {
  const { zones, toggleDevice, controlAll } = useDeviceContext();
  const zone = zones.find((z) => z.id === zoneId);

  if (!zone) {
    return <div>존재하지 않는 구역입니다.</div>;
  }

  const activeCount = zone.deviceStatus.filter((d) => d.status === "on").length;
  const totalCount = zone.deviceStatus.length;
  const isAllOn = activeCount === totalCount;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {zone.deviceStatus.map((device) => (
          <ColControl
            key={device.id}
            title={device.title}
            description={device.description}
            isOn={device.status === "on"}
            onClick={() => toggleDevice(zone.id, device.id)}
          />
        ))}
      </div>

      <AllControlCard
        partNumber={activeCount}
        allNumber={totalCount}
        isOn={isAllOn}
        status={isAllOn ? "on" : "off"}
        onClick={() => controlAll(zone.id, isAllOn ? "off" : "on")}
      />
    </div>
  );
}

"use client";
import { useDeviceContext } from "@/context/DeviceContext";
import ColControl from "@/components/card/ColControl";

interface SortColProps {
  zoneId: number;
}

export default function SortCol({ zoneId }: SortColProps) {
  const { zones, toggleDevice } = useDeviceContext();
  const zone = zones.find((z) => z.id === zoneId);
  if (!zone) return null;

  return (
    <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
      {zone.deviceStatus.map((device, index) => (
        <ColControl
          key={device.id}
          number={index + 1}
          title={device.title}
          description={device.description}
          isOn={device.status === "on"}
          onClick={() => toggleDevice(zone.id, device.id)}
        />
      ))}
    </div>
  );
}

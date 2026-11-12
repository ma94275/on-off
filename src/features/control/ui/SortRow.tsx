"use client";
import { useDeviceContext } from "@/context/DeviceContext";
import RowControl from "@/components/card/RowControl";

interface SortRowProps {
  zoneId: number;
}

export default function SortRow({ zoneId }: SortRowProps) {
  const { zones, toggleDevice } = useDeviceContext();
  const zone = zones.find((z) => z.id === zoneId);
  if (!zone) return null;

  return (
    <ul>
      {zone.deviceStatus.map((device, index) => (
        <RowControl
          key={device.id}
          number={index + 1}
          title={device.title}
          description={device.description}
          isOn={device.status === "on"}
          onClick={() => toggleDevice(zone.id, device.id)}
        />
      ))}
    </ul>
  );
}

import { apiFetch } from "@/lib/api";
import {
  DeviceDTO,
  CreateDeviceInput,
  CreateDeviceResult,
} from "@/entities/device/type";
import { ZONESProps } from "./type";

function mapDeviceToZone(device: DeviceDTO): ZONESProps {
  return {
    id: device.deviceId,
    title: device.deviceName,
    description: device.description,
    deviceStatus: [...device.switches]
      .sort((a, b) => a.switchNumber - b.switchNumber)
      .map((s) => ({
        id: s.switchNumber,
        status: s.isOn ? "on" : "off",
        title: s.switchName,
        description: s.description,
      })),
  };
}

export async function fetchZones(): Promise<ZONESProps[]> {
  const devices = await apiFetch<DeviceDTO[]>("/devices");
  return devices.map(mapDeviceToZone);
}

export async function createZone(
  input: CreateDeviceInput,
): Promise<CreateDeviceResult> {
  return apiFetch<CreateDeviceResult>("/devices", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteZone(deviceId: number): Promise<void> {
  await apiFetch(`/devices/${deviceId}`, { method: "DELETE" });
}

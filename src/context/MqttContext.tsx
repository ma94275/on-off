"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useMqtt, MqttStatus } from "@/hooks/useMqtt";
import { ZONES, ZONESProps } from "@/entities/zone/mock";
import { BinaryStatus } from "@/entities/status/type";

// ── 토픽 헬퍼 ──────────────────────────────────────────────
const TOPIC_CONTROL = (zoneId: number, deviceId: number) =>
  `onoff/${zoneId}/${deviceId}/control`;

const TOPIC_ALL_CONTROL = (zoneId: number) => `onoff/${zoneId}/all/control`;

const ALL_STATUS_TOPIC = "onoff/+/+/status";

// ── 타입 ────────────────────────────────────────────────────
type ZoneState = {
  [zoneId: number]: {
    [deviceId: number]: BinaryStatus;
  };
};

interface MqttContextValue {
  mqttStatus: MqttStatus;
  zones: ZONESProps[];
  getDeviceStatus: (zoneId: number, deviceId: number) => BinaryStatus;
  toggleDevice: (zoneId: number, deviceId: number) => void;
  controlAll: (zoneId: number, targetStatus: BinaryStatus) => void;
}

const MqttContext = createContext<MqttContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────
export function MqttProvider({ children }: { children: ReactNode }) {
  const initialState: ZoneState = Object.fromEntries(
    ZONES.map((zone) => [
      zone.id,
      Object.fromEntries(zone.deviceStatus.map((d) => [d.id, d.status])),
    ]),
  );

  const [deviceStates, setDeviceStates] = useState<ZoneState>(initialState);

  const handleMessage = useCallback((topic: string, payload: string) => {
    const parts = topic.split("/");
    if (parts.length !== 4 || parts[3] !== "status") return;

    const zoneId = Number(parts[1]);
    const deviceId = Number(parts[2]);
    const status: BinaryStatus = payload.toUpperCase() === "ON" ? "on" : "off";

    setDeviceStates((prev) => ({
      ...prev,
      [zoneId]: {
        ...prev[zoneId],
        [deviceId]: status,
      },
    }));
  }, []);

  // useMqtt 결과를 변수로 받아서 undefined 케이스 처리
  const mqttResult = useMqtt({
    brokerUrl: process.env.NEXT_PUBLIC_MQTT_BROKER_URL ?? "",
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    topics: [ALL_STATUS_TOPIC],
    onMessage: handleMessage,
  });

  const mqttStatus: MqttStatus = mqttResult?.status ?? "disconnected";
  const publish = mqttResult?.publish ?? (() => {});

  const getDeviceStatus = useCallback(
    (zoneId: number, deviceId: number): BinaryStatus =>
      deviceStates[zoneId]?.[deviceId] ?? "off",
    [deviceStates],
  );

  const toggleDevice = useCallback(
    (zoneId: number, deviceId: number) => {
      const current = deviceStates[zoneId]?.[deviceId] ?? "off";
      const next: BinaryStatus = current === "on" ? "off" : "on";

      setDeviceStates((prev) => ({
        ...prev,
        [zoneId]: { ...prev[zoneId], [deviceId]: next },
      }));

      publish(TOPIC_CONTROL(zoneId, deviceId), next.toUpperCase());
    },
    [deviceStates, publish],
  );

  const controlAll = useCallback(
    (zoneId: number, targetStatus: BinaryStatus) => {
      const zone = ZONES.find((z) => z.id === zoneId);
      if (!zone) return;

      setDeviceStates((prev) => ({
        ...prev,
        [zoneId]: Object.fromEntries(
          zone.deviceStatus.map((d) => [d.id, targetStatus]),
        ),
      }));

      publish(TOPIC_ALL_CONTROL(zoneId), targetStatus.toUpperCase());
    },
    [publish],
  );

  const zones: ZONESProps[] = ZONES.map((zone) => ({
    ...zone,
    deviceStatus: zone.deviceStatus.map((device) => ({
      ...device,
      status: deviceStates[zone.id]?.[device.id] ?? device.status,
    })),
  }));

  return (
    <MqttContext.Provider
      value={{ mqttStatus, zones, getDeviceStatus, toggleDevice, controlAll }}
    >
      {children}
    </MqttContext.Provider>
  );
}

// ── 훅 ──────────────────────────────────────────────────────
export function useMqttContext() {
  const ctx = useContext(MqttContext);
  if (!ctx)
    throw new Error("useMqttContext는 MqttProvider 안에서만 사용하세요");
  return ctx;
}

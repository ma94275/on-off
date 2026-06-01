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
const TOPIC_STATUS = (zoneId: number, deviceId: number) =>
  `onoff/${zoneId}/${deviceId}/status`;

const TOPIC_CONTROL = (zoneId: number, deviceId: number) =>
  `onoff/${zoneId}/${deviceId}/control`;

const TOPIC_ALL_CONTROL = (zoneId: number) => `onoff/${zoneId}/all/control`;

// 모든 상태 수신 토픽 목록 (초기 구독용 와일드카드)
const ALL_STATUS_TOPIC = "onoff/+/+/status";

// ── 타입 ────────────────────────────────────────────────────
type ZoneState = {
  [zoneId: number]: {
    [deviceId: number]: BinaryStatus;
  };
};

interface MqttContextValue {
  /** MQTT 연결 상태 */
  mqttStatus: MqttStatus;
  /** 구역 목록 (상태 반영됨) */
  zones: ZONESProps[];
  /** 특정 디바이스 상태 조회 */
  getDeviceStatus: (zoneId: number, deviceId: number) => BinaryStatus;
  /** 단일 스위치 토글 */
  toggleDevice: (zoneId: number, deviceId: number) => void;
  /** 구역 전체 ON/OFF */
  controlAll: (zoneId: number, targetStatus: BinaryStatus) => void;
}

const MqttContext = createContext<MqttContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────
export function MqttProvider({ children }: { children: ReactNode }) {
  // 목데이터 기반 초기 상태
  const initialState: ZoneState = Object.fromEntries(
    ZONES.map((zone) => [
      zone.id,
      Object.fromEntries(zone.deviceStatus.map((d) => [d.id, d.status])),
    ]),
  );

  const [deviceStates, setDeviceStates] = useState<ZoneState>(initialState);

  // 수신 메시지 핸들러
  const handleMessage = useCallback((topic: string, payload: string) => {
    // 토픽 형식: onoff/{zoneId}/{deviceId}/status
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

  const { status: mqttStatus, publish } = useMqtt({
    brokerUrl: process.env.NEXT_PUBLIC_MQTT_BROKER_URL ?? "",
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    topics: [ALL_STATUS_TOPIC],
    onMessage: handleMessage,
  });

  // 현재 상태 조회
  const getDeviceStatus = useCallback(
    (zoneId: number, deviceId: number): BinaryStatus =>
      deviceStates[zoneId]?.[deviceId] ?? "off",
    [deviceStates],
  );

  // 단일 스위치 토글 (낙관적 업데이트 + MQTT 발행)
  const toggleDevice = useCallback(
    (zoneId: number, deviceId: number) => {
      const current = deviceStates[zoneId]?.[deviceId] ?? "off";
      const next: BinaryStatus = current === "on" ? "off" : "on";

      // 1. 화면 즉시 반영 (낙관적 업데이트)
      setDeviceStates((prev) => ({
        ...prev,
        [zoneId]: { ...prev[zoneId], [deviceId]: next },
      }));

      // 2. IoT 기기로 명령 발행
      publish(TOPIC_CONTROL(zoneId, deviceId), next.toUpperCase());
    },
    [deviceStates, publish],
  );

  // 구역 전체 제어
  const controlAll = useCallback(
    (zoneId: number, targetStatus: BinaryStatus) => {
      const zone = ZONES.find((z) => z.id === zoneId);
      if (!zone) return;

      // 낙관적 업데이트
      setDeviceStates((prev) => ({
        ...prev,
        [zoneId]: Object.fromEntries(
          zone.deviceStatus.map((d) => [d.id, targetStatus]),
        ),
      }));

      // 구역 전체 제어 토픽 발행
      publish(TOPIC_ALL_CONTROL(zoneId), targetStatus.toUpperCase());
    },
    [publish],
  );

  // zones 목데이터에 실시간 상태 합성
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

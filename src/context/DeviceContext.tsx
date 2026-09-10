"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import {
  fetchZones,
  createZone as createZoneApi,
  deleteZone as deleteZoneApi,
} from "@/entities/zone/api";
import { ZONESProps } from "@/entities/zone/type";
import {
  controlLight,
  controlLightAll,
  waitForCommand,
} from "@/entities/control/api";
import { BinaryStatus } from "@/entities/status/type";
import { CreateDeviceInput, CreateDeviceResult } from "@/entities/device/type";

export type ApiStatus = "connecting" | "connected" | "disconnected" | "error";

// 실시간 push 채널이 없어 짧은 주기로 재조회한다. api.md 참고("실시간 동기화" 항목).
const POLL_INTERVAL_MS = 15000;

type ZoneOverrides = {
  [zoneId: number]: {
    [deviceId: number]: BinaryStatus;
  };
};

interface DeviceContextValue {
  apiStatus: ApiStatus;
  zones: ZONESProps[];
  getDeviceStatus: (zoneId: number, deviceId: number) => BinaryStatus;
  toggleDevice: (zoneId: number, deviceId: number) => void;
  controlAll: (zoneId: number, targetStatus: BinaryStatus) => void;
  createZone: (input: CreateDeviceInput) => Promise<CreateDeviceResult>;
  deleteZone: (zoneId: number) => Promise<void>;
}

const DeviceContext = createContext<DeviceContextValue | null>(null);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [baseZones, setBaseZones] = useState<ZONESProps[]>([]);
  const [overrides, setOverrides] = useState<ZoneOverrides>({});
  const [apiStatus, setApiStatus] = useState<ApiStatus>("connecting");
  const hasLoadedOnce = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const zones = await fetchZones();
      setBaseZones(zones);
      setOverrides({});
      setApiStatus("connected");
      hasLoadedOnce.current = true;
    } catch (err) {
      // 15초마다 도는 백그라운드 재조회라 실패해도 다음 폴링에서 자동 복구된다.
      // console.error로 찍으면 Next 개발 서버가 매번 전체 오버레이를 띄워 과하게
      // 놀라게 하므로 warn으로 낮춘다 (사용자가 직접 누른 제어 실패는 error 유지).
      console.warn("[API] 구역 목록 조회 실패(다음 폴링에서 재시도):", err);
      setApiStatus(hasLoadedOnce.current ? "disconnected" : "error");
    }
  }, []);

  useEffect(() => {
    // refresh를 top-level에서 직접 호출하면 react-hooks/set-state-in-effect가
    // (실제로는 비동기인데도) "effect 안에서 setState를 동기 호출"로 오탐하므로,
    // setInterval과 동일하게 콜백으로 넘겨 최초 1회를 예약한다.
    const initial = setTimeout(refresh, 0);
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [refresh]);

  const zones: ZONESProps[] = baseZones.map((zone) => ({
    ...zone,
    deviceStatus: zone.deviceStatus.map((device) => ({
      ...device,
      status: overrides[zone.id]?.[device.id] ?? device.status,
    })),
  }));

  const getDeviceStatus = useCallback(
    (zoneId: number, deviceId: number): BinaryStatus =>
      overrides[zoneId]?.[deviceId] ??
      baseZones
        .find((z) => z.id === zoneId)
        ?.deviceStatus.find((d) => d.id === deviceId)?.status ??
      "off",
    [overrides, baseZones],
  );

  const applyOverride = useCallback(
    (zoneId: number, targets: { deviceId: number; status: BinaryStatus }[]) => {
      setOverrides((prev) => ({
        ...prev,
        [zoneId]: {
          ...prev[zoneId],
          ...Object.fromEntries(targets.map((t) => [t.deviceId, t.status])),
        },
      }));
    },
    [],
  );

  const toggleDevice = useCallback(
    async (zoneId: number, deviceId: number) => {
      const current = getDeviceStatus(zoneId, deviceId);
      const next: BinaryStatus = current === "on" ? "off" : "on";
      applyOverride(zoneId, [{ deviceId, status: next }]);

      try {
        const commandId = await controlLight(zoneId, deviceId, next);
        await waitForCommand(commandId);
      } catch (err) {
        console.error("[API] 장치 제어 실패:", err);
      } finally {
        refresh();
      }
    },
    [getDeviceStatus, applyOverride, refresh],
  );

  const controlAll = useCallback(
    async (zoneId: number, targetStatus: BinaryStatus) => {
      const zone = baseZones.find((z) => z.id === zoneId);
      if (!zone) return;

      applyOverride(
        zoneId,
        zone.deviceStatus.map((d) => ({
          deviceId: d.id,
          status: targetStatus,
        })),
      );

      try {
        const commandIds = await controlLightAll(zoneId, targetStatus);
        await Promise.all(commandIds.map((id) => waitForCommand(id)));
      } catch (err) {
        console.error("[API] 구역 일괄 제어 실패:", err);
      } finally {
        refresh();
      }
    },
    [baseZones, applyOverride, refresh],
  );

  const createZone = useCallback(
    async (input: CreateDeviceInput) => {
      const result = await createZoneApi(input);
      await refresh();
      return result;
    },
    [refresh],
  );

  const deleteZone = useCallback(
    async (zoneId: number) => {
      await deleteZoneApi(zoneId);
      await refresh();
    },
    [refresh],
  );

  return (
    <DeviceContext.Provider
      value={{
        apiStatus,
        zones,
        getDeviceStatus,
        toggleDevice,
        controlAll,
        createZone,
        deleteZone,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export function useDeviceContext() {
  const ctx = useContext(DeviceContext);
  if (!ctx)
    throw new Error("useDeviceContext는 DeviceProvider 안에서만 사용하세요");
  return ctx;
}

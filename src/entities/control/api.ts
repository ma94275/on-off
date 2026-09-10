import { apiFetch } from "@/lib/api";
import { BinaryStatus } from "@/entities/status/type";

type CommandState = "PENDING" | "DONE" | "TIMEOUT";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function controlLight(
  deviceId: number,
  switchNumber: number,
  action: BinaryStatus,
): Promise<number> {
  const { commandId } = await apiFetch<{ commandId: number }>(
    "/control/light",
    {
      method: "POST",
      body: JSON.stringify({
        deviceId,
        switchNumber,
        action: action.toUpperCase(),
      }),
    },
  );
  return commandId;
}

export async function controlLightAll(
  deviceId: number,
  action: BinaryStatus,
): Promise<number[]> {
  const { commandIds } = await apiFetch<{ commandIds: number[] }>(
    "/control/light/all",
    {
      method: "POST",
      body: JSON.stringify({ deviceId, action: action.toUpperCase() }),
    },
  );
  return commandIds;
}

function getCommand(
  commandId: number,
): Promise<{ commandId: number; state: CommandState }> {
  return apiFetch(`/commands/${commandId}`);
}

/** 제어 후 명령이 DONE 처리될 때까지 짧게 폴링한다. DONE이면 true, 그 외(TIMEOUT/미확정)는 false. */
export async function waitForCommand(
  commandId: number,
  { attempts = 3, intervalMs = 1000 } = {},
): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    await sleep(intervalMs);
    const { state } = await getCommand(commandId);
    if (state === "DONE") return true;
    if (state === "TIMEOUT") return false;
  }
  return false;
}

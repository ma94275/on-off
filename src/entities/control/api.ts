import { apiFetch } from "@/lib/api";
import { BinaryStatus } from "@/entities/status/type";
import { COMMAND_POLL_INTERVAL_MS, COMMAND_TIMEOUT_MS } from "@/lib/env";

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

/**
 * 제어 후 명령이 DONE 처리될 때까지 폴링한다.
 * DONE이면 true, TIMEOUT이거나 COMMAND_TIMEOUT_MS 안에 끝나지 않으면 false.
 */
export async function waitForCommand(
  commandId: number,
  {
    intervalMs = COMMAND_POLL_INTERVAL_MS,
    timeoutMs = COMMAND_TIMEOUT_MS,
  } = {},
): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await sleep(intervalMs);
    const { state } = await getCommand(commandId);
    if (state === "DONE") return true;
    if (state === "TIMEOUT") return false;
  }
  return false;
}

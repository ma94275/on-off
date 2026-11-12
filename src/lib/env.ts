// NEXT_PUBLIC_* 값은 빌드 시점에 인라인되므로 서버(proxy)와 브라우저 양쪽에서 같은 값을 쓴다.

/** "true"면 백엔드 대신 브라우저 메모리의 목데이터로 동작한다. */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

function numberEnv(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** 제어 명령 완료 여부(GET /commands/:id)를 확인하는 간격 */
export const COMMAND_POLL_INTERVAL_MS = numberEnv(
  process.env.NEXT_PUBLIC_COMMAND_POLL_INTERVAL_MS,
  1000,
);

/** 이 시간 안에 DONE이 안 되면 결과를 기다리지 않고 목록을 다시 불러온다 */
export const COMMAND_TIMEOUT_MS = numberEnv(
  process.env.NEXT_PUBLIC_COMMAND_TIMEOUT_MS,
  5000,
);

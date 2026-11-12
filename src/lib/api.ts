import { USE_MOCK } from "./env";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

type ApiSuccess<T> = { status: "SUCCESS"; data: T };
type ApiErrorBody = {
  status: "ERROR";
  error: { code: string; message: string };
};
type ApiResponse<T> = ApiSuccess<T> | ApiErrorBody;

export class ApiRequestError extends Error {
  httpStatus: number;
  code: string;

  constructor(httpStatus: number, code: string, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.httpStatus = httpStatus;
    this.code = code;
  }
}

function redirectToLoginIfNeeded(code: string) {
  if (typeof window === "undefined") return;
  if (code !== "UNAUTHORIZED") return;
  if (window.location.pathname === "/login") return;
  window.location.href = "/login";
}

async function mockApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // 목 모드가 꺼져 있으면 번들에 포함되지 않도록 동적 import
  const { mockFetch, MockError } = await import("./mock");
  try {
    return (await mockFetch(path, init)) as T;
  } catch (err) {
    if (err instanceof MockError) {
      redirectToLoginIfNeeded(err.code);
      throw new ApiRequestError(err.httpStatus, err.code, err.message);
    }
    throw err;
  }
}

export async function apiFetch<T = undefined>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  if (USE_MOCK) return mockApiFetch<T>(path, init);

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiRequestError(
      0,
      "NETWORK_ERROR",
      "서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.",
    );
  }

  // 204 No Content 등 본문이 없는 성공 응답
  const text = await res.text();
  if (!text) {
    if (res.ok) return undefined as T;
    const code = res.status === 401 ? "UNAUTHORIZED" : "EMPTY_RESPONSE";
    redirectToLoginIfNeeded(code);
    throw new ApiRequestError(
      res.status,
      code,
      `서버가 빈 응답을 반환했습니다 (HTTP ${res.status}).`,
    );
  }

  let body: ApiResponse<T>;
  try {
    body = JSON.parse(text) as ApiResponse<T>;
  } catch {
    throw new ApiRequestError(
      res.status,
      "INVALID_RESPONSE",
      `서버 응답을 JSON으로 해석할 수 없습니다 (HTTP ${res.status}). BACKEND_ORIGIN 설정을 확인하거나 NEXT_PUBLIC_USE_MOCK=true로 목데이터를 사용하세요.`,
    );
  }

  if (body.status === "ERROR") {
    redirectToLoginIfNeeded(body.error.code);
    throw new ApiRequestError(res.status, body.error.code, body.error.message);
  }

  return body.data;
}

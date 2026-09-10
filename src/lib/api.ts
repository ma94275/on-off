const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export async function apiFetch<T = undefined>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  let body: ApiResponse<T>;
  try {
    body = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiRequestError(
      res.status,
      "INVALID_RESPONSE",
      `서버 응답을 JSON으로 해석할 수 없습니다 (HTTP ${res.status}). API_URL(${API_URL})이 올바른 백엔드를 가리키는지 확인하세요.`,
    );
  }

  if (body.status === "ERROR") {
    const alreadyOnLoginPage =
      typeof window !== "undefined" && window.location.pathname === "/login";
    if (
      body.error.code === "UNAUTHORIZED" &&
      typeof window !== "undefined" &&
      !alreadyOnLoginPage
    ) {
      window.location.href = "/login";
    }
    throw new ApiRequestError(res.status, body.error.code, body.error.message);
  }

  return body.data;
}

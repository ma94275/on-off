import { apiFetch } from "@/lib/api";
import { AuthUser, LoginInput } from "./type";

export async function login(input: LoginInput): Promise<AuthUser> {
  const { user } = await apiFetch<{ user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return user;
}

export async function logout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
}

export async function getMe(): Promise<AuthUser> {
  const { user } = await apiFetch<{ user: AuthUser }>("/auth/me");
  return user;
}
import "server-only";
import { getCustomerToken } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(typeof body === "object" && body && "message" in body ? String((body as { message: unknown }).message) : "Request failed");
  }
}

async function request<T>(path: string, options: RequestInit & { authenticated?: boolean } = {}): Promise<T> {
  const { authenticated = false, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = { "Content-Type": "application/json", ...(headers as Record<string, string>) };

  if (authenticated) {
    const token = await getCustomerToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...rest, headers: finalHeaders, cache: "no-store" });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : undefined;

  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}

/** Public storefront reads/writes -- no customer session needed. */
export const publicApi = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, data?: unknown) => request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
};

/** Calls that attach the logged-in customer's access token. */
export const customerApi = {
  get: <T>(path: string) => request<T>(path, { method: "GET", authenticated: true }),
  post: <T>(path: string, data?: unknown) => request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined, authenticated: true }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE", authenticated: true }),
};

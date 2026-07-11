import "server-only";
import { cookies } from "next/headers";

const TOKEN_COOKIE = "customer_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function setCustomerToken(token: string) {
  const store = await cookies();
  store.set(TOKEN_COOKIE, token, cookieOptions);
}

export async function clearCustomerToken() {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
}

export async function getCustomerToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value;
}

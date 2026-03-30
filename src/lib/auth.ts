import { cookies } from "next/headers";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import { TOKEN_PATTERN } from "@/lib/validation";

const COOKIE_PREFIX = "splitease-access";

function getPepper() {
  const pepper = process.env.WRITE_TOKEN_PEPPER;

  if (!pepper) {
    throw new Error("WRITE_TOKEN_PEPPER is required.");
  }

  return pepper;
}

export function generateWriteToken() {
  return randomBytes(18).toString("base64url");
}

export function hashWriteToken(token: string) {
  return createHash("sha256")
    .update(`${getPepper()}:${token}`)
    .digest("hex");
}

export function normalizeWriteTokenInput(input: string | null | undefined) {
  if (!input) {
    return null;
  }

  const trimmed = input.trim();

  if (TOKEN_PATTERN.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const token = url.searchParams.get("token");
    return token && TOKEN_PATTERN.test(token) ? token : null;
  } catch {
    return null;
  }
}

export function writeTokenMatches(token: string, storedHash: string) {
  if (!TOKEN_PATTERN.test(token) || !/^[a-f0-9]{64}$/.test(storedHash)) {
    return false;
  }

  const tokenHash = hashWriteToken(token);

  if (tokenHash.length !== storedHash.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(tokenHash), Buffer.from(storedHash));
}

export function getWriteAccessCookieName(slug: string) {
  return `${COOKIE_PREFIX}-${slug}`;
}

export async function getWriteAccessToken(slug: string) {
  const cookieStore = await cookies();
  return cookieStore.get(getWriteAccessCookieName(slug))?.value ?? null;
}

export async function setWriteAccessCookie(slug: string, token: string) {
  const cookieStore = await cookies();
  cookieStore.set(getWriteAccessCookieName(slug), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

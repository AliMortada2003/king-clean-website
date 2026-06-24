import type {
  AdminUserDto,
  ClientLoginResponseDto,
  ClientUserDto,
  LoginResponseDto,
} from "../types/api";

const SESSION_KEY = "king-clean-admin-session:v1";
const CLIENT_SESSION_KEY = "king-clean-client-session:v1";

export interface AuthSession {
  accessToken: string;
  expiresAt: string;
  admin: AdminUserDto;
}

let cachedSession: AuthSession | null | undefined;
let cachedClientSession: ClientAuthSession | null | undefined;

export interface ClientAuthSession {
  accessToken: string;
  expiresAt: string;
  client: ClientUserDto;
}

export function readAuthSession(): AuthSession | null {
  if (cachedSession !== undefined) return cachedSession;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return (cachedSession = null);
    const session = JSON.parse(raw) as AuthSession;
    if (
      !session.accessToken ||
      new Date(session.expiresAt).getTime() <= Date.now()
    ) {
      clearAuthSession();
      return null;
    }
    return (cachedSession = session);
  } catch {
    clearAuthSession();
    return null;
  }
}

export function writeAuthSession(response: LoginResponseDto): AuthSession {
  const session: AuthSession = {
    accessToken: response.accessToken,
    expiresAt: response.expiresAt,
    admin: response.admin,
  };
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  cachedSession = session;
  return session;
}

export function readClientAuthSession(): ClientAuthSession | null {
  if (cachedClientSession !== undefined) return cachedClientSession;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CLIENT_SESSION_KEY);
    if (!raw) return (cachedClientSession = null);
    const session = JSON.parse(raw) as ClientAuthSession;
    if (
      !session.accessToken ||
      new Date(session.expiresAt).getTime() <= Date.now()
    ) {
      clearClientAuthSession();
      return null;
    }
    return (cachedClientSession = session);
  } catch {
    clearClientAuthSession();
    return null;
  }
}

export function writeClientAuthSession(
  response: ClientLoginResponseDto,
): ClientAuthSession {
  const session: ClientAuthSession = {
    accessToken: response.accessToken,
    expiresAt: response.expiresAt,
    client: response.client,
  };
  window.sessionStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(session));
  cachedClientSession = session;
  return session;
}

export function updateClientAuthUser(
  client: ClientUserDto,
): ClientAuthSession | null {
  const current = readClientAuthSession();
  if (!current) return null;
  const session = { ...current, client };
  window.sessionStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(session));
  cachedClientSession = session;
  return session;
}

export function clearAuthSession() {
  cachedSession = null;
  if (typeof window !== "undefined")
    window.sessionStorage.removeItem(SESSION_KEY);
}

export function clearClientAuthSession() {
  cachedClientSession = null;
  if (typeof window !== "undefined")
    window.sessionStorage.removeItem(CLIENT_SESSION_KEY);
}

export function resetAuthSessionCache() {
  cachedSession = undefined;
  cachedClientSession = undefined;
}

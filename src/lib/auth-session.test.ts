import { beforeEach, describe, expect, it } from "vitest";
import {
  clearClientAuthSession,
  clearAuthSession,
  readClientAuthSession,
  readAuthSession,
  resetAuthSessionCache,
  writeClientAuthSession,
  writeAuthSession,
} from "./auth-session";

describe("admin session", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    resetAuthSessionCache();
  });

  it("stores and reads a valid session", () => {
    writeAuthSession({
      accessToken: "token",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      admin: { id: 1, fullName: "Admin", email: "admin@example.com" },
    });
    expect(readAuthSession()?.accessToken).toBe("token");
  });

  it("clears an expired session", () => {
    writeAuthSession({
      accessToken: "expired",
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
      admin: { id: 1, fullName: "Admin", email: "admin@example.com" },
    });
    resetAuthSessionCache();
    expect(readAuthSession()).toBeNull();
  });

  it("clears explicitly", () => {
    writeAuthSession({
      accessToken: "token",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      admin: { id: 1, fullName: "Admin", email: "admin@example.com" },
    });
    clearAuthSession();
    expect(readAuthSession()).toBeNull();
  });
});

describe("client session", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    resetAuthSessionCache();
  });

  it("stores client sessions separately from admin sessions", () => {
    writeAuthSession({
      accessToken: "admin-token",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      admin: { id: 1, fullName: "Admin", email: "admin@example.com" },
    });
    writeClientAuthSession({
      accessToken: "client-token",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      client: {
        id: 7,
        fullName: "Client",
        email: "client@gmail.com",
        emailConfirmed: true,
      },
    });

    expect(readAuthSession()?.accessToken).toBe("admin-token");
    expect(readClientAuthSession()?.accessToken).toBe("client-token");
  });

  it("clears expired client sessions", () => {
    writeClientAuthSession({
      accessToken: "expired-client-token",
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
      client: {
        id: 7,
        fullName: "Client",
        email: "client@gmail.com",
        emailConfirmed: true,
      },
    });
    resetAuthSessionCache();
    expect(readClientAuthSession()).toBeNull();
  });

  it("clears client sessions without removing admin sessions", () => {
    writeAuthSession({
      accessToken: "admin-token",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      admin: { id: 1, fullName: "Admin", email: "admin@example.com" },
    });
    writeClientAuthSession({
      accessToken: "client-token",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      client: {
        id: 7,
        fullName: "Client",
        email: "client@gmail.com",
        emailConfirmed: true,
      },
    });
    clearClientAuthSession();
    expect(readClientAuthSession()).toBeNull();
    expect(readAuthSession()?.accessToken).toBe("admin-token");
  });
});

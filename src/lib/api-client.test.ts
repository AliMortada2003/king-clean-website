import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  API_BASE_URL,
  API_ORIGIN,
  apiRequest,
  normalizeApiOrigin,
  resolveMediaUrl,
} from "./api-client";
import {
  resetAuthSessionCache,
  writeAuthSession,
  writeClientAuthSession,
} from "./auth-session";

describe("API base URL configuration", () => {
  it("defaults to the real local backend and appends /api internally", () => {
    expect(normalizeApiOrigin()).toBe("http://localhost:5048");
  });

  it("uses the configured origin and appends /api internally", () => {
    expect(API_ORIGIN).toBe(
      normalizeApiOrigin(import.meta.env.VITE_API_BASE_URL),
    );
    expect(API_BASE_URL).toBe(`${API_ORIGIN}/api`);
  });

  it("normalizes legacy values that already include /api", () => {
    expect(normalizeApiOrigin("http://localhost:5048/api")).toBe(
      "http://localhost:5048",
    );
    expect(normalizeApiOrigin("http://localhost:5048/api/")).toBe(
      "http://localhost:5048",
    );
  });
});

describe("media URL resolution", () => {
  it("keeps absolute and data URLs unchanged", () => {
    expect(resolveMediaUrl("https://cdn.example.com/a.jpg")).toBe(
      "https://cdn.example.com/a.jpg",
    );
    expect(resolveMediaUrl("data:image/png;base64,abc")).toBe(
      "data:image/png;base64,abc",
    );
  });

  it("resolves backend-relative upload URLs against the API origin", () => {
    expect(resolveMediaUrl("/uploads/gallery/a.jpg")).toBe(
      `${API_ORIGIN}/uploads/gallery/a.jpg`,
    );
  });
});

describe("API auth mode selection", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    resetAuthSessionCache();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const okResponse = () =>
    Promise.resolve(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

  it("uses admin token only for admin auth mode", async () => {
    const fetchMock = vi.fn().mockImplementation(okResponse);
    vi.stubGlobal("fetch", fetchMock);
    writeAuthSession({
      accessToken: "admin-token",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      admin: { id: 1, fullName: "Admin", email: "admin@example.com" },
    });
    writeClientAuthSession({
      accessToken: "client-token",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      client: {
        id: 2,
        fullName: "Client",
        email: "client@gmail.com",
        emailConfirmed: true,
      },
    });

    await apiRequest("/admin/dashboard/stats", { authMode: "admin" });

    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer admin-token");
  });

  it("uses client token only for client auth mode", async () => {
    const fetchMock = vi.fn().mockImplementation(okResponse);
    vi.stubGlobal("fetch", fetchMock);
    writeAuthSession({
      accessToken: "admin-token",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      admin: { id: 1, fullName: "Admin", email: "admin@example.com" },
    });
    writeClientAuthSession({
      accessToken: "client-token",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      client: {
        id: 2,
        fullName: "Client",
        email: "client@gmail.com",
        emailConfirmed: true,
      },
    });

    await apiRequest("/client/auth/me", { authMode: "client" });

    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer client-token");
  });

  it("does not send Authorization for public auth mode", async () => {
    const fetchMock = vi.fn().mockImplementation(okResponse);
    vi.stubGlobal("fetch", fetchMock);
    writeAuthSession({
      accessToken: "admin-token",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      admin: { id: 1, fullName: "Admin", email: "admin@example.com" },
    });

    await apiRequest("/settings", { authMode: "public" });

    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get("Authorization")).toBeNull();
  });
});

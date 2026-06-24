import {
  clearAuthSession,
  clearClientAuthSession,
  readAuthSession,
  readClientAuthSession,
} from "./auth-session";
import type { ApiErrorResponse, MediaAssetDto } from "../types/api";

const DEFAULT_API_ORIGIN = "https://cleankingapi.codespark-eg.com";
export type ApiAuthMode = "public" | "admin" | "client";

export function normalizeApiOrigin(value?: string) {
  return (value || DEFAULT_API_ORIGIN)
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");
}

export const API_ORIGIN = normalizeApiOrigin(import.meta.env.VITE_API_BASE_URL);
export const API_BASE_URL = `${API_ORIGIN}/api`;

export class ApiError extends Error implements ApiErrorResponse {
  statusCode: number;
  errors?: Record<string, string[]>;
  traceId?: string;

  constructor(payload: Partial<ApiErrorResponse>, fallbackStatus = 500) {
    super(payload.message || "تعذر إتمام الطلب. يرجى المحاولة مرة أخرى.");
    this.name = "ApiError";
    this.statusCode = payload.statusCode || fallbackStatus;
    this.errors = payload.errors;
    this.traceId = payload.traceId;
  }
}

function buildUrl(path: string, query?: Record<string, unknown>) {
  const endpoint = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "")
      url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  const text = await response.text();
  return text ? { message: text } : null;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & {
    query?: Record<string, unknown>;
    anonymous?: boolean;
    authMode?: ApiAuthMode;
  } = {},
): Promise<T> {
  const { query, anonymous, authMode, ...requestOptions } = options;
  const mode = authMode || (anonymous ? "public" : "admin");
  const headers = new Headers(requestOptions.headers);
  if (
    !(requestOptions.body instanceof FormData) &&
    requestOptions.body !== undefined
  )
    headers.set("Content-Type", "application/json");
  if (mode !== "public") {
    const token =
      mode === "admin"
        ? readAuthSession()?.accessToken
        : readClientAuthSession()?.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      ...requestOptions,
      headers,
    });
  } catch {
    throw new ApiError(
      {
        statusCode: 0,
        message: "تعذر الاتصال بالخادم. تحقق من الاتصال ثم حاول مجدداً.",
      },
      0,
    );
  }
  const payload = await parseResponse(response);
  if (!response.ok) {
    if (response.status === 401 && mode !== "public") {
      if (mode === "admin") {
        clearAuthSession();
        window.dispatchEvent(new CustomEvent("kingclean:admin-unauthorized"));
        window.dispatchEvent(new CustomEvent("kingclean:unauthorized"));
      } else {
        clearClientAuthSession();
        window.dispatchEvent(new CustomEvent("kingclean:client-unauthorized"));
      }
    }
    throw new ApiError(payload || {}, response.status);
  }
  return payload as T;
}

function resolveAuthMode(mode?: ApiAuthMode | boolean): ApiAuthMode {
  if (mode === true) return "public";
  if (mode === false || mode === undefined) return "admin";
  return mode;
}

export const api = {
  get: <T>(
    path: string,
    query?: Record<string, unknown>,
    signal?: AbortSignal,
    authMode?: ApiAuthMode | boolean,
  ) =>
    apiRequest<T>(path, {
      method: "GET",
      query,
      signal,
      authMode: resolveAuthMode(authMode),
    }),
  post: <T>(
    path: string,
    body?: unknown,
    authMode?: ApiAuthMode | boolean,
  ) =>
    apiRequest<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
      authMode: resolveAuthMode(authMode),
    }),
  put: <T>(
    path: string,
    body: unknown,
    authMode?: ApiAuthMode | boolean,
  ) =>
    apiRequest<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      authMode: resolveAuthMode(authMode),
    }),
  delete: <T>(path: string, authMode?: ApiAuthMode | boolean) =>
    apiRequest<T>(path, {
      method: "DELETE",
      authMode: resolveAuthMode(authMode),
    }),
};

export function resolveMediaUrl(value?: string | null) {
  if (!value) return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return `${API_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
}

export function uploadMedia(
  file: File,
  folder: string,
  onProgress?: (progress: number) => void,
): Promise<MediaAssetDto> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", buildUrl("/admin/uploads"));
    const token = readAuthSession()?.accessToken;
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable)
        onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onerror = () =>
      reject(
        new ApiError(
          { statusCode: 0, message: "انقطع الاتصال أثناء رفع الملف." },
          0,
        ),
      );
    xhr.onload = () => {
      let payload: any = null;
      try {
        payload = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      } catch {
        /* noop */
      }
      if (xhr.status >= 200 && xhr.status < 300)
        resolve(payload as MediaAssetDto);
      else reject(new ApiError(payload || {}, xhr.status));
    };
    const data = new FormData();
    data.append("file", file);
    if (folder) data.append("folder", folder);
    xhr.send(data);
  });
}

export function shouldRetry(failureCount: number, error: unknown) {
  if (failureCount >= 2) return false;
  return (
    !(error instanceof ApiError) ||
    error.statusCode === 0 ||
    error.statusCode >= 500
  );
}

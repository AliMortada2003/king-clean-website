import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Navigate } from "react-router-dom";
import { adminApi, clientApi } from "../api/endpoints";
import {
  clearClientAuthSession,
  clearAuthSession,
  readClientAuthSession,
  readAuthSession,
  updateClientAuthUser,
  writeClientAuthSession,
  writeAuthSession,
  type AuthSession,
  type ClientAuthSession,
} from "../lib/auth-session";
import type { ClientLoginRequestDto, LoginRequestDto } from "../types/api";

interface AuthContextValue {
  session: AuthSession | null;
  login: (body: LoginRequestDto) => Promise<void>;
  logout: () => void;
  isLoggingIn: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const ClientAuthContext = createContext<ClientAuthContextValue | null>(null);

interface ClientAuthContextValue {
  session: ClientAuthSession | null;
  login: (body: ClientLoginRequestDto) => Promise<void>;
  logout: () => void;
  isLoggingIn: boolean;
  isBootstrapping: boolean;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(() =>
    readAuthSession(),
  );
  const queryClient = useQueryClient();
  const mutation = useMutation({ mutationFn: adminApi.login });
  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
    queryClient.removeQueries({ queryKey: ["admin"] });
  }, [queryClient]);
  useEffect(() => {
    window.addEventListener("kingclean:admin-unauthorized", logout);
    window.addEventListener("kingclean:unauthorized", logout);
    return () => {
      window.removeEventListener("kingclean:admin-unauthorized", logout);
      window.removeEventListener("kingclean:unauthorized", logout);
    };
  }, [logout]);
  const login = useCallback(
    async (body: LoginRequestDto) => {
      const response = await mutation.mutateAsync(body);
      setSession(writeAuthSession(response));
    },
    [mutation],
  );
  const value = useMemo(
    () => ({ session, login, logout, isLoggingIn: mutation.isPending }),
    [session, login, logout, mutation.isPending],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function ClientAuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<ClientAuthSession | null>(() =>
    readClientAuthSession(),
  );
  const queryClient = useQueryClient();
  const mutation = useMutation({ mutationFn: clientApi.login });
  const accessToken = session?.accessToken;
  const logout = useCallback(() => {
    clearClientAuthSession();
    setSession(null);
    queryClient.removeQueries({ queryKey: ["client"] });
  }, [queryClient]);
  useEffect(() => {
    window.addEventListener("kingclean:client-unauthorized", logout);
    return () =>
      window.removeEventListener("kingclean:client-unauthorized", logout);
  }, [logout]);
  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    clientApi
      .me()
      .then((client) => {
        if (cancelled) return;
        setSession(updateClientAuthUser(client));
      })
      .catch(() => {
        if (!cancelled) logout();
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, logout]);
  const login = useCallback(
    async (body: ClientLoginRequestDto) => {
      const response = await mutation.mutateAsync(body);
      setSession(writeClientAuthSession(response));
      await queryClient.invalidateQueries({ queryKey: ["client"] });
    },
    [mutation, queryClient],
  );
  const value = useMemo(
    () => ({
      session,
      login,
      logout,
      isLoggingIn: mutation.isPending,
      isBootstrapping: false,
    }),
    [session, login, logout, mutation.isPending],
  );
  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { session } = useAuth();
  const location = useLocation();
  if (!session)
    return (
      <Navigate
        replace
        to={`/admin/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`}
      />
    );
  return children;
}

export function useClientAuth() {
  const value = useContext(ClientAuthContext);
  if (!value)
    throw new Error("useClientAuth must be used inside ClientAuthProvider");
  return value;
}

export function ClientProtectedRoute({ children }: PropsWithChildren) {
  const { session, isBootstrapping } = useClientAuth();
  const location = useLocation();
  if (isBootstrapping)
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-32 text-[var(--color-text)] sm:px-6 lg:px-8">
        جاري التحقق من الحساب...
      </div>
    );
  if (!session)
    return (
      <Navigate
        replace
        to={`/client/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`}
      />
    );
  return children;
}

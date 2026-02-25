export interface AuthUser {
  username: string;
  role: string;
}

const TOKEN_KEY = "mes_access_token";
const USERNAME_KEY = "mes_username";
const ROLE_KEY = "mes_role";

const canUseStorage = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

export const getAccessToken = (): string | null => {
  if (!canUseStorage()) {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthSession = (token: string, user: AuthUser): void => {
  if (!canUseStorage()) {
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, user.username);
  localStorage.setItem(ROLE_KEY, user.role);
};

export const clearAuthSession = (): void => {
  if (!canUseStorage()) {
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(ROLE_KEY);
};

export const getAuthUser = (): AuthUser | null => {
  if (!canUseStorage()) {
    return null;
  }

  const username = localStorage.getItem(USERNAME_KEY);
  const role = localStorage.getItem(ROLE_KEY);
  if (!username || !role) {
    return null;
  }

  return { username, role };
};

export const isAuthenticated = (): boolean => !!getAccessToken();

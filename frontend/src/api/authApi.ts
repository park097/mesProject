import { setAuthSession } from "../auth/authStorage";
import { api } from "./api";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  username: string;
  role: string;
}

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  setAuthSession(data.accessToken, { username: data.username, role: data.role });
  return data;
};

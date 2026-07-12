import api from "./api";


export type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
};


export type RegisterResponse = {
  message: string;
  user: User;
};


export type LoginResponse = {
  access_token: string;
  token_type: string;
};


export type ProfileResponse = {
  message: string;
  user: {
    sub: string;
    email: string;
    role: string;
    exp?: number;
  };
};


const TOKEN_KEY = "access_token";


export async function register(
  fullName: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  const response =
    await api.post<RegisterResponse>(
      "/auth/register",
      {
        full_name: fullName,
        email,
        password,
      },
    );

  return response.data;
}


export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response =
    await api.post<LoginResponse>(
      "/auth/login",
      {
        email,
        password,
      },
    );

  const token =
    response.data.access_token;

  if (!token) {
    throw new Error(
      "Authentication token was not returned.",
    );
  }

  localStorage.setItem(
    TOKEN_KEY,
    token,
  );

  return response.data;
}


export async function getProfile():
Promise<ProfileResponse> {
  const response =
    await api.get<ProfileResponse>(
      "/api/v1/profile",
    );

  return response.data;
}


export function getAccessToken():
string | null {
  return localStorage.getItem(
    TOKEN_KEY,
  );
}


export function isAuthenticated():
boolean {
  return Boolean(
    getAccessToken(),
  );
}


export function logout(): void {
  localStorage.removeItem(
    TOKEN_KEY,
  );
}
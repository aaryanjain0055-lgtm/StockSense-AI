import api from "./api";

export async function register(
  full_name: string,
  email: string,
  password: string
) {
  const response = await api.post("/auth/register", {
    full_name,
    email,
    password,
  });

  return response.data;
}

export async function login(
  email: string,
  password: string
) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  localStorage.setItem(
    "access_token",
    response.data.access_token
  );

  return response.data;
}
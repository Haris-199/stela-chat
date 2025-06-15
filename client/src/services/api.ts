export async function login(username: string, password: string) {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.status >= 500) {
    throw new Error("Login failed, server error.");
  }

  return (await res.json()) as APIResponse<UserPayload> | LoginError;
}

export async function register(username: string, password: string) {
  const res = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.status >= 500) {
    throw new Error("Login failed, server error.");
  }

  return (await res.json()) as APISuccess | RegisterError;
}

export interface UserPayload {
  token: string;
  user: {
    id: number;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface APIResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface APISuccess {
  success: true;
  message: string;
}

export interface LoginError {
  success: false;
  errors: {
    username: string[];
    password: string[];
  };
}

export interface RegisterError {
  success: false;
  errors: {
    username: string[];
    password: string[];
  };
}

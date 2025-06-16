/**
 * Verifies the validity of a JWT token by sending it to the backend verification endpoint.
 *
 * @param token - The JWT token to verify.
 * @returns A promise that resolves to `true` if the token is valid, or `false` otherwise.
 */
export async function verify(token: string) {
  const res = await fetch("http://localhost:3000/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    return false;
  }
  return true;
}

/**
 * Attempts to log in a user with the provided username and password.
 *
 * @param username - The username of the user.
 * @param password - The user's password.
 * @returns A promise that resolves to an `APIResponse<UserPayload>` on success,
 *          or a `LoginError` object on failure.
 * @throws If the server responds with a status code >= 500.
 */
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

/**
 * Registers a new user with the provided username and password.
 *
 * @param username - The desired username for the new user.
 * @param password - The desired password for the new user.
 * @returns A promise that resolves to an `APISuccess` object on success,
 *          or a `RegisterError` object on failure.
 * @throws If the server responds with a status code >= 500.
 */
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

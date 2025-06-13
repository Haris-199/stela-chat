export async function login(username: string, password: string) {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (res.status >= 500) {
    throw new Error("Login failed, server error.");
  }
  const json = (await res.json()) as APIResponse<UserPayload> | LoginError;
  
  if (json.success) {
    return json;
  }
  
  switch (json.message) {
    case "Incorrect username or user does not exist.":
      json.field = "username";
      break;
    case "Incorrect password.":
      json.field = "password";
      break;
  }
  return json;
}

export interface UserPayload {
  token: string;
  user: {
    id: number;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export interface APIResponse<T> {
  success: true;
  message: string;
  data: T;
};

export interface APIError {
  success: false;
  message: string;
  data: null;
};

export interface LoginError extends APIError {
  field: string;
}

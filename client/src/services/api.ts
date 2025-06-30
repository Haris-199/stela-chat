const URL = "http://localhost:3000";

/**
 * Fetches the messages of a specific chat by its ID.
 *
 * @param user - The user payload containing the user's token.
 * @param chatId - The ID of the chat to fetch messages for.
 * @returns A promise that resolves to an `APIResponse` containing the list of messages.
 * @throws If the request fails or the response is not ok.
 */
export async function getMessagesOfChat(user: UserPayload, chatId: number) {
  const res = await fetch(`${URL}/api/chat/${chatId}/message`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch messages for chat");
  }
  return (await res.json()) as APIResponse<Message[]>;
}

/**
 * Fetches the list of  for a given user.
 *
 * @param user - The user payload containing the user's token.
 * @returns A promise that resolves to an `APIResponse` containing the list of chats.
 * @throws If the request fails or the response is not ok.
 */
export async function getChats(user: UserPayload) {
  const res = await fetch(`${URL}/api/chat`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch chats");
  }
  return (await res.json()) as APIResponse<Chat[]>;
}

/**
 * Verifies the validity of a JWT token by sending it to the backend verification endpoint.
 *
 * @param token - The JWT token to verify.
 * @returns A promise that resolves to `true` if the token is valid, or `false` otherwise.
 */
export async function verify(token: string) {
  const res = await fetch(`${URL}/api/auth/verify`, {
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
 * @returns A promise that resolves to an `APIResponse<UserPayload>` on success or a `LoginError` object on failure.
 * @throws If the server responds with a status code >= 500.
 */
export async function login(username: string, password: string) {
  const res = await fetch(`${URL}/api/auth/login`, {
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
  const res = await fetch(`${URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.status >= 500) {
    throw new Error("Register failed, server error.");
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

export interface Chat {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  users: {
    username: string;
  }[];
}

export interface Message {
  id: number;
  chatId: number;
  userId: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    username: string;
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

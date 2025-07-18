import {
  APIResponse,
  APISuccess,
  Chat,
  ChatCreationError,
  LoginError,
  Message,
  FriendRequest,
  RegisterError,
  UserPayload,
  User,
  APIError,
} from "../types";

const URL = "http://localhost:3000";

/**
 * Fetches the incoming friend requests for a user from the backend.
 *
 * @param user - The user payload containing the user's token and username.
 * @returns A promise that resolves to an `APIResponse<FriendRequest[]>` containing a list of incoming friend requests or a `APIError`.
 * @throws If the request fails or the response is not ok.
 */
export async function getIncomingFriendRequests(user: UserPayload) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const res = await fetch(`${URL}/api/user/friend/request`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch incoming friend requests for ${user.user.username}.`);
  }
  return (await res.json()) as APIResponse<FriendRequest[]>;
}

/**
 * Sends a friend request to another user.
 *
 * @param user - The user payload containing the user's token.
 * @param receiver - The username of the user to send the friend request to.
 * @returns A promise that resolves to an `APISuccess` or `APIError` object on success or an error message on failure.
 * @throws If the request fails or the server responds with a status code >= 500.
 */
export async function sendFriendRequest(user: UserPayload, receiver: string) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const res = await fetch(`${URL}/api/user/friend/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
    body: JSON.stringify({ receiver }),
  });
  if (res.status >= 500) {
    throw new Error(`Failed to send friend request to ${receiver}.`);
  }
  return (await res.json()) as APISuccess | APIError;
}

/**
 * Responds to a friend request by accepting or rejecting it.
 *
 * @param user - The user payload containing the user's token.
 * @param requestId - The ID of the friend request to respond to.
 * @param sender - The username of the user who sent the friend request.
 * @returns A promise that resolves to an `APISuccess` object on success or an error message on failure.
 * @throws If the request fails or the server responds with a status code >= 500.
 */
export async function acceptFriendRequest(user: UserPayload, requestId: number, sender: string) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const res = await fetch(`${URL}/api/user/friend/request/${requestId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
    body: JSON.stringify({ sender }),
  });
  if (res.status >= 500) {
    throw new Error(`Failed to accept friend request ${requestId}.`);
  }
  return (await res.json()) as APISuccess | APIError;
}

/**
 * Deletes a friend request by its ID.
 * 
 * @param user - The user payload containing the user's token.
 * @param requestId - The ID of the friend request to delete.
 * @returns A promise that resolves to an `APISuccess` or `APIError`.
 * @throws If the request fails or the server responds with a status code >= 500.
 */
export async function cancelFriendRequest(user: UserPayload, requestId: number) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const res = await fetch(`${URL}/api/user/friend/request/${requestId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
  });
  if (res.status >= 500) {
    throw new Error(`Failed to delete friend request ${requestId}.`);
  }
  return (await res.json()) as APISuccess | APIError;
}

/**
 * Fetches the friends of a user from the backend.
 *
 * @param user - The user payload containing the user's token and username.
 * @returns A promise that resolves to an `APIResponse<User[]>` containing the list of friends.
 * @throws If the request fails or the response is not ok.
 */
export async function getUsersFriends(user: UserPayload) {
  const res = await fetch(`${URL}/api/user/friend`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch friends of ${user.user.username}.`);
  }
  return (await res.json()) as APIResponse<User[]>;
}

/**
 * Fetches a list of all users from the backend.
 *
 * @returns A promise that resolves to an `APIResponse<User[]>` containing the list of users.
 * @throws If the request fails or the response is not ok.
 */
export async function getUsers() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // throw new Error("fail");
  const res = await fetch(`${URL}/api/user`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch users.");
  }
  return (await res.json()) as APIResponse<User[]>;
}

/**
 * Creates a new chat with the specified name and users.
 *
 * @param user - The user payload containing the user's token.
 * @param name - The name of the chat to create.
 * @param users - An array of usernames to add to the chat.
 * @returns A promise that resolves to an `APIResponse<Chat>` containing the created chat.
 * @throws If the request fails or the response is not ok.
 */
export async function createChat(user: UserPayload, name: string, users: string[]) {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // throw new Error("fail");
  const res = await fetch(`${URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
    body: JSON.stringify({ name, users: users.map((username) => ({ username })) }),
  });

  if (res.status >= 500) {
    throw new Error("Failed to create chat, server error.");
  }

  return (await res.json()) as APISuccess | ChatCreationError;
}

/**
 * Creates a message in a specific chat.

 * @param user - The user payload containing the user's token.
 * @param chatId - The ID of the chat to create the message in.
 * @param message - The text of the message to create.
 * @returns A promise that resolves to an `APISuccess`.
 * @throws If the request fails or the response is not ok.
 */
export async function createMessageInChat(user: UserPayload, chatId: number, message: string) {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // throw new Error("fail");
  const res = await fetch(`${URL}/api/chat/${chatId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Failed to create message.");
  }

  return (await res.json()) as APISuccess;
}

/**
 * Fetches the messages of a specific chat by its ID.
 *
 * @param user - The user payload containing the user's token.
 * @param chatId - The ID of the chat to fetch messages for.
 * @returns A promise that resolves to an `APIResponse<Message[]>` containing the list of messages.
 * @throws If the request fails or the response is not ok.
 */
export async function getMessagesOfChat(user: UserPayload, chatId: number) {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const res = await fetch(`${URL}/api/chat/${chatId}/message`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch messages for chat.");
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
    throw new Error("Failed to fetch chats.");
  }
  return (await res.json()) as APIResponse<Chat[]>;
}

/**
 * Verifies the validity of a JWT token by sending it to the backend verification endpoint.
 *
 * @param token - The JWT token to verify.
 * @returns A promise that resolves to `true` if the token is valid, or `false` otherwise.
 */
export async function verify(user: UserPayload) {
  const res = await fetch(`${URL}/api/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
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

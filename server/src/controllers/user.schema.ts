import * as z from "zod";

export const sendFriendRequestSchema = z.object({
  receiver: z.string().trim().min(1, "Receiver username can not be empty."),
});

export const acceptFriendRequestBodySchema = z.object({
  sender: z.string().trim().min(1, "Sender username can not be empty."),
});

export const friendRequestParamsSchema = z.object({
  id: z.coerce.number().min(1, "Invalid user ID."),
});

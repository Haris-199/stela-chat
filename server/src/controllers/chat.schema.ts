import * as z from "zod";

export const createChatSchema = z.object({
  name: z.string().trim().min(1, "Empty chat name given.").max(255, "Chat name is too long."),
  users: z
    .array(z.object({ username: z.string().trim().min(1, "Empty username given.") }))
    .min(1, "At least one user must be selected."),
});

export const createMessageBodySchema = z.object({
  text: z.string().trim().min(1, "Empty text given.").max(255, "Text is too long."),
});

export const createMessageParamsSchema = z.object({
  chatId: z.coerce.number().min(1, "Invalid chat ID."),
});

import { Router } from "express";
import { getChats, getChatMessages, postChatMessages, postChats } from "../controllers/chat";
import { authenticateJWT } from "../middleware/auth";
import {
  createChatSchema,
  createMessageBodySchema,
  createMessageParamsSchema,
} from "../controllers/chat.schema";
import validate from "../middleware/validate";

const router = Router();

router.use(authenticateJWT);

router.get("/", getChats);
router.post("/", validate(createChatSchema), postChats);
router.get("/:chatId/message", getChatMessages);
router.post(
  "/:chatId/message",
  validate(createMessageBodySchema),
  validate(createMessageParamsSchema, "params"),
  postChatMessages,
);

export default router;

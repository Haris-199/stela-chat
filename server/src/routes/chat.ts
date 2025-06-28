import { Router } from "express";
import { getChats, getChatMessages, postChatMessages } from "../controllers/chat";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

router.use(authenticateJWT);

router.get("/", getChats);
router.get("/:chatId/message", getChatMessages);
router.post("/:chatId/message", postChatMessages);

export default router;

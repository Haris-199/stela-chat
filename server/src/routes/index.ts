import { Router } from "express";
import homeRouter from "./home";
import authRouter from "./auth";
import chatRouter from "./chat";

const router = Router();

router.use("/", homeRouter);
router.use("/auth", authRouter);
router.use("/chat", chatRouter);

export default router;

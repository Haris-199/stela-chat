import { Router } from "express";
import homeRouter from "./home";
import authRouter from "./auth";
import chatRouter from "./chat";
import userRouter from "./user";

const router = Router();

router.use("/", homeRouter);
router.use("/auth", authRouter);
router.use("/chat", chatRouter);
router.use("/user", userRouter);

export default router;

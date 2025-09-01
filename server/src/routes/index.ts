import { Router } from "express";
import homeRouter from "./home";
import authRouter from "./auth";
import chatRouter from "./chat";
import userRouter from "./user";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { notFoundErrorHandler } from "../controllers/error";

const router = Router();

const rl = (limit = 90) => {
  return rateLimit({
    windowMs: 1000 * 60 * 10, // 10 minutes
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  });
};

const sd = (delayAfter = 40) => {
  return slowDown({
    windowMs: 1000 * 60 * 10, // 10 minutes
    delayAfter,
    delayMs: () => 500,
    maxDelayMs: 5000,
  });
};

router.use("/auth", rl(), sd(), authRouter);
router.use("/chat", rl(300), chatRouter);
router.use("/user", rl(), sd(), userRouter);
router.use("/", rl(), sd(), homeRouter);
router.all("/*splat", rl(), sd(), notFoundErrorHandler);

export default router;

import { Router } from "express";
import homeRouter from "./home";
import authRouter from "./auth";

const router = Router();

router.use("/", homeRouter);
router.use("/auth", authRouter);

export default router;

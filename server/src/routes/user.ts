import { Router } from "express";
import { getUser, getFriend } from "../controllers/user";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

router.get("/", getUser);
router.get("/friend", authenticateJWT, getFriend);

export default router;

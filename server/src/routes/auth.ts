import { Router } from "express";
import { postLogin, postRegister } from "../controllers/auth";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

router.post("/login", postLogin);
router.post("/register", postRegister);
router.post("/verify", authenticateJWT, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Valid JWT token.",
  });
});

export default router;

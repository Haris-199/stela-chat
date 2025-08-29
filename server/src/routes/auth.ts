import { Router } from "express";
import { postGuest, postLogin, postRegister } from "../controllers/auth";
import { authenticateJWT } from "../middleware/auth";
import validate from "../middleware/validate";
import { loginSchema, registerSchema } from "../controllers/auth.schema";

const router = Router();

router.post("/guest", postGuest);
router.post("/login", validate(loginSchema), postLogin);
router.post("/register", validate(registerSchema), postRegister);
router.post("/verify", authenticateJWT, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Valid JWT token.",
  });
});

export default router;

import { Router } from "express";
import { postLogin, postRegister } from "../controllers/auth";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

router.post("/login", postLogin);
router.post("/register", postRegister); // TODO: Add validation for strong password
router.post("/protected", authenticateJWT, (req, res) => {
  res.json("Success, this is protected.");
});

export default router;

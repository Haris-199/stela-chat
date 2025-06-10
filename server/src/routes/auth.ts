import { Router } from "express";
import { postLogin } from "../controllers/auth";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

router.post("/login", postLogin);
router.post("/protected", authenticateJWT, (req, res) => {
  res.json("Success, this is protected.");
  return;
});

export default router;

import { Router } from "express";
import {
  getUser,
  getFriend,
  getFriendRequest,
  postFriendRequest,
  putFriendRequest,
  deleteFriendRequest,
} from "../controllers/user";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

router.get("/", getUser);
router.use("/friend", authenticateJWT);
router.get("/friend", getFriend);
router.get("/friend/request", getFriendRequest);
router.post("/friend/request", postFriendRequest);
router.put("/friend/request/:id", putFriendRequest);
router.delete("/friend/request/:id", deleteFriendRequest);

export default router;

import { Router } from "express";
import {
  getUser,
  getFriend,
  getFriendRequest,
  postFriendRequest,
  putFriendRequest,
  deleteFriendRequest,
  deleteFriend,
} from "../controllers/user";
import { authenticateJWT } from "../middleware/auth";
import validate from "../middleware/validate";
import { acceptFriendRequestBodySchema, friendRequestParamsSchema, sendFriendRequestSchema } from "../controllers/user.schema";

const router = Router();

router.use(authenticateJWT);

router.get("/", getUser);

router.get("/friend/request", getFriendRequest);
router.post("/friend/request", validate(sendFriendRequestSchema), postFriendRequest);
router.put("/friend/request/:id", validate(acceptFriendRequestBodySchema), validate(friendRequestParamsSchema, "params"), putFriendRequest);
router.delete("/friend/request/:id", validate(friendRequestParamsSchema, "params"), deleteFriendRequest); ////

router.get("/friend", getFriend);
router.delete("/friend/:username", deleteFriend); /////

export default router;

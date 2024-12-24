import express from "express";

import { verifyUserToken } from "../middleware/userTokenCheck.js";
import facultyTokenCheck from "../middleware/facultyTokenCheck.js";

import {
  fetchChats,
  fetchHistory,
  sendMessage,
} from "../controllers/chat.controllers.js";

const router = express.Router();

router.get("/history/user/:userId/:supportId", verifyUserToken, fetchHistory);
router.get(
  "/history/faculty/:userId/:supportId",
  facultyTokenCheck,
  fetchHistory
);
router.post("/user/send", verifyUserToken, sendMessage);
router.post("/faculty/send", facultyTokenCheck, sendMessage);

router.get("/faculty/chats", facultyTokenCheck, fetchChats);

export default router;

import express from "express";
import {
  fetchUser,
  userLogin,
  userRegister,
} from "../controllers/user.controllers.js";
import { verifyUserToken } from "../middleware/userTokenCheck.js";

const router = express.Router();

router.get("/", verifyUserToken, fetchUser);
router.post("/login", userLogin);
router.post("/register", userRegister);

export default router;

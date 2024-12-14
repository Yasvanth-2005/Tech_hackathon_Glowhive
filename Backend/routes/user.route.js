import express from "express";
import {
  addSOS,
  checkEmail,
  fetchUser,
  getAllUsers,
  getUsersById,
  postSOS,
  sendOtp,
  updateChecking,
  updateProfile,
  userLogin,
  userRegister,
  verifyOtp,
} from "../controllers/user.controllers.js";
import { verifyUserToken } from "../middleware/userTokenCheck.js";
import adminTokenCheck from "../middleware/adminTokenCheck.js";

const router = express.Router();

router.get("/", verifyUserToken, fetchUser);
router.post("/email", checkEmail);
router.post("/login", userLogin);
router.post("/register", userRegister);
router.get("/all", adminTokenCheck, getAllUsers);
router.get("/:id", adminTokenCheck, getUsersById);
router.patch("/edit", verifyUserToken, updateProfile);
router.put("/checking", verifyUserToken, updateChecking);
router.patch("/sos", verifyUserToken, addSOS);
router.post("/sos/submit", verifyUserToken, postSOS);

router.post("/send/otp", sendOtp);
router.post("/verify/otp", verifyOtp);

export default router;

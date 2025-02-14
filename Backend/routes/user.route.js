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
  updatePrimarySOS,
  updateProfile,
  updateUsername,
  userLogin,
  userRegister,
  postForgotPassword,
  verifyOtp,
  verifyForgotPassword,
  resPassword,
  userGoogleLogin,
} from "../controllers/user.controllers.js";
import { verifyUserToken } from "../middleware/userTokenCheck.js";
import adminTokenCheck from "../middleware/adminTokenCheck.js";

const router = express.Router();

router.get("/", verifyUserToken, fetchUser);
router.post("/email", checkEmail);
router.post("/login", userLogin);
router.post("/login/google", userGoogleLogin);
router.post("/register", userRegister);
router.get("/all", adminTokenCheck, getAllUsers);
router.get("/:id", adminTokenCheck, getUsersById);
router.patch("/edit", verifyUserToken, updateProfile);
router.put("/checking", verifyUserToken, updateChecking);
router.patch("/sos", verifyUserToken, addSOS);
router.post("/sos/submit", verifyUserToken, postSOS);

router.post("/recover/password", postForgotPassword);
router.post("/verify/password", verifyForgotPassword);
router.post("/reset/password", resPassword);

router.post("/send/otp", sendOtp);
router.post("/verify/otp", verifyOtp);

router.patch("/edit/username", verifyUserToken, updateUsername);
router.patch("/edit/primary", verifyUserToken, updatePrimarySOS);

export default router;

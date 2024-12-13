import express from "express";
import {
  checkEmail,
  fetchUser,
  getAllUsers,
  getUsersById,
  updateChecking,
  updateProfile,
  userLogin,
  userRegister,
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

export default router;

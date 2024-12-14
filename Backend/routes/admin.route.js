import express from "express";
import {
  adminLogin,
  adminRegister,
  getAdmin,
  getAllAdmins,
} from "../controllers/admin.controllers.js";
import adminTokenCheck from "../middleware/adminTokenCheck.js";

const router = express.Router();

router.get("/", adminTokenCheck, getAdmin);
router.post("/login", adminLogin);
router.post("/register", adminTokenCheck, adminRegister);
router.get("/admins", adminTokenCheck, getAllAdmins);

export default router;

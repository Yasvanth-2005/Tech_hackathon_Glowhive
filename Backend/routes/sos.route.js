import express from "express";
import adminTokenCheck from "../middleware/adminTokenCheck.js";
import {
  deleteSOSGlobal,
  getAlerts,
  getAllSOSGlobal,
  getUserSOS,
  postSOSGlobal,
  updateAlerts,
  updateSOSGlobal,
} from "../controllers/sos.controllers.js";
import { verifyUserToken } from "../middleware/userTokenCheck.js";

const router = express.Router();

router.get("/", getAllSOSGlobal);
router.get("/user", verifyUserToken, getUserSOS);
router.post("/new", adminTokenCheck, postSOSGlobal);
router.patch("/edit/:id", adminTokenCheck, updateSOSGlobal);
router.delete("/delete/:id", adminTokenCheck, deleteSOSGlobal);
router.patch("/edit/alert/:id", adminTokenCheck, updateAlerts);
router.get("/alerts", adminTokenCheck, getAlerts);

export default router;

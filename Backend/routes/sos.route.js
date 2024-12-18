import express from "express";
import adminTokenCheck from "../middleware/adminTokenCheck.js";
import {
  deleteSOSGlobal,
  getAllSOSGlobal,
  getUserSOS,
  postSOSGlobal,
  updateSOSGlobal,
} from "../controllers/sos.controllers.js";
import { verifyUserToken } from "../middleware/userTokenCheck.js";

const router = express.Router();

router.get("/", getAllSOSGlobal);
router.post("/user", verifyUserToken, getUserSOS);
router.post("/new", adminTokenCheck, postSOSGlobal);
router.patch("/edit/:id", adminTokenCheck, updateSOSGlobal);
router.delete("/delete/:id", adminTokenCheck, deleteSOSGlobal);

export default router;

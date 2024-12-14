import express from "express";
import adminTokenCheck from "../middleware/adminTokenCheck.js";
import {
  deleteSOSGlobal,
  getAllSOSGlobal,
  postSOSGlobal,
  updateSOSGlobal,
} from "../controllers/sos.controllers.js";

const router = express.Router();

router.get("/", getAllSOSGlobal);
router.post("/new", adminTokenCheck, postSOSGlobal);
router.patch("/edit/:id", adminTokenCheck, updateSOSGlobal);
router.delete("/delete/:id", adminTokenCheck, deleteSOSGlobal);

export default router;

import express from "express";
import adminTokenCheck from "../middleware/adminTokenCheck.js";
import {
  deleteSupportmen,
  getAllSupportMem,
  postSupportMem,
  updateSupportMem,
  loginSupportMem,
} from "../controllers/support.controllers.js";

const router = express.Router();

router.get("/", getAllSupportMem);
router.post("/login", loginSupportMem);
router.post("/new", adminTokenCheck, postSupportMem);
router.patch("/edit/:id", adminTokenCheck, updateSupportMem);
router.delete("/delete/:id", adminTokenCheck, deleteSupportmen);

export default router;

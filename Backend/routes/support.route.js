import express from "express";
import adminTokenCheck from "../middleware/adminTokenCheck.js";
import {
  deleteSupportmen,
  getAllSupportMem,
  postSupportMem,
  updateSupportMem,
  loginSupportMem,
  fetchFaculty,
} from "../controllers/support.controllers.js";
import facultyTokenCheck from "../middleware/facultyTokenCheck.js";

const router = express.Router();

router.get("/", getAllSupportMem);
router.get("/login", facultyTokenCheck, fetchFaculty);
router.post("/login", loginSupportMem);
router.post("/new", adminTokenCheck, postSupportMem);
router.patch("/edit/:id", adminTokenCheck, updateSupportMem);
router.delete("/delete/:id", adminTokenCheck, deleteSupportmen);

export default router;

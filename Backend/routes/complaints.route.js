import express from "express";
import { verifyUserToken } from "../middleware/userTokenCheck.js";
import {
  getAllComplaints,
  getComplaintDetails,
  sendComplaint,
  updateComplaint,
  getUserComplaintDetails,
  deleteComplaint,
} from "../controllers/complaints.controllers.js";
import adminTokenCheck from "../middleware/adminTokenCheck.js";

const router = express.Router();

router.post("/", verifyUserToken, sendComplaint);
router.get("/user", verifyUserToken, getUserComplaintDetails);
router.get("/delete/:id", verifyUserToken, deleteComplaint);

router.put("/:id", adminTokenCheck, updateComplaint);
router.get("/admin", adminTokenCheck, getAllComplaints);
router.get("/:id", adminTokenCheck, getComplaintDetails);

export default router;

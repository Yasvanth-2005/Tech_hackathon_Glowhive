import express from "express";
import adminTokenCheck from "../middleware/adminTokenCheck.js";
import {
  deleteNotification,
  getAllNotifications,
  postNotification,
  updateNotification,
} from "../controllers/notifications.controllers.js";

const router = express.Router();

router.get("/", getAllNotifications);
router.post("/new", adminTokenCheck, postNotification);
router.patch("/edit/:id", adminTokenCheck, updateNotification);
router.delete("/delete/:id", adminTokenCheck, deleteNotification);

export default router;

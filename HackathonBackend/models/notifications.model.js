import mongoose from "mongoose";

const NotificationsModel = new mongoose.Schema({
  title: { type: String, required: [true, "Description is required"] },
  description: { type: String, required: [true, "Description is required"] },
  links: { type: [String], default: [] },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "Admin",
    default: null,
  },
});

const Notifications = mongoose.model("Notifications", NotificationsModel);
export default Notifications;

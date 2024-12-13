import mongoose from "mongoose";

const NotificationsModel = new mongoose.Schema({
  title: { type: String, required: true },
  desciption: { type: String, required: true },
  links: { type: [String] },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "Admin",
    default: null,
  },
});

const Notifications = mongoose.model("Notifications", NotificationsModel);
export default Notifications;

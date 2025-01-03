import mongoose from "mongoose";

const AlertModel = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    audioLink: { type: String },
    videoLink: { type: String },
    location: { type: [String], required: true },
    status: { type: String, enum: ["Unsolved", "Solved"], default: "Unsolved" },
  },
  { timestamps: true }
);

const Alert = mongoose.model("Alert", AlertModel);
export default Alert;

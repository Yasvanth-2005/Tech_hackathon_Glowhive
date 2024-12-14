import mongoose from "mongoose";

const ComplaintUserSchema = new mongoose.Schema(
  {
    typeOfComplaint: {
      type: String,
      enum: ["Personal", "General", "Harassment"],
      default: "Personal",
    },
    statement: {
      type: String,
    },
    description: {
      type: String,
    },
    victinDetails: { type: String },
    harasserDetails: { type: String },
    harasserType: { type: String },
    category: { type: String },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Rejected", "Solved"],
      default: "Pending",
    },
    img: { type: String },
    video: { type: String },
    isCritical: { type: Boolean, default: false },
    isAnonymus: { type: Boolean, default: false },
    location: { type: String },
    time: { type: String },
  },
  {
    timestamps: true,
  }
);

const Complaints = mongoose.model("Complaints", ComplaintUserSchema);
export default Complaints;

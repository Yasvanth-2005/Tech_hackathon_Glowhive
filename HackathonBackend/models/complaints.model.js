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
      required: [true, "Statement is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
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
  },
  {
    timestamps: true,
  }
);

const Complaints = mongoose.model("Complaints", ComplaintUserSchema);
export default Complaints;

import mongoose from "mongoose";

const ComplaintUserSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["Academics", "Hostel"],
      default: "Hostel",
    },
    workplace: {
      type: String,
      required: [true, "Workplace is required."],
    },
    category: {
      type: String,
      required: [true, "Category is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    dateAndTime: {
      type: String,
    },
    photo: {
      type: String,
    },
    isCritical: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["New", "Pending", "Solved", "Rejected"],
      default: "New",
    },
    acknowledgementId: {
      type: String,
      required: [true, "Acknowledgement ID is required."],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
    },
  },
  {
    timestamps: true,
  }
);

const Complaints = mongoose.model("Complaints", ComplaintUserSchema);
export default Complaints;

import mongoose from "mongoose";

const SOSModel = new mongoose.Schema({
  video: { type: String, unique: true, required: true },
  audio: { type: String, required: true },
  location: { type: String, required: true },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    default: null,
  },
});

const SOS = mongoose.model("SOS", SOSModel);
export default SOS;

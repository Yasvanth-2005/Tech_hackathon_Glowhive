import mongoose from "mongoose";

const SupportModel = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  phno: { type: String, required: true },
  position: { type: String, required: true },
});

const Support = mongoose.model("Support", SupportModel);
export default Support;

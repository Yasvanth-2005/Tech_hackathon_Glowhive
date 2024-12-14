import mongoose from "mongoose";

const SosGlobalSchema = new mongoose.Schema({
  phno: { type: String, required: [true, "Phone Number is required"] },
  name: { type: String, required: [true, "Phone Number is required"] },
  email: { type: String, required: [true, "Phone Number is required"] },
});

const SOS = mongoose.model("SOS", SosGlobalSchema);
export default SOS;

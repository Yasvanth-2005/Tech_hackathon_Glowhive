import mongoose from "mongoose";

const SosGlobalSchema = new mongoose.Schema({
  phno: { type: String, required: [true, "Phone Number is required"] },
  name: { type: String, required: [true, "Username is required"] },
  email: { type: String, required: [true, "Email is required"] },
});

const SOS = mongoose.model("SOSNumbers", SosGlobalSchema);
export default SOS;

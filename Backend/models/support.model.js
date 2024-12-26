import mongoose from "mongoose";

const SupportModel = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "Usernames Should be Unique"],
    required: [true, "Username Field is Required"],
  },
  phno: { type: String, required: [true, "Phone Number is Required"] },
  password: { type: String, required: [true, "Password is Required"] },
  position: { type: String, required: [true, "Position Field is Required"] },
});

const Support = mongoose.model("Support", SupportModel);
export default Support;

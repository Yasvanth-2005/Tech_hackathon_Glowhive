import mongoose from "mongoose";

const adminModel = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  password: { type: String, required: true },
  role: { type: String, enum: [], required: true },
});

const Admin = mongoose.model("Admin", adminModel);
export default Admin;

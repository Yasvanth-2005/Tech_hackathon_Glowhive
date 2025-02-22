import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    password: { type: String, required: [true, "Password is required"] },
    phno: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    collegeId: {
      type: String,
      required: true,
    },
    sos: {
      type: [
        {
          name: { type: String, required: true },
          phno: {
            type: String,
            required: true,
            match: [/^\d{10}$/, "Phone number must be 10 digits"],
          },
          email: {
            type: String,
            required: true,
            match: [/.+@.+\..+/, "Please enter a valid email address"],
          },
        },
      ],
      default: [],
    },
    complaints: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Complaints" }],
      default: [],
    },
    is_checked: {
      type: Boolean,
      default: false,
    },
    primary_sos: {
      type: String,
      required: [true, "Primary SOS phone number is required"],
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    userType: {
      type: String,
      enum: ["user", "staff"],
      default: "user",
    },
    profileImg : {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;

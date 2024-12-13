import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { adminId: admin._id, adminRole: admin.role },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: "12h" }
    );

    const adminResponse = {
      ...admin._doc,
      password: undefined,
    };

    return res.status(200).json({ admin: adminResponse, token });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const adminRegister = async (req, res) => {
  const { username, password, role, email } = req.body;

  try {
    if (!username || !password || !role || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new admin user
    const newUser = await Admin.create({
      username,
      email,
      role,
      password: hashedPassword,
    });

    // Return the new user (excluding the password)
    const userResponse = {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      _id: newUser._id,
    };

    return res.status(201).json({ user: userResponse });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }

    console.error("Error during admin registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAdmin = async (req, res) => {
  const adminId = req.admin;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin Not Found" });
    }

    const adminResponse = {
      ...admin._doc,
      password: undefined,
    };

    return res.status(200).json({ admin: adminResponse });
  } catch (error) {
    console.error("Error during admin fetch:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

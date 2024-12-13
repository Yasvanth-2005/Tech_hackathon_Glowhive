import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const fetchUser = async (req, res) => {
  const userId = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userResponse = {
      ...user._doc,
      password: undefined,
    };

    return res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    const userResponse = {
      ...user._doc,
      password: undefined,
    };

    return res.status(200).json({ user: userResponse, token });
  } catch (error) {
    console.error("Error during User login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userRegister = async (req, res) => {
  const { username, password, phno, collegeId, email } = req.body;

  try {
    if (!username || !password || !phno || !collegeId || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new admin user
    const newUser = await User.create({
      username,
      email,
      phno,
      collegeId,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    const userResponse = {
      ...newUser._doc,
      password: undefined,
    };

    return res.status(201).json({ user: userResponse, token });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }

    console.error("Error during admin registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

import User from "../models/user.model.js";
import SOS from "../models/sosMembers.model.js";
import Otp from "../models/otp.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const fetchUser = async (req, res) => {
  const userId = req.user;

  try {
    const user = await User.findById(userId).populate("complaints");
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

    const user = await User.findOne({ email: email.toLowerCase() }).populate(
      "complaints"
    );
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: username.toUpperCase(),
      email: email.toLowerCase(),
      phno,
      collegeId,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

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

export const checkEmail = async (req, res) => {
  const { email } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid or missing email format" });
  }

  try {
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    return res.status(200).json({ message: "Email is available" });
  } catch (err) {
    console.error("Error while checking email:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    return res.status(200).json({ users });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUsersById = async (req, res) => {
  const { id } = req.params;

  try {
    const users = await User.find({ collegeId: id }).select("-password");

    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    if (users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    return res.status(200).json({ users });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateChecking = async (req, res) => {
  const userId = req.user;
  try {
    await User.findByIdAndUpdate(userId, { is_checked: true });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user;
  const { username, password, oldPassword } = req.body;

  try {
    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Username is required" });
    }

    if (!oldPassword || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      return res.status(400).json({ message: "Invalid User Old Password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.username = username;
    user.password = hashedPassword;
    const updatedUser = await user.save();

    const populatedUser = await updatedUser.populate("complaints");
    const userResponse = {
      ...populatedUser._doc,
      password: undefined,
    };

    return res
      .status(200)
      .json({ message: "Profile Updated Successfully", user: userResponse });
  } catch (err) {
    console.error("Error during profile update:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  const rguktnEmailRegex = /^[NnRrOoSs]\d{6}@rguktn\.ac\.in$/;
  if (!email || !rguktnEmailRegex.test(email)) {
    return res.status(400).json({ message: "RGUKTN Email is required" });
  }

  try {
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const existingOtp = await Otp.findOne({ email: email.toLowerCase() });
    if (existingOtp) {
      existingOtp.otp = otp;
      await existingOtp.save();
    } else {
      const newOtp = new Otp({ email: email.toLowerCase(), otp });
      await newOtp.save();
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "sivahere9484@gmail.com",
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: "OTP Verification",
        address: "sivahere9484@gmail.com",
      },
      to: email.split(",").map((email) => email.trim()),
      subject: "Email Verfication of Girl Grievance",
      html: `
        <>
          <h1>${otp}</h1>
        </>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "OTP sent to email successfully" });
  } catch (err) {
    console.error("Error while sending OTP:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const existingOtp = await Otp.findOne({ email: email.toLowerCase() });

    if (!existingOtp) {
      return res.status(401).json({ message: "OTP expired or not found" });
    }

    if (existingOtp.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    await Otp.deleteOne({ email: email.toLowerCase() });

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error during OTP verification:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addSOS = async (req, res) => {
  const userId = req.user;
  const { numbers } = req.body;

  try {
    const nowuser = await User.findByIdAndUpdate(
      userId,
      { $push: { sos: numbers } },
      { new: true }
    );

    if (!nowuser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = {
      ...nowuser._doc,
      password: undefined,
    };

    return res.status(200).json({ user: userResponse });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "../output/sos");
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage }).fields([{ name: "img" }, { name: "video" }]);

// export const postSOS = async (req, res) => {
//   try {
//     const userId = req.user; // Assuming middleware sets `req.user`
//     let attachments = req.files || [];
//     const { location } = req.body;

//     // Fetch user details
//     const nowuser = await User.findById(userId);
//     if (!nowuser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Mask sensitive data before including in the email
//     const userResponse = {
//       ...nowuser._doc,
//       password: undefined,
//     };

//     // Fetch all SOS recipients
//     const sosNumbers = await SOS.find();

//     if (!sosNumbers.length) {
//       return res.status(404).json({ message: "No SOS recipients found" });
//     }

//     // Setup nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "sivahere9484@gmail.com",
//     pass: process.env.PASSWORD,
//   },
// });

//     // Send emails to all SOS recipients
//     const emailPromises = sosNumbers.map((recipient) =>
//       transporter.sendMail({
// from: {
//   name: "SOS Alert",
//   address: process.env.EMAIL,
// },
//         to: recipient.email,
//         subject: "🚨 SOS Notification 🚨",
//         html: `
//           <h1 style="text-align:center">From <span style="color:purple;">Girl Grievances</span>.</h1>
//           <h4 style="text-align:center">Emergency Alert: Immediate Assistance Required</h4>
//           <h5 style="text-align:center">Dear Authority,</h5>
//           <p style="text-align:center">The app recognizes that one of your User in Threat Situation.  </p>
//           <pre style="text-align:center">
//             Name of User: ${userResponse.username}
//             Contact Information: +91 ${userResponse.phno}
//             Location: ${location}
//           </pre>
//         `,
//         attachments: attachments.map((att) => ({
//           filename: att.originalname,
//           path: att.path,
//         })),
//       })
//     );

//     // Wait for all emails to be sent
//     await Promise.all(emailPromises);

//     // Clean up uploaded files
//     await Promise.all(attachments.map((att) => fs.unlink(att.path)));

//     // Respond with success
//     return res
//       .status(200)
//       .json({ message: "SOS notifications sent successfully" });
//   } catch (err) {
//     console.error("Error in postSOS:", err.message);

//     // Ensure any file cleanup even on errors
//     if (req.files) {
//       await Promise.all(
//         req.files.map((att) => fs.unlink(att.path).catch(() => null))
//       );
//     }

//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

import fs from "fs/promises";

export const postSOS = async (req, res) => {
  try {
    const userId = req.user;
    let attachments = req.files || [];
    const { location } = req.body;

    if (!Array.isArray(location) || location.length !== 2) {
      return res
        .status(400)
        .json({ message: "Invalid location format. Expected [lat, long]." });
    }
    const [lat, long] = location;

    const nowuser = await User.findById(userId);
    if (!nowuser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = {
      ...nowuser._doc,
      password: undefined,
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "sivahere9484@gmail.com",
        pass: process.env.PASSWORD,
      },
    });

    const googleMapsLink = `https://www.google.com/maps?q=${lat},${long}`;

    // Send email to the specified recipient
    await transporter.sendMail({
      from: {
        name: "SOS Alert",
        address: "sivahere9484@gmail.com",
      },
      to: "yasvanthhanumantu1@gmail.com",
      subject: "🚨 SOS Notification 🚨",
      html: `
        <h1 style="text-align:center">From <span style="color:purple;">Girl Grievances</span>.</h1>
        <h4 style="text-align:center">Emergency Alert: Immediate Assistance Required</h4>
        <h5 style="text-align:center">Dear Authority,</h5>
        <p style="text-align:center">The app recognizes that one of your Users is in a Threat Situation.</p>
        <pre style="text-align:center">
          Name of User: ${userResponse.username}
          Contact Information: +91 ${userResponse.phno}
          Location Coordinates: [${lat}, ${long}]
          <a href="${googleMapsLink}" target="_blank">View Location on Google Maps</a>
        </pre>
      `,
      attachments: attachments.map((att) => ({
        filename: att.originalname,
        path: att.path,
      })),
    });

    // Clean up uploaded files
    await Promise.all(attachments.map((att) => fs.unlink(att.path)));

    // Respond with success
    return res
      .status(200)
      .json({ message: "SOS notification sent successfully" });
  } catch (err) {
    console.error("Error in postSOS:", err.message);

    // Ensure any file cleanup even on errors
    if (req.files) {
      await Promise.all(
        req.files.map((att) => fs.unlink(att.path).catch(() => null))
      );
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

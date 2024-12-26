import Complaints from "../models/complaints.model.js";
import User from "../models/user.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../output/complaints");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage }).fields([{ name: "img" }, { name: "video" }]);

export const sendComplaint = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload failed", error: err });
    }

    const {
      typeOfComplaint,
      statement,
      description,
      category,
      userId,
      isCritical,
      location,
      time,
      victinDetails,
      harasserDetails,
      harasserType,
    } = req.body;

    const img = req.files?.img?.[0]?.path || null;
    const video = req.files?.video?.[0]?.path || null;

    const finalUserId = userId?.trim() ? userId : null;

    try {
      const complaint = await Complaints.create({
        typeOfComplaint,
        statement,
        description,
        category,
        userId: finalUserId,
        img,
        video,
        isCritical,
        location,
        time,
        victinDetails,
        harasserDetails,
        harasserType,
      });

      if (!complaint) {
        return res.status(404).json({ message: "Posting Complaint Failed" });
      }

      console.log(req.user);
      const user = await User.findById(req.user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log(user);

      user.complaints.push(complaint._id);
      await user.save();

      return res.status(200).json({
        message: "New Complaint Sent Successfully",
        complaint,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ message: "Validation Error", errors });
      }

      console.error("Error during complaint submission:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

export const updateComplaint = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const validStatuses = ["Pending", "Rejected", "Solved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid Status" });
    }

    const complaint = await Complaints.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.status === "Solved") {
      return res
        .status(400)
        .json({ message: "Complaint is already solved. Cannot update." });
    }

    complaint.status = status;
    await complaint.save();

    return res
      .status(200)
      .json({ message: "Complaint Updated Successfully", complaint });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }

    console.error("Error during complaint update:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllComplaints = async (req, res) => {
  const { role } = req;
  console.log("User Role:", role);

  const roleDaysMapping = {
    HOD: 10,
    DSW: 7,
    AO: 3,
    Warden: 0,
  };

  if (!roleDaysMapping.hasOwnProperty(role)) {
    return res
      .status(403)
      .json({ message: "You are not allowed to see this data" });
  }

  try {
    let filter = {};

    if (role === "HOD") {
      // HOD: Complaints 10 days old or more
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      filter = {
        createdAt: { $lt: tenDaysAgo }, // Complaints older than 10 days
      };
    } else if (role !== "Warden") {
      // Other roles: Complaints within their respective roleDaysMapping time frame
      const days = roleDaysMapping[role];
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);

      filter = {
        $or: [{ isCritical: true }, { createdAt: { $gte: daysAgo } }],
      };
    }

    const complaints = await Complaints.find(filter).populate(
      "userId",
      "email username phno collegeId"
    );

    if (!complaints.length) {
      return res
        .status(404)
        .json({ message: "No complaints found for your role" });
    }

    return res.status(200).json({
      message: "Complaints fetched successfully",
      complaints,
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getComplaintDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const complaint = await Complaints.findById(id).populate(
      "userId",
      "email username phno collegeId"
    );
    if (!complaint) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({ complaint });
  } catch (error) {
    console.error("Error fetching complaint:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserComplaintDetails = async (req, res) => {
  const userId = req.user;

  try {
    const userComplaints = await Complaints.find({ userId });
    if (!userComplaints) {
      return res.status(404).json({ message: "User Not Found" });
    }

    return res.status(200).json({ complaints: userComplaints });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ messgae: "Internal Server Error" });
  }
};

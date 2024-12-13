import Complaints from "../models/complaints.model.js";
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
    } = req.body;

    const img = req.files?.img?.[0]?.path || null;
    const video = req.files?.video?.[0]?.path || null;

    try {
      const complaint = await Complaints.create({
        typeOfComplaint,
        statement,
        description,
        category,
        userId,
        img,
        video,
        isCritical,
        location,
        time,
      });

      if (!complaint) {
        return res.status(404).json({ message: "Posting Complaint Failed" });
      }

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
  const role = req.role;
  if (role === "HOD" || role === "DSW" || role === "AO" || role === "Warden") {
    try {
      let days = 0;
      if (role === "HOD") {
        days = 10;
      } else if (role === "DSW") {
        days = 7;
      } else if (role === "AO") {
        days = 3;
      } else {
        days = 0;
      }

      const DaysAgo = new Date();
      DaysAgo.setDate(DaysAgo.getDate() - days);

      const complaints = await Complaints.find({
        $or: [{ isCritical: true }, { createdAt: { $gte: DaysAgo } }],
      });

      if (complaints.length === 0) {
        return res
          .status(404)
          .json({ message: "No critical or recent complaints found" });
      }

      return res.status(200).json({
        message: "Critical or recent complaints fetched successfully",
        complaints,
      });
    } catch (error) {
      console.error("Error fetching complaints:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res
      .status(404)
      .json({ message: "You are not allowed to see this data" });
  }
};

export const getComplaintDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const complaint = await Complaints.findById(id);
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

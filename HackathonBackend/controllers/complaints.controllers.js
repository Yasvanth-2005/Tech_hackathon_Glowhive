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
    const modifiedComplaint = await Complaints.findByIdAndUpdate(id, {
      status,
    });

    if (!modifiedComplaint) {
      return res.status(404).json({ message: "Updation Failed" });
    }

    return res.status(200).json({ message: "Complaint Updated Successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }

    console.error("Error during admin registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaints.find();

    if (!complaints) {
      return res.status(404).json({ message: "Complaints Not Found" });
    }

    return res.status(200).json({ complaints });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ messgae: "Internal Server Error" });
  }
};

export const getAOComplaints = async (req, res) => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const complaints = await Complaints.find({
      $or: [{ isCritical: true }, { createdAt: { $gte: threeDaysAgo } }],
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
};

export const getDSWComplaints = async (req, res) => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 7);

    const complaints = await Complaints.find({
      $or: [{ isCritical: true }, { createdAt: { $gte: threeDaysAgo } }],
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
};

export const getHODComplaints = async (req, res) => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 10);

    const complaints = await Complaints.find({
      $or: [{ isCritical: true }, { createdAt: { $gte: threeDaysAgo } }],
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
};

export const getComplaintDetails = async (req, res) => {};

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

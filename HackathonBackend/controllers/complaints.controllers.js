import Complaints from "../models/complaints.model.js";

export const sendComplaint = async (req, res) => {
  const {
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
  } = req.body;

  try {
    const complaint = await Complaints.create({
      description,
      typeOfComplaint,
      statement,
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
      complaint: complaint,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }

    console.error("Error during admin registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateComplaint = async (req, res) => {};

export const getAllComplaints = async (req, res) => {};

export const getAOComplaints = async (req, res) => {};

export const getDSWComplaints = async (req, res) => {};

export const getHODComplaints = async (req, res) => {};

export const getComplaintDetails = async (req, res) => {};

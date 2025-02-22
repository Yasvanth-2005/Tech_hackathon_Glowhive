import Complaints from "../models/complaints.model.js";
import User from "../models/user.model.js";
import nodemailer from "nodemailer";

export const sendComplaint = async (req, res) => {
  const userId = req.user;
  try {
    const {
      section,
      workplace,
      category,
      description,
      dateAndTime,
      photo,
      isCritical,
    } = req.body;

    // Generate unique Acknowledgement ID
    const acknowledgementId = `RGUKT-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

    // Create complaint
    const complaint = await Complaints.create({
      section,
      workplace,
      category,
      description,
      dateAndTime,
      photo,
      isCritical,
      status: "New",
      acknowledgementId,
      userId,
    });

    if (!complaint) {
      return res.status(400).json({ message: "Posting Complaint Failed" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { complaints: complaint._id } },
      { new: true }
    );

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
        name: "Complaint Registered",
        address: "sivahere9484@gmail.com",
      },
      to: user.email,
      subject: "Complaint Acknowlegment of POSH",
      html: `
            <div>
              <h2>Complaint Registered</h2>
              <h3>Complaint Acknowledgment ID: ${acknowledgementId}</h3>
              <div>
                <h4>WorkPlace : ${complaint.workplace}</h4>
                <h4>Type of Complint : ${complaint.category}</h4>
                <h4>Complaint Description : ${complaint.description}</h4>
              </div>
            </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

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
};

export const updateComplaint = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const validStatuses = ["New", "Pending", "Rejected", "Solved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid Status" });
    }

    const complaint = await Complaints.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
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
  try {
    const role = req.role;
    if (!role) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    console.log("User Role:", role);

    const roleDaysMapping = {
      Hostel: {
        "Chief Warden": 0,
        DSW: 2,
        "Dean Academics": 2,
        "Administrator Officer": 4,
        Director: 6,
        ICC: 8,
        Registrar: 10,
        "Vice Chancellor": 12,
      },
      Academics: {
        HOD: 0,
        DSW: 2,
        "Dean Academics": 2,
        "Administrator Officer": 4,
        Director: 6,
        ICC: 8,
        Registrar: 10,
        "Vice Chancellor": 12,
      },
      Open_Premises: {
        ADSW: 0,
        DSW: 2,
        "Dean Academics": 2,
        "Administrator Officer": 4,
        Director: 6,
        ICC: 8,
        Registrar: 10,
        "Vice Chancellor": 12,
      },
    };

    // Check if the role exists in any section
    let roleFound = false;
    let filters = [{ isCritical: true }];

    for (const [section, mapping] of Object.entries(roleDaysMapping)) {
      if (mapping[role] !== undefined) {
        roleFound = true;

        const days = mapping[role];
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);

        filters.push({
          section,
          createdAt: { $lte: dateLimit },
        });
      }
    }

    if (!roleFound) {
      return res
        .status(403)
        .json({ message: "You are not allowed to see this data" });
    }

    const filter = { $or: filters };
    console.log("Applied Filter:", filter);

    const complaints = await Complaints.find(filter)
      .populate("userId", "email username phno collegeId")
      .sort({ createdAt: -1 });

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
    const complaint = await Complaints.findOne({
      acknowledgementId: id,
    }).populate("userId", "email username phno collegeId");
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
    // Find the user and populate their complaints
    const user = await User.findById(userId)
      .populate("complaints")
      .sort({ createdAt: -1 });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Return all complaints associated with the user
    return res.status(200).json({ complaints: user.complaints });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteComplaint = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComplaint = await Complaints.findByIdAndDelete(id);

    if (!deletedComplaint) {
      return res.status(404).json({ message: "Complaint Not Found" });
    }

    return res.status(200).json({ message: "Complaint Deleted Successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

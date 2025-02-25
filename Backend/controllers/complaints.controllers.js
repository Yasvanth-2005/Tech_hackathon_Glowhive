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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
  <h2 style="font-size: 24px; font-weight: 600; text-align: center; margin-bottom: 16px;">
    <span style="color: #1E3A8A;">POSH</span> Complaint Acknowledgement
  </h2>

  <p style="font-size: 14px; color: #4A4A4A; text-align: center; margin-bottom: 20px;">
    Thank you for submitting your complaint. Your Acknowledgement ID is shown below. Use this ID to track the status of your complaint.
  </p>

  <div style="background-color: rgba(30, 58, 138, 0.15); color: #1A1A1A; font-size: 24px; font-family: monospace; font-weight: bold; text-align: center; padding: 10px; border-radius: 8px; margin-bottom: 20px;">
    ${acknowledgementId}
  </div>

  <div style="margin-bottom: 20px;">
    <h4 style="font-size: 16px; margin: 8px 0;">WorkPlace: ${complaint.workplace}</h4>
    <h4 style="font-size: 16px; margin: 8px 0;">Type of Complaint: ${complaint.category}</h4>
    <h4 style="font-size: 16px; margin: 8px 0;">Complaint Description: ${complaint.description}</h4>
  </div>

  <p style="font-size: 12px; color: #6B7280; text-align: center; margin-top: 20px;">
    If you did not submit this complaint, please contact support immediately.
  </p>
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
  const role = req.role;
  const { status, admin_description } = req.body;

  try {
    const validStatuses = ["Pending", "Rejected", "Solved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid Status" });
    }

    const complaint = await Complaints.findByIdAndUpdate(
      id,
      {
        admin_description,
        status,
        admin_role: role,
      },
      {
        new: true,
      }
    ).populate("userId");
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
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
        name: "Complaint Registered",
        address: "sivahere9484@gmail.com",
      },
      to: complaint.userId.email,
      subject: "Complaint Update of POSH",
      html: `
            <div>
              <h2>Complaint Registered</h2>
              <h3>Complaint Acknowledgment ID: ${complaint.acknowledgementId}</h3>
              <div>
                <h4>Complaint Status  Description : ${complaint.admin_role} ->  ${complaint.admin_description}</h4>
              </div>
            </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

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

import Complaints from "../models/complaints.model.js";
import User from "../models/user.model.js";

export const sendComplaint = async (req, res) => {
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
    img,
    video,
    section,
  } = req.body;

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
      section,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Posting Complaint Failed" });
    }

    await User.findByIdAndUpdate(
      req.user,
      { $push: { complaints: complaint._id } },
      { new: true }
    );

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
    const validStatuses = ["Pending", "Rejected", "Solved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid Status" });
    }

    const complaint = await Complaints.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // if (complaint.status === "Solved") {
    //   return res
    //     .status(400)
    //     .json({ message: "Complaint is already solved. Cannot update." });
    // }

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
    Hostel: {
      Warden: 0,
      AO: 3,
      DSW: 7,
      VC: 10,
    },
    Academics: {
      HOD: 0,
      VC: 5,
    },
  };

  const isRoleValid = Object.values(roleDaysMapping).some((mapping) =>
    Object.keys(mapping).includes(role)
  );

  if (!isRoleValid) {
    return res
      .status(403)
      .json({ message: "You are not allowed to see this data" });
  }

  try {
    let filters = [{ isCritical: true }];

    for (const [section, mapping] of Object.entries(roleDaysMapping)) {
      if (mapping[role] !== undefined) {
        const days = mapping[role];
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);

        filters.push({
          section,
          createdAt: { $gte: dateLimit },
        });
      }
    }

    const filter = { $or: filters };

    const complaints = await Complaints.find(filter)
      .populate("userId", "email username phno collegeId")
      .sort({ createdAt: -1 });

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

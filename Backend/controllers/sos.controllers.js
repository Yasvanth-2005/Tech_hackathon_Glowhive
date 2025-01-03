import Alert from "../models/alerts.model.js";
import SOS from "../models/sosMembers.model.js";
import User from "../models/user.model.js";

export const getAllSOSGlobal = async (req, res) => {
  try {
    const allsos = await SOS.find();

    if (!allsos) {
      return res.status(404).json({ message: "Suport Staff data Not Found" });
    }

    return res.status(200).json({ globalSOS: allsos });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserSOS = async (req, res) => {
  const user = req.user;

  try {
    // Fetch global SOS as plain objects
    const globalSOS = await SOS.find().lean();
    const globalData = globalSOS.map((sos) => ({
      ...sos,
      type: "global",
    }));

    console.log("Global SOS Data:", globalData);

    // Fetch user details
    const userDetails = await User.findById(user).lean();
    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    // Process user's SOS
    console.log(userDetails.sos);
    const userSOS = userDetails.sos || [];
    const userData = userSOS.map((sos) => ({
      ...sos,
      type: "user",
    }));

    // Combine global and user SOS
    const combinedSOS = [...globalData, ...userData];
    return res.status(200).json({ sos: combinedSOS });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const postSOSGlobal = async (req, res) => {
  const { phno, name, email } = req.body;

  try {
    const newGlobalSOS = await SOS.create({
      phno,
      name,
      email,
    });

    if (!newGlobalSOS) {
      return res.status(404).json({ message: "Failed to add a member" });
    }

    return res.status(201).json({
      globalSOS: newGlobalSOS,
      message: "New Global SOS Successfully",
    });
  } catch (error) {
    console.log(error.message);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateSOSGlobal = async (req, res) => {
  const { id } = req.params;
  const { phno, name, email } = req.body;

  try {
    const updatedGSOS = await SOS.findByIdAndUpdate(
      id,
      {
        phno,
        name,
        email,
      },
      { new: true }
    );

    if (!updatedGSOS) {
      return res.status(404).json({ message: "Global SOS Data not found" });
    }

    return res.status(200).json({
      supportStaff: updatedGSOS,
      message: "supportStaff Updated Successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteSOSGlobal = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSOS = await SOS.findByIdAndDelete(id);

    if (!deletedSOS) {
      return res.status(404).json({ message: "Data on SOSGlobal not found" });
    }

    return res.status(200).json({
      message: "Data in Global SOS Deleted Successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAlerts = async () => {
  try {
    const alerts = await Alert.find();

    if (!alerts) {
      return res.status(404).json({ message: "Alerts data Not Found" });
    }

    return res.status(200).json({ alerts });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAlerts = async () => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedAlert = await Alert.findByIdAndUpdate(id, {
      status,
    });

    if (!deletedSOS) {
      return res.status(404).json({ message: "Updated Data not found" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

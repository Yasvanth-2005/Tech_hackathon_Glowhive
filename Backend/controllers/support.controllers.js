import Support from "../models/support.model.js";

export const getAllSupportMem = async (req, res) => {
  try {
    const allsupport = await Support.find();

    if (!allsupport) {
      return res.status(404).json({ message: "Suport Staff data Not Found" });
    }

    return res.status(200).json({ supportStaff: allsupport });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const postSupportMem = async (req, res) => {
  const { name, phno, position, password } = req.body;

  try {
    const newSupportStaff = await Support.create({
      name,
      phno,
      position,
      password,
    });

    if (!newSupportStaff) {
      return res.status(404).json({ message: "Failed to add a member" });
    }

    return res.status(201).json({
      supportStaff: newSupportStaff,
      message: "Support Staff Created Successfully",
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

export const updateSupportMem = async (req, res) => {
  const { id } = req.params;
  const { name, phno, position, password } = req.body;

  try {
    const updatedSStaff = await Support.findByIdAndUpdate(
      id,
      {
        name,
        phno,
        position,
        password,
      },
      { new: true }
    );

    if (!updatedSStaff) {
      return res.status(404).json({ message: "Support Staff Data not found" });
    }

    return res.status(200).json({
      supportStaff: updatedSStaff,
      message: "supportStaff Updated Successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteSupportmen = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNotification = await Support.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: "Data on Supportmem not found" });
    }

    return res.status(200).json({
      message: "Data in Support membership Deleted Successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

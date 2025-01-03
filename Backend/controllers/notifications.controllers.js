import Notifications from "../models/notifications.model.js";
import axios from "axios";

export const getAllNotifications = async (req, res) => {
  try {
    const allNotifications = await Notifications.find().populate(
      "sender",
      "username role"
    );

    if (!allNotifications) {
      return res.status(404).json({ message: "Notifications Not Found" });
    }

    return res.status(200).json({ notifications: allNotifications });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const postNotification = async (req, res) => {
  const { title, description, links, sender } = req.body;

  try {
    const newNotification = await Notifications.create({
      title,
      description,
      links,
      sender,
    });

    if (!newNotification) {
      return res.status(404).json({ message: "Failed to create notification" });
    }

    const populatedNotification = await newNotification.populate(
      "sender",
      "username role"
    );

    // OneSignal API call
    // const oneSignalResponse = await axios.post(
    //  "https://onesignal.com/api/v1/notifications",
    //  {
    //    app_id: process.env.ONESIGNAL_APP_ID,
    //    included_segments: ["Subscribed Users"],
    //    headings: { en: title },
    //    contents: { en: description },
    //    data: { links },
    //  },
    //  {
    //    headers: {
    //       "Content-Type": "application/json",
    //      Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
    //    },
    //  }
    //);

    // console.log("OneSignal response:", oneSignalResponse.data);

    return res.status(201).json({
      notification: populatedNotification,
      message: "Notification Sent Successfully",
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

export const updateNotification = async (req, res) => {
  const { id } = req.params;
  const { title, description, links, sender } = req.body;

  try {
    const updatedNotification = await Notifications.findByIdAndUpdate(
      id,
      {
        title,
        description,
        links,
        sender,
      },
      { new: true }
    ).populate("sender", "username role");

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({
      notification: updatedNotification,
      message: "Notification Updated Successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNotification = await Notifications.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notifications not found" });
    }

    return res.status(200).json({
      message: "Notification Deleted Successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

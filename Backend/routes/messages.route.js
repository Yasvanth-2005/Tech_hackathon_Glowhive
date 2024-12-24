import express from "express";
import Message from "../models/message.model.js";

const router = express.Router();

router.get("/history/:userId/:supportId", async (req, res) => {
  const { userId, supportId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: supportId },
        { sender: supportId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/send", async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

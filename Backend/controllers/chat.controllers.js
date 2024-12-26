import Message from "../models/message.model.js";

export const fetchHistory = async (req, res) => {
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
};

export const sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    if (!senderId || !receiverId || !message) {
      return res.status(200).json({ message: "Invalid Message" });
    }
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
};

export const fetchChats = async (req, res) => {
  const faculty = req.faculty;

  try {
    const usersWithLastMessage = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: faculty }, { receiver: faculty }],
        },
      },
    ]);

    res.status(200).json(usersWithLastMessage);
  } catch (err) {
    console.error("Error fetching users and their last messages:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

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

  if (!faculty) {
    return res.status(400).json({ error: "Faculty ID is required" });
  }

  try {
    console.log("Faculty ID:", faculty);

    const chats = await Message.find({
      $or: [{ sender: faculty }, { receiver: faculty }],
    });

    console.log(chats);

    const groupedChats = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: faculty }, { receiver: faculty }],
        },
      },
      {
        $addFields: {
          otherUser: {
            $cond: [{ $eq: ["$sender", faculty] }, "$receiver", "$sender"],
          },
        },
      },
      {
        $group: {
          _id: "$otherUser",
          chats: {
            $push: {
              message: "$message",
              createdAt: "$createdAt",
              sender: "$sender",
              receiver: "$receiver",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          _id: 0,
          otherUser: "$_id",
          chats: 1,
          userDetails: { username: 1, role: 1 },
        },
      },
    ]);

    if (groupedChats.length === 0) {
      return res
        .status(404)
        .json({ message: "No chats found for the faculty" });
    }

    // Transform the grouped result into the desired format
    const chatsByUser = groupedChats.reduce((acc, chatGroup) => {
      acc[chatGroup.otherUser] = {
        chats: chatGroup.chats,
        userDetails: chatGroup.userDetails[0] || null,
      };
      return acc;
    }, {});

    res.status(200).json({ chats: chatsByUser });
  } catch (err) {
    console.error("Error fetching grouped chats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

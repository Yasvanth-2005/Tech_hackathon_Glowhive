import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import complaintsRoutes from "./routes/complaints.route.js";
import notificationRoutes from "./routes/notifications.route.js";
import supportRoutes from "./routes/support.route.js";
import sosRoutes from "./routes/sos.route.js";
import messageRoutes from "./routes/messages.route.js";

// Middleware
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
app.use(morgan("combined"));

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", process.env.BACKEND_URL],
      },
    },
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );
  next();
});

app.use(cors());

// Environment Validation
const requiredEnvVars = ["MONGODB_URI"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Environment variable ${key} is missing!`);
    process.exit(1);
  }
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected Successfully!");
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server running on port ${process.env.PORT || 8080} 🔥`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });

// socketIo connections
import { Server as SocketIo } from "socket.io";
import http from "http";
import Message from "./models/message.model.js";

const server = http.createServer(app);
const io = new SocketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected : ", socket.id);

  socket.on("connect", (userId) => {
    console.log(`${userId} joined the room`);
    socket.join(userId);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    try {
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        message,
      });

      io.to(receiverId).emit("recieveMessage", newMessage);
    } catch (error) {
      console.error("Error Saving Message", error);
    }
  });

  socket.on("disconnect", (userId) => {
    console.log(`${userId} disconnected`);
  });
});

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/chat", messageRoutes);

// 404 Error Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

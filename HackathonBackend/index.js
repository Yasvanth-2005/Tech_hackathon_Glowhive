import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import complaintsRoutes from "./routes/complaints.route.js";
import notificationRoutes from "./routes/notifications.route.js";
import supportRoutes from "./routes/support.route.js";

// Middleware
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"], // Default to your own domain
        scriptSrc: ["'self'"], // Allow external scripts
        // styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles if necessary
        imgSrc: ["'self'", "data:"], // Allow data URIs for images
        connectSrc: ["'self'", process.env.BACKEND_URL], // Allow connections to APIs
      },
    },
  })
);

app.use(cors());

/* DATABSE CONNECTION */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server running on port ${process.env.PORT} 🔥`);
      console.log("Database Connected Successfully ");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/support", supportRoutes);

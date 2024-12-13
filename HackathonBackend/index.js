import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";

// Middleware
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));

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

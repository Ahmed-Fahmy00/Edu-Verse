const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

// Mount all main API routes
const userRoutes = require("./src/routes/users");
const courseRoutes = require("./src/routes/courses");
const postRoutes = require("./src/routes/posts");
const commentRoutes = require("./src/routes/comments");
const reactionRoutes = require("./src/routes/reactions");
const chatRoutes = require("./src/routes/chats");
const messageRoutes = require("./src/routes/messages");
const fileRoutes = require("./src/routes/files");

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/files", fileRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 8000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

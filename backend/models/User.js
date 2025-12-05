const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  level: String,
  image: String,
  profilePicture: String,
  bio: String,
  courses: [String],
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student",
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);

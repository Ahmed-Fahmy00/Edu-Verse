const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  level: String,
  image: String,
  courses: [String],
  role: { type: String, enum: ["student", "instructor", "admin"] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);

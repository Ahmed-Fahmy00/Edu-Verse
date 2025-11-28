const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  _id: String, // code for course ID
  name: String,
  creditHours: Number,
  description: String,
  instructorId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Course", courseSchema);

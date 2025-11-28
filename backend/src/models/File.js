const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: String,
  fileType: { type: String, enum: ["image", "pdf", "word"] },
  fileData: Buffer,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);

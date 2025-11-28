const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  sender: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    image: Buffer,
  },
  courseId: String,
  title: String,
  body: String,
  attachmentsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  type: { type: String, enum: ["question", "announcement", "discussion"] },
  answered: Boolean,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);

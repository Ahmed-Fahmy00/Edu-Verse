const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user1: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    image: Buffer,
  },
  user2: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    image: Buffer,
  },
  lastMessage: String,
});

module.exports = mongoose.model("Chat", chatSchema);

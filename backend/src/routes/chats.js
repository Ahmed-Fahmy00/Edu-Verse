const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

// Create a new chat
router.post("/", async (req, res) => {
  try {
    const chat = new Chat(req.body);
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all chats for a user
router.get("/user/:userId", async (req, res) => {
  const chats = await Chat.find({
    $or: [{ "user1.id": req.params.userId }, { "user2.id": req.params.userId }],
  });
  res.json(chats);
});

module.exports = router;

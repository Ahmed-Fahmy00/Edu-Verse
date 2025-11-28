const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Send a message
router.post("/", async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all messages between two users
router.get("/between/:user1/:user2", async (req, res) => {
  const messages = await Message.find({
    $or: [
      { senderId: req.params.user1, receiverId: req.params.user2 },
      { senderId: req.params.user2, receiverId: req.params.user1 },
    ],
  });
  res.json(messages);
});

module.exports = router;

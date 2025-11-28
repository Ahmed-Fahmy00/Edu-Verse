const express = require("express");
const router = express.Router();
const Reaction = require("../models/Reaction");

// Add a reaction
router.post("/", async (req, res) => {
  try {
    const reaction = new Reaction(req.body);
    await reaction.save();
    res.status(201).json(reaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get reactions for a post
router.get("/post/:postId", async (req, res) => {
  const reactions = await Reaction.find({ postId: req.params.postId });
  res.json(reactions);
});

module.exports = router;

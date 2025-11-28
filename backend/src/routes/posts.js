const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Create a new post
router.post("/", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all posts or filter by userId
router.get("/", async (req, res) => {
  const { userId } = req.query;
  let filter = {};
  if (userId) {
    filter["sender.id"] = userId;
  }
  const posts = await Post.find(filter);
  res.json(posts);
});

// Get post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

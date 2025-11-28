const express = require("express");
const router = express.Router();
const File = require("../models/File");

// Upload a file
router.post("/", async (req, res) => {
  try {
    const file = new File(req.body);
    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get file by ID
router.get("/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });
    res.json(file);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

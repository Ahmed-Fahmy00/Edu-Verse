const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} = require("../services/auth");
const {
  getUserProfile,
  updateUserProfile,
  getUserPosts,
  getUserCourses,
  searchUsers,
  getUserStats,
} = require("../services/user");
const { auth } = require("../middleware/auth");

// Authentication routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getCurrentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// User profile routes
router.get("/search", auth, searchUsers);
router.put("/profile", auth, async (req, res) => {
  // Update current user's profile
  req.params.id = req.userId;
  return updateUserProfile(req, res);
});
// Specific routes must come before parameterized routes
router.get("/:id/stats", getUserStats);
router.get("/:id/posts", getUserPosts);
router.get("/:id/courses", getUserCourses);
router.get("/:id", getUserProfile);
router.put("/:id", auth, updateUserProfile);

module.exports = router;

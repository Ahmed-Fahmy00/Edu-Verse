// routes/post.js
import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Community from "../models/Community.js";
import PostVote from "../models/PostVote.js";
import upload from "../middleware/upload.js";
import { deleteImage, uploadToCloudinary } from "../utils/cloudinary.js";
import { VOTE_TYPES, VOTE_VALUES } from "../utils/constants.js";

const router = express.Router();

// POST /api/posts
router.post("/create", upload.single("image"), async (req, res) => {
  let uploadedImage = null;
  const { authorId, title, content, postCreatorType, communityId } = req.body;

  if (!authorId)
    return res.status(400).json({ error: "Author ID is required" });
  if (!title) return res.status(400).json({ error: "Title is required" });
  if (!postCreatorType)
    return res.status(400).json({ error: "Post creator type is required" });
  if (!communityId)
    return res.status(400).json({ error: "Community ID is required" });

  // Validate author exists
  const author = await User.findById(authorId);
  if (!author) return res.status(404).json({ error: "Author not found" });

  // Validate community exists
  const community = await Community.findById(communityId);
  if (!community) return res.status(404).json({ error: "Community not found" });

  // Upload to Cloudinary only after validation passes
  if (req.file) {
    uploadedImage = await uploadToCloudinary(
      req.file.buffer,
      "reddit_clone/posts"
    );
  }

  const newPost = new Post({
    authorId,
    title,
    body: {
      content: content,
      mediaUrl: uploadedImage?.secure_url ? [uploadedImage.secure_url] : [],
    },
    postCreatorType,
    community: {
      id: community._id,
      name: community.name,
      imageUrl: community.iconUrl,
    },
    author: {
      name: author.username,
      imageUrl: author.avatarUrl,
    },
  });

  await newPost.save();
  res.status(201).json(newPost);
});

// GET /api/posts - Get all posts sorted by newest to oldest
router.get("/", async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 }) // Newest first
    .limit(100); // Limit to prevent overwhelming response

  res.status(200).json(posts);
});

router.post("/vote", async (req, res) => {
  const { userId, postId, voteType } = req.body;

  if (!Object.values(VOTE_TYPES).includes(voteType)) {
    return res.status(400).json({ error: "Invalid vote type" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const userPostVote = await PostVote.findOne({ userId, postId });
  if (userPostVote) {
    if (
      userPostVote.value === VOTE_VALUES[VOTE_TYPES.UPVOTE] &&
      voteType === VOTE_TYPES.UPVOTE
    )
      return res.status(200).json({ message: "No change", post });
    if (
      userPostVote.value === VOTE_VALUES[VOTE_TYPES.DOWNVOTE] &&
      voteType === VOTE_TYPES.DOWNVOTE
    )
      return res.status(200).json({ message: "No change", post });
    if (
      userPostVote.value === VOTE_VALUES[VOTE_TYPES.NEUTRAL] &&
      voteType === VOTE_TYPES.NEUTRAL
    )
      return res.status(200).json({ message: "No change", post });

    if (
      voteType === VOTE_TYPES.UPVOTE &&
      userPostVote.value !== VOTE_VALUES[VOTE_TYPES.UPVOTE]
    ) {
      if (userPostVote.value === VOTE_VALUES[VOTE_TYPES.DOWNVOTE])
        post.counts.downvotes -= 1;
      if (userPostVote.value !== VOTE_VALUES[VOTE_TYPES.UPVOTE])
        post.counts.upvotes += 1;
      userPostVote.value = VOTE_VALUES[VOTE_TYPES.UPVOTE];
    } else if (
      voteType === VOTE_TYPES.DOWNVOTE &&
      userPostVote.value !== VOTE_VALUES[VOTE_TYPES.DOWNVOTE]
    ) {
      if (userPostVote.value === VOTE_VALUES[VOTE_TYPES.UPVOTE])
        post.counts.upvotes -= 1;
      if (userPostVote.value !== VOTE_VALUES[VOTE_TYPES.DOWNVOTE])
        post.counts.downvotes += 1;
      userPostVote.value = VOTE_VALUES[VOTE_TYPES.DOWNVOTE];
    } else if (voteType === VOTE_TYPES.NEUTRAL) {
      if (userPostVote.value === VOTE_VALUES[VOTE_TYPES.UPVOTE])
        post.counts.upvotes -= 1;
      if (userPostVote.value === VOTE_VALUES[VOTE_TYPES.DOWNVOTE])
        post.counts.downvotes -= 1;
      userPostVote.value = VOTE_VALUES[VOTE_TYPES.NEUTRAL];
    }
    await userPostVote.save();
  } else {
    const newVote = new PostVote({
      userId,
      postId,
      value: VOTE_VALUES[voteType],
    });
    await newVote.save();

    if (voteType === VOTE_TYPES.UPVOTE) {
      post.counts.upvotes += 1;
    } else if (voteType === VOTE_TYPES.DOWNVOTE) {
      post.counts.downvotes += 1;
    }
  }

  await post.save();
  res.status(200).json({ message: "Vote recorded", post });
});

router.get("/vote/user/:userId/post/:postId", async (req, res) => {
  const { userId, postId } = req.params;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const voteRecord = await PostVote.findOne({ userId, postId });
  if (!voteRecord) return res.status(200).json({ hasVoted: false, value: 0 });

  res.status(200).json({ hasVoted: true, value: voteRecord.value });
});

export default router;

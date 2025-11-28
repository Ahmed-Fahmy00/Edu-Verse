// backend/src/utils/seed.js
// Script to seed all collections with 10 test records each

const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Reaction = require("../models/Reaction");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const File = require("../models/File");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/eduverse";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Clear all collections
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({}),
    Reaction.deleteMany({}),
    Message.deleteMany({}),
    Chat.deleteMany({}),
    File.deleteMany({}),
  ]);

  // Users
  const users = [];
  for (let i = 0; i < 10; i++) {
    users.push({
      name: `User${i}`,
      email: `user${i}@test.com`,
      password: "password",
      level: "level" + (i % 4),
      image: "",
      courses: [],
      role: i === 0 ? "admin" : i % 2 === 0 ? "student" : "instructor",
    });
  }
  const userDocs = await User.insertMany(users);

  // Courses
  const courses = [];
  for (let i = 0; i < 10; i++) {
    courses.push({
      _id: `CSE${100 + i}`,
      name: `Course ${i}`,
      creditHours: 3,
      description: `Description for course ${i}`,
      instructorId: [userDocs[i % userDocs.length]._id],
    });
  }
  const courseDocs = await Course.insertMany(courses);

  // Posts
  const posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      sender: {
        id: userDocs[i % userDocs.length]._id,
        name: userDocs[i % userDocs.length].name,
        image: "",
      },
      courseId: courseDocs[i % courseDocs.length]._id,
      title: `Post Title ${i}`,
      body: `This is the body of post ${i}`,
      attachmentsId: [],
      type: ["question", "announcement", "discussion"][i % 3],
      answered: i % 2 === 0,
    });
  }
  const postDocs = await Post.insertMany(posts);

  // Comments
  const comments = [];
  for (let i = 0; i < 10; i++) {
    comments.push({
      postId: postDocs[i % postDocs.length]._id,
      sender: {
        id: userDocs[i % userDocs.length]._id,
        name: userDocs[i % userDocs.length].name,
        image: "",
      },
      body: `Comment body ${i}`,
    });
  }
  await Comment.insertMany(comments);

  // Reactions
  const reactions = [];
  const reactionTypes = ["like", "love", "shocked", "laugh", "sad"];
  for (let i = 0; i < 10; i++) {
    reactions.push({
      postId: postDocs[i % postDocs.length]._id,
      senderId: userDocs[i % userDocs.length]._id,
      type: reactionTypes[i % reactionTypes.length],
    });
  }
  await Reaction.insertMany(reactions);

  // Files
  const files = [];
  for (let i = 0; i < 10; i++) {
    files.push({
      fileName: `file${i}.pdf`,
      fileType: "pdf",
      fileData: Buffer.from("Test file data"),
      postId: postDocs[i % postDocs.length]._id,
      messageId: null,
    });
  }
  const fileDocs = await File.insertMany(files);

  // Messages
  const messages = [];
  for (let i = 0; i < 10; i++) {
    messages.push({
      senderId: userDocs[i % userDocs.length]._id,
      receiverId: userDocs[(i + 1) % userDocs.length]._id,
      text: `Message text ${i}`,
      attachmentsId: [fileDocs[i % fileDocs.length]._id],
    });
  }
  const messageDocs = await Message.insertMany(messages);

  // Chats
  const chats = [];
  for (let i = 0; i < 10; i++) {
    chats.push({
      user1: {
        id: userDocs[i % userDocs.length]._id,
        name: userDocs[i % userDocs.length].name,
        image: "",
      },
      user2: {
        id: userDocs[(i + 1) % userDocs.length]._id,
        name: userDocs[(i + 1) % userDocs.length].name,
        image: "",
      },
      lastMessage: `Last message ${i}`,
    });
  }
  await Chat.insertMany(chats);

  console.log("Seeding complete!");
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});

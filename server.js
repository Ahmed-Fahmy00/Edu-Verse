const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Increase payload size limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/educonnect';

// Middleware
app.use(cors());
app.use(express.static('public'));

// MongoDB connection
let db;
MongoClient.connect(MONGODB_URI)
  .then(client => {
    db = client.db();
    console.log('✓ Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// ============================================
// API ROUTES
// ============================================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In production, use bcrypt to compare hashed passwords
    // For now, simple comparison
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role, level } = req.body;
    
    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const user = {
      name,
      email,
      password, // In production, hash with bcrypt
      level: level || 'Freshman',
      image: `profile_${name.split(' ')[0].toLowerCase()}.jpg`,
      courses: [],
      role: role || 'student',
      createdAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(user);
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: { ...userWithoutPassword, _id: result.insertedId } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const { enrolled } = req.query;
    let query = {};
    
    if (enrolled) {
      // Get courses user is enrolled in
      const user = await db.collection('users').findOne({ _id: new ObjectId(enrolled) });
      if (user) {
        query = { _id: { $in: user.courses } };
      }
    }
    
    const courses = await db.collection('courses').find(query).toArray();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enroll in a course
app.post('/api/courses/:courseId/enroll', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;
    
    const course = await db.collection('courses').findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ error: 'Course is full' });
    }
    
    // Add course to user's courses
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { courses: courseId } }
    );
    
    // Increment enrolled count
    await db.collection('courses').updateOne(
      { _id: courseId },
      { $inc: { enrolled: 1 } }
    );
    
    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unenroll from a course
app.post('/api/courses/:courseId/unenroll', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { courses: courseId } }
    );
    
    await db.collection('courses').updateOne(
      { _id: courseId },
      { $inc: { enrolled: -1 } }
    );
    
    res.json({ message: 'Unenrolled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get course by ID with instructor info
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await db.collection('courses').findOne({ _id: req.params.id });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    
    const instructors = await db.collection('users')
      .find({ _id: { $in: course.instructorId } })
      .project({ name: 1, email: 1, image: 1 })
      .toArray();
    
    res.json({ ...course, instructors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get posts for a course
app.get('/api/courses/:courseId/posts', async (req, res) => {
  try {
    const posts = await db.collection('posts')
      .find({ courseId: req.params.courseId })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post
app.post('/api/posts', async (req, res) => {
  try {
    const { senderId, courseId, title, body, type, image } = req.body;
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(senderId) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const post = {
      sender: {
        id: user._id,
        name: user.name,
        image: user.image
      },
      courseId,
      title,
      body,
      attachmentsId: [],
      type,
      answered: false,
      image: image || null, // Store image data
      createdAt: new Date()
    };
    
    const result = await db.collection('posts').insertOne(post);
    res.status(201).json({ ...post, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get comments for a post
app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await db.collection('comments')
      .find({ postId: new ObjectId(req.params.postId) })
      .sort({ createdAt: 1 })
      .toArray();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a comment to a post
app.post('/api/comments', async (req, res) => {
  try {
    const { postId, senderId, body } = req.body;
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(senderId) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const comment = {
      postId: new ObjectId(postId),
      sender: {
        id: user._id,
        name: user.name,
        image: user.image
      },
      body,
      createdAt: new Date()
    };
    
    const result = await db.collection('comments').insertOne(comment);
    res.status(201).json({ ...comment, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reactions for a post
app.get('/api/posts/:postId/reactions', async (req, res) => {
  try {
    const reactions = await db.collection('reactions')
      .find({ postId: new ObjectId(req.params.postId) })
      .toArray();
    
    const summary = reactions.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {});
    
    res.json({ reactions, summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a reaction to a post
app.post('/api/reactions', async (req, res) => {
  try {
    const { postId, senderId, type } = req.body;
    
    // Check if user already reacted
    const existing = await db.collection('reactions').findOne({
      postId: new ObjectId(postId),
      senderId: new ObjectId(senderId)
    });
    
    if (existing) {
      // Update reaction type
      await db.collection('reactions').updateOne(
        { _id: existing._id },
        { $set: { type, createdAt: new Date() } }
      );
      res.json({ message: 'Reaction updated' });
    } else {
      // Create new reaction
      const reaction = {
        postId: new ObjectId(postId),
        senderId: new ObjectId(senderId),
        type,
        createdAt: new Date()
      };
      const result = await db.collection('reactions').insertOne(reaction);
      res.status(201).json({ ...reaction, _id: result.insertedId });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's chats
app.get('/api/users/:userId/chats', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userObjectId = new ObjectId(userId);
    
    // Find chats where user is either user1 or user2
    const chats = await db.collection('chats')
      .find({
        $or: [
          { 'user1.id': userId },
          { 'user1.id': userObjectId },
          { 'user2.id': userId },
          { 'user2.id': userObjectId }
        ]
      })
      .toArray();
    
    // Filter to only return chats involving this specific user
    const filteredChats = chats.filter(chat => {
      const user1Id = chat.user1.id.toString ? chat.user1.id.toString() : chat.user1.id;
      const user2Id = chat.user2.id.toString ? chat.user2.id.toString() : chat.user2.id;
      return user1Id === userId || user2Id === userId;
    });
    
    res.json(filteredChats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages between two users
app.get('/api/messages/:user1Id/:user2Id', async (req, res) => {
  try {
    const user1Id = new ObjectId(req.params.user1Id);
    const user2Id = new ObjectId(req.params.user2Id);
    
    const messages = await db.collection('messages')
      .find({
        $or: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id }
        ]
      })
      .sort({ createdAt: 1 })
      .toArray();
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message
app.post('/api/messages', async (req, res) => {
  try {
    const { senderId, receiverId, text, attachment, replyTo } = req.body;
    
    const message = {
      senderId: new ObjectId(senderId),
      receiverId: new ObjectId(receiverId),
      text,
      attachment: attachment || null,
      replyTo: replyTo || null,
      attachmentsId: [],
      createdAt: new Date()
    };
    
    const result = await db.collection('messages').insertOne(message);
    
    // Get user details
    const [sender, receiver] = await Promise.all([
      db.collection('users').findOne({ _id: new ObjectId(senderId) }),
      db.collection('users').findOne({ _id: new ObjectId(receiverId) })
    ]);
    
    // Update or create chat
    const existingChat = await db.collection('chats').findOne({
      $or: [
        { 'user1.id': new ObjectId(senderId), 'user2.id': new ObjectId(receiverId) },
        { 'user1.id': new ObjectId(receiverId), 'user2.id': new ObjectId(senderId) }
      ]
    });
    
    if (existingChat) {
      await db.collection('chats').updateOne(
        { _id: existingChat._id },
        { $set: { lastMessage: text } }
      );
    } else {
      // Create new chat
      await db.collection('chats').insertOne({
        user1: {
          id: new ObjectId(senderId),
          name: sender.name,
          image: sender.image
        },
        user2: {
          id: new ObjectId(receiverId),
          name: receiver.name,
          image: receiver.image
        },
        lastMessage: text
      });
    }
    
    res.status(201).json({ ...message, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a message
app.delete('/api/messages/:messageId', async (req, res) => {
  try {
    const messageId = new ObjectId(req.params.messageId);
    const { userId } = req.body;
    
    // Verify the message belongs to the user
    const message = await db.collection('messages').findOne({ _id: messageId });
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Only allow sender to delete their own messages
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }
    
    await db.collection('messages').deleteOne({ _id: messageId });
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get users (for search/chat)
app.get('/api/users', async (req, res) => {
  try {
    const { role, search } = req.query;
    const query = {};
    
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await db.collection('users')
      .find(query)
      .project({ password: 0 })
      .toArray();
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new course (Instructor only)
app.post('/api/courses', async (req, res) => {
  try {
    const { userId, courseId, name, creditHours, description, capacity } = req.body;
    
    // Check if user is instructor
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user || user.role !== 'instructor') {
      return res.status(403).json({ error: 'Only instructors can create courses' });
    }
    
    // Check if course ID already exists
    const existing = await db.collection('courses').findOne({ _id: courseId });
    if (existing) {
      return res.status(400).json({ error: 'Course code already exists' });
    }
    
    const course = {
      _id: courseId,
      name,
      creditHours: parseInt(creditHours),
      description,
      instructorId: [new ObjectId(userId)],
      enrolled: 0,
      capacity: parseInt(capacity)
    };
    
    await db.collection('courses').insertOne(course);
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.collection('users')
      .findOne({ _id: new ObjectId(req.params.id) }, { projection: { password: 0 } });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload file to course
app.post('/api/courses/:courseId/files', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId, fileName, fileData, fileType } = req.body;
    
    // Check if user is TA or instructor
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user || (user.role !== 'ta' && user.role !== 'instructor')) {
      return res.status(403).json({ error: 'Only TAs and instructors can upload files' });
    }
    
    const file = {
      fileName,
      fileType,
      fileData, // Base64 encoded file data
      courseId,
      uploadedBy: {
        id: new ObjectId(userId),
        name: user.name,
        role: user.role
      },
      createdAt: new Date()
    };
    
    const result = await db.collection('files').insertOne(file);
    res.status(201).json({ ...file, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get files for a course
app.get('/api/courses/:courseId/files', async (req, res) => {
  try {
    const { courseId } = req.params;
    const files = await db.collection('files')
      .find({ courseId })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user activity stats
app.get('/api/users/:id/stats', async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    
    // Count posts by user
    const postsCount = await db.collection('posts').countDocuments({
      'sender.id': userId
    });
    
    // Count comments by user
    const commentsCount = await db.collection('comments').countDocuments({
      'sender.id': userId
    });
    
    // Count reactions by user
    const reactionsCount = await db.collection('reactions').countDocuments({
      senderId: userId
    });
    
    res.json({
      posts: postsCount,
      comments: commentsCount,
      reactions: reactionsCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a post (only by the post creator)
app.delete('/api/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    
    console.log('Delete request - postId:', postId, 'userId:', userId);
    
    // Find post - try both ObjectId and string
    let post = await db.collection('posts').findOne({ 
      $or: [
        { _id: postId },
        { _id: ObjectId.isValid(postId) ? new ObjectId(postId) : null }
      ]
    });
    
    console.log('Post found:', post ? 'yes' : 'no');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user is the post creator
    const postSenderId = post.sender.id.toString ? post.sender.id.toString() : post.sender.id;
    console.log('Post sender:', postSenderId, 'Current user:', userId);
    
    if (postSenderId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }
    
    // Delete the post
    await db.collection('posts').deleteOne({ _id: post._id });
    
    // Delete associated comments
    await db.collection('comments').deleteMany({ postId: post._id });
    
    // Delete associated reactions
    await db.collection('reactions').deleteMany({ postId: post._id });
    
    console.log('Post deleted successfully');
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ EduVerse server running on http://localhost:${PORT}`);
});

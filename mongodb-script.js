// ============================================
// EduConnect - Educational Platform MongoDB Script
// ============================================

// Switch to the EduConnect database
use('educonnect');

// ============================================
// 1. DROP EXISTING COLLECTIONS (for clean setup)
// ============================================
db.users.drop();
db.courses.drop();
db.posts.drop();
db.comments.drop();
db.reactions.drop();
db.chats.drop();
db.messages.drop();
db.files.drop();

// ============================================
// 2. SCHEMA VALIDATION
// ============================================

// Create users collection with schema validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password", "role", "createdAt"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "must be a valid email and is required"
        },
        password: {
          bsonType: "string",
          minLength: 6,
          description: "must be a string with minimum 6 characters"
        },
        level: {
          bsonType: "string",
          description: "student level or instructor title"
        },
        image: {
          bsonType: "string",
          description: "profile image URL"
        },
        courses: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "array of course IDs"
        },
        role: {
          enum: ["student", "instructor", "admin"],
          description: "must be student, instructor, or admin"
        },
        createdAt: {
          bsonType: "date",
          description: "account creation date"
        }
      }
    }
  }
});

// Create posts collection with schema validation
db.createCollection("posts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sender", "courseId", "title", "body", "type", "createdAt"],
      properties: {
        sender: {
          bsonType: "object",
          required: ["id", "name"],
          properties: {
            id: { bsonType: "objectId" },
            name: { bsonType: "string" },
            image: { bsonType: ["string", "null"] }
          }
        },
        courseId: {
          bsonType: "string"
        },
        title: {
          bsonType: "string",
          minLength: 1
        },
        body: {
          bsonType: "string"
        },
        type: {
          enum: ["question", "announcement", "discussion"]
        },
        answered: {
          bsonType: "bool"
        },
        createdAt: {
          bsonType: "date"
        }
      }
    }
  }
});

// ============================================
// 3. CREATE INDEXES
// ============================================

// Index for user email lookup (unique)
db.users.createIndex({ email: 1 }, { unique: true });

// Index for user role filtering
db.users.createIndex({ role: 1 });

// Index for course lookup
db.courses.createIndex({ _id: 1 });

// Index for posts by course
db.posts.createIndex({ courseId: 1, createdAt: -1 });

// Index for comments by post
db.comments.createIndex({ postId: 1, createdAt: -1 });

// Index for messages between users
db.messages.createIndex({ senderId: 1, receiverId: 1, createdAt: -1 });

// Index for reactions by post
db.reactions.createIndex({ postId: 1, type: 1 });

print("✓ Collections created with schema validation and indexes");

// ============================================
// 4. INSERT DATA - USERS
// ============================================

const users = [
  {
    _id: ObjectId("673a1111111111111111111a"),
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@educonnect.edu",
    password: "hashed_password_123",
    level: "PhD in Computer Science",
    image: "profile_sarah.jpg",
    courses: ["CS101", "CS301"],
    role: "instructor",
    createdAt: new Date("2024-01-15")
  },
  {
    _id: ObjectId("673a1111111111111111111b"),
    name: "Prof. Michael Chen",
    email: "michael.chen@educonnect.edu",
    password: "hashed_password_456",
    level: "Professor of Mathematics",
    image: "profile_michael.jpg",
    courses: ["MATH201"],
    role: "instructor",
    createdAt: new Date("2024-01-20")
  },
  {
    _id: ObjectId("673a1111111111111111111c"),
    name: "Emma Williams",
    email: "emma.williams@student.edu",
    password: "hashed_password_789",
    level: "Sophomore",
    image: "profile_emma.jpg",
    courses: ["CS101", "MATH201"],
    role: "student",
    createdAt: new Date("2024-02-01")
  },
  {
    _id: ObjectId("673a1111111111111111111d"),
    name: "James Rodriguez",
    email: "james.rodriguez@student.edu",
    password: "hashed_password_101",
    level: "Junior",
    image: "profile_james.jpg",
    courses: ["CS101", "CS301"],
    role: "student",
    createdAt: new Date("2024-02-05")
  },
  {
    _id: ObjectId("673a1111111111111111111e"),
    name: "Sophia Lee",
    email: "sophia.lee@student.edu",
    password: "hashed_password_102",
    level: "Freshman",
    image: "profile_sophia.jpg",
    courses: ["CS101"],
    role: "student",
    createdAt: new Date("2024-02-10")
  },
  {
    _id: ObjectId("673a1111111111111111111f"),
    name: "Admin User",
    email: "admin@educonnect.edu",
    password: "hashed_password_admin",
    level: "System Administrator",
    image: "profile_admin.jpg",
    courses: [],
    role: "admin",
    createdAt: new Date("2024-01-01")
  }
];

db.users.insertMany(users);
print("✓ Inserted 6 users");

// ============================================
// 5. INSERT DATA - COURSES
// ============================================

const courses = [
  {
    _id: "CS101",
    name: "Introduction to Programming",
    creditHours: 3,
    description: "Learn the fundamentals of programming using Python. Perfect for beginners.",
    instructorId: [ObjectId("673a1111111111111111111a")]
  },
  {
    _id: "CS301",
    name: "Data Structures and Algorithms",
    creditHours: 4,
    description: "Advanced course covering essential data structures and algorithmic techniques.",
    instructorId: [ObjectId("673a1111111111111111111a")]
  },
  {
    _id: "MATH201",
    name: "Calculus II",
    creditHours: 4,
    description: "Continuation of Calculus I, covering integration techniques and series.",
    instructorId: [ObjectId("673a1111111111111111111b")]
  }
];

db.courses.insertMany(courses);
print("✓ Inserted 3 courses");

// ============================================
// 6. INSERT DATA - POSTS
// ============================================

const posts = [
  {
    _id: ObjectId("673a2222222222222222222a"),
    sender: {
      id: ObjectId("673a1111111111111111111a"),
      name: "Dr. Sarah Johnson",
      image: "profile_sarah.jpg"
    },
    courseId: "CS101",
    title: "Welcome to Introduction to Programming!",
    body: "Hello everyone! Welcome to CS101. Please introduce yourselves and share what you hope to learn.",
    attachmentsId: [],
    type: "announcement",
    answered: false,
    createdAt: new Date("2024-09-01")
  },
  {
    _id: ObjectId("673a2222222222222222222b"),
    sender: {
      id: ObjectId("673a1111111111111111111c"),
      name: "Emma Williams",
      image: "profile_emma.jpg"
    },
    courseId: "CS101",
    title: "Question about loops",
    body: "Can someone explain the difference between while and for loops?",
    attachmentsId: [],
    type: "question",
    answered: true,
    createdAt: new Date("2024-09-15")
  },
  {
    _id: ObjectId("673a2222222222222222222c"),
    sender: {
      id: ObjectId("673a1111111111111111111d"),
      name: "James Rodriguez",
      image: "profile_james.jpg"
    },
    courseId: "CS301",
    title: "Binary Search Tree Implementation",
    body: "I'm working on the BST assignment. Anyone want to discuss approaches?",
    attachmentsId: [],
    type: "discussion",
    answered: false,
    createdAt: new Date("2024-10-01")
  },
  {
    _id: ObjectId("673a2222222222222222222d"),
    sender: {
      id: ObjectId("673a1111111111111111111b"),
      name: "Prof. Michael Chen",
      image: "profile_michael.jpg"
    },
    courseId: "MATH201",
    title: "Midterm Exam Schedule",
    body: "The midterm exam will be held on November 15th. Please review chapters 5-8.",
    attachmentsId: [],
    type: "announcement",
    answered: false,
    createdAt: new Date("2024-10-20")
  }
];

db.posts.insertMany(posts);
print("✓ Inserted 4 posts");

// ============================================
// 7. INSERT DATA - COMMENTS
// ============================================

const comments = [
  {
    _id: ObjectId("673a3333333333333333333a"),
    postId: ObjectId("673a2222222222222222222b"),
    sender: {
      id: ObjectId("673a1111111111111111111d"),
      name: "James Rodriguez",
      image: "profile_james.jpg"
    },
    body: "For loops are better when you know how many iterations you need. While loops are for when the condition is more dynamic.",
    createdAt: new Date("2024-09-15T10:30:00")
  },
  {
    _id: ObjectId("673a3333333333333333333b"),
    postId: ObjectId("673a2222222222222222222b"),
    sender: {
      id: ObjectId("673a1111111111111111111a"),
      name: "Dr. Sarah Johnson",
      image: "profile_sarah.jpg"
    },
    body: "Great question! James is correct. I'll post a detailed explanation in the course materials.",
    createdAt: new Date("2024-09-15T14:00:00")
  },
  {
    _id: ObjectId("673a3333333333333333333c"),
    postId: ObjectId("673a2222222222222222222c"),
    sender: {
      id: ObjectId("673a1111111111111111111e"),
      name: "Sophia Lee",
      image: "profile_sophia.jpg"
    },
    body: "I'd love to discuss! I'm thinking of using recursion for insertion.",
    createdAt: new Date("2024-10-01T16:20:00")
  }
];

db.comments.insertMany(comments);
print("✓ Inserted 3 comments");

// ============================================
// 8. INSERT DATA - REACTIONS
// ============================================

const reactions = [
  {
    _id: ObjectId("673a4444444444444444444a"),
    postId: ObjectId("673a2222222222222222222a"),
    senderId: ObjectId("673a1111111111111111111c"),
    type: "love",
    createdAt: new Date("2024-09-01T12:00:00")
  },
  {
    _id: ObjectId("673a4444444444444444444b"),
    postId: ObjectId("673a2222222222222222222a"),
    senderId: ObjectId("673a1111111111111111111d"),
    type: "like",
    createdAt: new Date("2024-09-01T13:00:00")
  },
  {
    _id: ObjectId("673a4444444444444444444c"),
    postId: ObjectId("673a2222222222222222222b"),
    senderId: ObjectId("673a1111111111111111111e"),
    type: "like",
    createdAt: new Date("2024-09-15T11:00:00")
  },
  {
    _id: ObjectId("673a4444444444444444444d"),
    postId: ObjectId("673a2222222222222222222d"),
    senderId: ObjectId("673a1111111111111111111c"),
    type: "shocked",
    createdAt: new Date("2024-10-20T15:00:00")
  }
];

db.reactions.insertMany(reactions);
print("✓ Inserted 4 reactions");

// ============================================
// 9. INSERT DATA - CHATS
// ============================================

const chats = [
  {
    _id: ObjectId("673a5555555555555555555a"),
    user1: {
      id: ObjectId("673a1111111111111111111c"),
      name: "Emma Williams",
      image: "profile_emma.jpg"
    },
    user2: {
      id: ObjectId("673a1111111111111111111d"),
      name: "James Rodriguez",
      image: "profile_james.jpg"
    },
    lastMessage: "Thanks for the help with the assignment!"
  },
  {
    _id: ObjectId("673a5555555555555555555b"),
    user1: {
      id: ObjectId("673a1111111111111111111c"),
      name: "Emma Williams",
      image: "profile_emma.jpg"
    },
    user2: {
      id: ObjectId("673a1111111111111111111a"),
      name: "Dr. Sarah Johnson",
      image: "profile_sarah.jpg"
    },
    lastMessage: "Could we schedule office hours?"
  }
];

db.chats.insertMany(chats);
print("✓ Inserted 2 chats");

// ============================================
// 10. INSERT DATA - MESSAGES
// ============================================

const messages = [
  {
    _id: ObjectId("673a6666666666666666666a"),
    senderId: ObjectId("673a1111111111111111111c"),
    receiverId: ObjectId("673a1111111111111111111d"),
    text: "Hey James, can you help me with the loop assignment?",
    attachmentsId: [],
    createdAt: new Date("2024-09-16T09:00:00")
  },
  {
    _id: ObjectId("673a6666666666666666666b"),
    senderId: ObjectId("673a1111111111111111111d"),
    receiverId: ObjectId("673a1111111111111111111c"),
    text: "Sure! What part are you stuck on?",
    attachmentsId: [],
    createdAt: new Date("2024-09-16T09:15:00")
  },
  {
    _id: ObjectId("673a6666666666666666666c"),
    senderId: ObjectId("673a1111111111111111111c"),
    receiverId: ObjectId("673a1111111111111111111d"),
    text: "Thanks for the help with the assignment!",
    attachmentsId: [],
    createdAt: new Date("2024-09-16T10:30:00")
  },
  {
    _id: ObjectId("673a6666666666666666666d"),
    senderId: ObjectId("673a1111111111111111111c"),
    receiverId: ObjectId("673a1111111111111111111a"),
    text: "Hello Dr. Johnson, could we schedule office hours?",
    attachmentsId: [],
    createdAt: new Date("2024-09-20T14:00:00")
  }
];

db.messages.insertMany(messages);
print("✓ Inserted 4 messages");

// ============================================
// 11. INSERT DATA - FILES
// ============================================

const files = [
  {
    _id: ObjectId("673a7777777777777777777a"),
    fileName: "syllabus_cs101.pdf",
    fileType: "pdf",
    fileData: "binary_data_placeholder",
    courseId: ObjectId("CS101"),
    postId: ObjectId("673a2222222222222222222a"),
    messageId: null,
    createdAt: new Date("2024-09-01")
  }
];

db.files.insertMany(files);
print("✓ Inserted 1 file");

print("\n============================================");
print("DATA INSERTION COMPLETE");
print("Total documents: 27");
print("============================================\n");

// ============================================
// 12. CRUD OPERATIONS - READ
// ============================================

print("============================================");
print("READ OPERATIONS");
print("============================================\n");

// Find all instructors
print("1. All Instructors:");
db.users.find({ role: "instructor" }, { name: 1, email: 1, courses: 1 }).forEach(printjson);

// Find posts in a specific course
print("\n2. Posts in CS101:");
db.posts.find({ courseId: "CS101" }, { title: 1, type: 1, sender: 1 }).forEach(printjson);

// Find unanswered questions
print("\n3. Unanswered Questions:");
db.posts.find({ type: "question", answered: false }, { title: 1, courseId: 1 }).forEach(printjson);

// ============================================
// 13. CRUD OPERATIONS - UPDATE
// ============================================

print("\n============================================");
print("UPDATE OPERATIONS");
print("============================================\n");

// Mark a question as answered
print("1. Marking question as answered:");
const updateResult1 = db.posts.updateOne(
  { _id: ObjectId("673a2222222222222222222b") },
  { $set: { answered: true } }
);
print(`Modified ${updateResult1.modifiedCount} document(s)`);

// Add a course to a student
print("\n2. Adding course to student:");
const updateResult2 = db.users.updateOne(
  { _id: ObjectId("673a1111111111111111111e") },
  { $push: { courses: "MATH201" } }
);
print(`Modified ${updateResult2.modifiedCount} document(s)`);

// Update course description
print("\n3. Updating course description:");
const updateResult3 = db.courses.updateOne(
  { _id: "CS101" },
  { $set: { description: "Learn programming fundamentals with Python. Includes hands-on projects." } }
);
print(`Modified ${updateResult3.modifiedCount} document(s)`);

// ============================================
// 14. CRUD OPERATIONS - DELETE
// ============================================

print("\n============================================");
print("DELETE OPERATIONS");
print("============================================\n");

// Insert a test post to delete
const testPost = {
  _id: ObjectId("673a9999999999999999999a"),
  sender: {
    id: ObjectId("673a1111111111111111111e"),
    name: "Sophia Lee",
    image: "profile_sophia.jpg"
  },
  courseId: "CS101",
  title: "Test Post - To Be Deleted",
  body: "This is a test post",
  attachmentsId: [],
  type: "discussion",
  answered: false,
  createdAt: new Date()
};
db.posts.insertOne(testPost);

print("1. Deleting test post:");
const deleteResult1 = db.posts.deleteOne({ _id: ObjectId("673a9999999999999999999a") });
print(`Deleted ${deleteResult1.deletedCount} document(s)`);

// Delete old reactions (example: older than a certain date)
print("\n2. Deleting reactions from before September 2024:");
const deleteResult2 = db.reactions.deleteMany({ createdAt: { $lt: new Date("2024-09-01") } });
print(`Deleted ${deleteResult2.deletedCount} document(s)`);

// ============================================
// 15. AGGREGATION PIPELINE 1: Course Engagement Report
// ============================================

print("\n============================================");
print("AGGREGATION 1: Course Engagement Report");
print("Shows post activity and engagement per course");
print("============================================\n");

db.posts.aggregate([
  {
    $group: {
      _id: "$courseId",
      totalPosts: { $sum: 1 },
      questions: {
        $sum: { $cond: [{ $eq: ["$type", "question"] }, 1, 0] }
      },
      announcements: {
        $sum: { $cond: [{ $eq: ["$type", "announcement"] }, 1, 0] }
      },
      discussions: {
        $sum: { $cond: [{ $eq: ["$type", "discussion"] }, 1, 0] }
      },
      answeredQuestions: {
        $sum: { $cond: [{ $and: [{ $eq: ["$type", "question"] }, { $eq: ["$answered", true] }] }, 1, 0] }
      }
    }
  },
  {
    $lookup: {
      from: "courses",
      localField: "_id",
      foreignField: "_id",
      as: "courseInfo"
    }
  },
  {
    $unwind: "$courseInfo"
  },
  {
    $project: {
      _id: 0,
      courseId: "$_id",
      courseName: "$courseInfo.name",
      totalPosts: 1,
      questions: 1,
      announcements: 1,
      discussions: 1,
      answeredQuestions: 1,
      answerRate: {
        $cond: [
          { $eq: ["$questions", 0] },
          "N/A",
          {
            $concat: [
              { $toString: { $round: [{ $multiply: [{ $divide: ["$answeredQuestions", "$questions"] }, 100] }, 0] } },
              "%"
            ]
          }
        ]
      }
    }
  },
  {
    $sort: { totalPosts: -1 }
  }
]).forEach(printjson);

// ============================================
// 16. AGGREGATION PIPELINE 2: Student Activity Report
// ============================================

print("\n============================================");
print("AGGREGATION 2: Student Activity Report");
print("Shows student engagement through posts and comments");
print("============================================\n");

db.users.aggregate([
  {
    $match: { role: "student" }
  },
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "sender.id",
      as: "userPosts"
    }
  },
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "sender.id",
      as: "userComments"
    }
  },
  {
    $lookup: {
      from: "reactions",
      localField: "_id",
      foreignField: "senderId",
      as: "userReactions"
    }
  },
  {
    $project: {
      _id: 0,
      studentName: "$name",
      email: "$email",
      level: "$level",
      enrolledCourses: { $size: "$courses" },
      postsCreated: { $size: "$userPosts" },
      commentsPosted: { $size: "$userComments" },
      reactionsGiven: { $size: "$userReactions" },
      totalActivity: {
        $add: [
          { $size: "$userPosts" },
          { $size: "$userComments" },
          { $size: "$userReactions" }
        ]
      }
    }
  },
  {
    $sort: { totalActivity: -1 }
  }
]).forEach(printjson);

// ============================================
// 17. AGGREGATION PIPELINE 3: Instructor Workload Report
// ============================================

print("\n============================================");
print("AGGREGATION 3: Instructor Workload Report");
print("Shows instructor teaching load and student count");
print("============================================\n");

db.users.aggregate([
  {
    $match: { role: "instructor" }
  },
  {
    $unwind: "$courses"
  },
  {
    $lookup: {
      from: "courses",
      localField: "courses",
      foreignField: "_id",
      as: "courseDetails"
    }
  },
  {
    $unwind: "$courseDetails"
  },
  {
    $lookup: {
      from: "users",
      let: { courseId: "$courses" },
      pipeline: [
        {
          $match: {
            role: "student",
            $expr: { $in: ["$$courseId", "$courses"] }
          }
        }
      ],
      as: "enrolledStudents"
    }
  },
  {
    $group: {
      _id: "$_id",
      instructorName: { $first: "$name" },
      email: { $first: "$email" },
      coursesTeaching: { $push: "$courseDetails.name" },
      totalCourses: { $sum: 1 },
      totalCreditHours: { $sum: "$courseDetails.creditHours" },
      totalStudents: { $sum: { $size: "$enrolledStudents" } }
    }
  },
  {
    $project: {
      _id: 0,
      instructorName: 1,
      email: 1,
      coursesTeaching: 1,
      totalCourses: 1,
      totalCreditHours: 1,
      totalStudents: 1
    }
  },
  {
    $sort: { totalCreditHours: -1 }
  }
]).forEach(printjson);

// ============================================
// 18. AGGREGATION PIPELINE 4: Popular Posts Report
// ============================================

print("\n============================================");
print("AGGREGATION 4: Popular Posts Report");
print("Shows most engaged posts by reactions and comments");
print("============================================\n");

db.posts.aggregate([
  {
    $lookup: {
      from: "reactions",
      localField: "_id",
      foreignField: "postId",
      as: "postReactions"
    }
  },
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "postId",
      as: "postComments"
    }
  },
  {
    $lookup: {
      from: "courses",
      localField: "courseId",
      foreignField: "_id",
      as: "courseInfo"
    }
  },
  {
    $unwind: { path: "$courseInfo", preserveNullAndEmptyArrays: true }
  },
  {
    $project: {
      _id: 0,
      postTitle: "$title",
      postType: "$type",
      author: "$sender.name",
      courseName: "$courseInfo.name",
      totalReactions: { $size: "$postReactions" },
      totalComments: { $size: "$postComments" },
      engagementScore: {
        $add: [
          { $multiply: [{ $size: "$postReactions" }, 1] },
          { $multiply: [{ $size: "$postComments" }, 2] }
        ]
      },
      createdAt: 1
    }
  },
  {
    $sort: { engagementScore: -1 }
  },
  {
    $limit: 10
  }
]).forEach(printjson);

print("\n============================================");
print("MONGODB SCRIPT EXECUTION COMPLETE");
print("============================================");
print("✓ Database created: educonnect");
print("✓ Collections: 8");
print("✓ Schema validation: 2 collections");
print("✓ Indexes: 7");
print("✓ Documents inserted: 27");
print("✓ CRUD operations: Complete");
print("✓ Aggregation pipelines: 4");
print("============================================");

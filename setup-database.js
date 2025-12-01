// Run this with: node setup-database.js
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'educonnect';

async function setupDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Drop existing collections
    console.log('\n🗑️  Dropping existing collections...');
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      await db.collection(col.name).drop();
      console.log(`  Dropped: ${col.name}`);
    }
    
    // Create collections with validation
    console.log('\n📋 Creating collections with schema validation...');
    
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "email", "password", "role", "createdAt"],
          properties: {
            name: { bsonType: "string" },
            email: { 
              bsonType: "string",
              pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            },
            password: { bsonType: "string", minLength: 6 },
            level: { bsonType: "string" },
            image: { bsonType: "string" },
            courses: { bsonType: "array", items: { bsonType: "string" } },
            role: { enum: ["student", "ta", "instructor", "admin"] },
            createdAt: { bsonType: "date" }
          }
        }
      }
    });
    console.log('  ✓ users');
    
    await db.createCollection("posts", {
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
            courseId: { bsonType: "string" },
            title: { bsonType: "string", minLength: 1 },
            body: { bsonType: "string" },
            type: { enum: ["question", "announcement", "discussion"] },
            answered: { bsonType: "bool" },
            createdAt: { bsonType: "date" }
          }
        }
      }
    });
    console.log('  ✓ posts');
    
    await db.createCollection("courses");
    await db.createCollection("comments");
    await db.createCollection("reactions");
    await db.createCollection("chats");
    await db.createCollection("messages");
    await db.createCollection("files");
    console.log('  ✓ Other collections created');
    
    // Create indexes
    console.log('\n🔍 Creating indexes...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('courses').createIndex({ _id: 1 });
    await db.collection('posts').createIndex({ courseId: 1, createdAt: -1 });
    await db.collection('comments').createIndex({ postId: 1, createdAt: -1 });
    await db.collection('messages').createIndex({ senderId: 1, receiverId: 1, createdAt: -1 });
    await db.collection('reactions').createIndex({ postId: 1, type: 1 });
    console.log('  ✓ 7 indexes created');
    
    // Insert users
    console.log('\n👥 Inserting users...');
    const users = [
      {
        _id: new ObjectId("673a1111111111111111111a"),
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
        _id: new ObjectId("673a1111111111111111111b"),
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
        _id: new ObjectId("673a1111111111111111111c"),
        name: "Emma Williams",
        email: "emma.williams@student.edu",
        password: "password123",
        level: "Sophomore",
        image: "profile_emma.jpg",
        courses: ["CS101", "MATH201"],
        role: "student",
        createdAt: new Date("2024-02-01")
      },
      {
        _id: new ObjectId("673a1111111111111111111d"),
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
        _id: new ObjectId("673a1111111111111111111e"),
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
        _id: new ObjectId("673a1111111111111111111f"),
        name: "Admin User",
        email: "admin@educonnect.edu",
        password: "hashed_password_admin",
        level: "System Administrator",
        image: "profile_admin.jpg",
        courses: [],
        role: "admin",
        createdAt: new Date("2024-01-01")
      },
      {
        _id: new ObjectId("673a1111111111111111112a"),
        name: "Prof. David Martinez",
        email: "david.martinez@educonnect.edu",
        password: "password123",
        level: "Professor of Computer Science",
        image: "profile_david.jpg",
        courses: ["CS201", "CS401"],
        role: "instructor",
        createdAt: new Date("2024-01-10")
      },
      {
        _id: new ObjectId("673a1111111111111111112b"),
        name: "Alex Thompson",
        email: "alex.thompson@educonnect.edu",
        password: "password123",
        level: "Graduate Teaching Assistant",
        image: "profile_alex.jpg",
        courses: ["CS101", "CS201"],
        role: "ta",
        createdAt: new Date("2024-02-15")
      }
    ];
    await db.collection('users').insertMany(users);
    console.log(`  ✓ Inserted ${users.length} users`);
    
    // Insert courses
    console.log('\n📚 Inserting courses...');
    const courses = [
      {
        _id: "CS101",
        name: "Introduction to Programming",
        creditHours: 3,
        description: "Learn the fundamentals of programming using Python. Perfect for beginners.",
        instructorId: [new ObjectId("673a1111111111111111111a")],
        enrolled: 45,
        capacity: 60
      },
      {
        _id: "CS301",
        name: "Data Structures and Algorithms",
        creditHours: 4,
        description: "Advanced course covering essential data structures and algorithmic techniques.",
        instructorId: [new ObjectId("673a1111111111111111111a")],
        enrolled: 32,
        capacity: 40
      },
      {
        _id: "MATH201",
        name: "Calculus II",
        creditHours: 4,
        description: "Continuation of Calculus I, covering integration techniques and series.",
        instructorId: [new ObjectId("673a1111111111111111111b")],
        enrolled: 38,
        capacity: 50
      },
      {
        _id: "CS201",
        name: "Web Development",
        creditHours: 3,
        description: "Build modern web applications using HTML, CSS, JavaScript, and popular frameworks.",
        instructorId: [new ObjectId("673a1111111111111111111a")],
        enrolled: 28,
        capacity: 35
      },
      {
        _id: "CS401",
        name: "Machine Learning",
        creditHours: 4,
        description: "Introduction to machine learning algorithms, neural networks, and AI applications.",
        instructorId: [new ObjectId("673a1111111111111111111a")],
        enrolled: 25,
        capacity: 30
      },
      {
        _id: "MATH101",
        name: "Calculus I",
        creditHours: 4,
        description: "Introduction to differential calculus, limits, derivatives, and applications.",
        instructorId: [new ObjectId("673a1111111111111111111b")],
        enrolled: 52,
        capacity: 60
      },
      {
        _id: "MATH301",
        name: "Linear Algebra",
        creditHours: 3,
        description: "Vector spaces, matrices, eigenvalues, and linear transformations.",
        instructorId: [new ObjectId("673a1111111111111111111b")],
        enrolled: 30,
        capacity: 40
      },
      {
        _id: "PHYS101",
        name: "Physics I",
        creditHours: 4,
        description: "Classical mechanics, Newton's laws, energy, and momentum.",
        instructorId: [new ObjectId("673a1111111111111111111b")],
        enrolled: 40,
        capacity: 50
      },
      {
        _id: "ENG201",
        name: "Technical Writing",
        creditHours: 3,
        description: "Professional communication, documentation, and technical report writing.",
        instructorId: [new ObjectId("673a1111111111111111111a")],
        enrolled: 22,
        capacity: 30
      },
      {
        _id: "CS202",
        name: "Database Systems",
        creditHours: 3,
        description: "Relational databases, SQL, NoSQL, database design, and optimization.",
        instructorId: [new ObjectId("673a1111111111111111111a")],
        enrolled: 35,
        capacity: 40
      },
      {
        _id: "CS302",
        name: "Operating Systems",
        creditHours: 4,
        description: "Process management, memory management, file systems, and concurrency.",
        instructorId: [new ObjectId("673a1111111111111111111a")],
        enrolled: 28,
        capacity: 35
      },
      {
        _id: "CS402",
        name: "Computer Networks",
        creditHours: 3,
        description: "Network protocols, TCP/IP, routing, security, and network programming.",
        instructorId: [new ObjectId("673a1111111111111111111a")],
        enrolled: 24,
        capacity: 30
      }
    ];
    await db.collection('courses').insertMany(courses);
    console.log(`  ✓ Inserted ${courses.length} courses`);
    
    // Insert posts
    console.log('\n📝 Inserting posts...');
    const posts = [
      {
        _id: new ObjectId("673a2222222222222222222a"),
        sender: {
          id: new ObjectId("673a1111111111111111111a"),
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
        _id: new ObjectId("673a2222222222222222222b"),
        sender: {
          id: new ObjectId("673a1111111111111111111c"),
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
        _id: new ObjectId("673a2222222222222222222c"),
        sender: {
          id: new ObjectId("673a1111111111111111111d"),
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
        _id: new ObjectId("673a2222222222222222222d"),
        sender: {
          id: new ObjectId("673a1111111111111111111b"),
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
    await db.collection('posts').insertMany(posts);
    console.log(`  ✓ Inserted ${posts.length} posts`);
    
    // Insert comments
    console.log('\n💬 Inserting comments...');
    const comments = [
      {
        _id: new ObjectId("673a3333333333333333333a"),
        postId: new ObjectId("673a2222222222222222222b"),
        sender: {
          id: new ObjectId("673a1111111111111111111d"),
          name: "James Rodriguez",
          image: "profile_james.jpg"
        },
        body: "For loops are better when you know how many iterations you need. While loops are for when the condition is more dynamic.",
        createdAt: new Date("2024-09-15T10:30:00")
      },
      {
        _id: new ObjectId("673a3333333333333333333b"),
        postId: new ObjectId("673a2222222222222222222b"),
        sender: {
          id: new ObjectId("673a1111111111111111111a"),
          name: "Dr. Sarah Johnson",
          image: "profile_sarah.jpg"
        },
        body: "Great question! James is correct. I'll post a detailed explanation in the course materials.",
        createdAt: new Date("2024-09-15T14:00:00")
      },
      {
        _id: new ObjectId("673a3333333333333333333c"),
        postId: new ObjectId("673a2222222222222222222c"),
        sender: {
          id: new ObjectId("673a1111111111111111111e"),
          name: "Sophia Lee",
          image: "profile_sophia.jpg"
        },
        body: "I'd love to discuss! I'm thinking of using recursion for insertion.",
        createdAt: new Date("2024-10-01T16:20:00")
      }
    ];
    await db.collection('comments').insertMany(comments);
    console.log(`  ✓ Inserted ${comments.length} comments`);
    
    // Insert reactions
    console.log('\n👍 Inserting reactions...');
    const reactions = [
      {
        _id: new ObjectId("673a4444444444444444444a"),
        postId: new ObjectId("673a2222222222222222222a"),
        senderId: new ObjectId("673a1111111111111111111c"),
        type: "love",
        createdAt: new Date("2024-09-01T12:00:00")
      },
      {
        _id: new ObjectId("673a4444444444444444444b"),
        postId: new ObjectId("673a2222222222222222222a"),
        senderId: new ObjectId("673a1111111111111111111d"),
        type: "like",
        createdAt: new Date("2024-09-01T13:00:00")
      },
      {
        _id: new ObjectId("673a4444444444444444444c"),
        postId: new ObjectId("673a2222222222222222222b"),
        senderId: new ObjectId("673a1111111111111111111e"),
        type: "like",
        createdAt: new Date("2024-09-15T11:00:00")
      },
      {
        _id: new ObjectId("673a4444444444444444444d"),
        postId: new ObjectId("673a2222222222222222222d"),
        senderId: new ObjectId("673a1111111111111111111c"),
        type: "shocked",
        createdAt: new Date("2024-10-20T15:00:00")
      }
    ];
    await db.collection('reactions').insertMany(reactions);
    console.log(`  ✓ Inserted ${reactions.length} reactions`);
    
    // Insert chats
    console.log('\n💬 Inserting chats...');
    const chats = [
      {
        _id: new ObjectId("673a5555555555555555555a"),
        user1: {
          id: new ObjectId("673a1111111111111111111c"),
          name: "Emma Williams",
          image: "profile_emma.jpg"
        },
        user2: {
          id: new ObjectId("673a1111111111111111111d"),
          name: "James Rodriguez",
          image: "profile_james.jpg"
        },
        lastMessage: "Thanks for the help with the assignment!"
      },
      {
        _id: new ObjectId("673a5555555555555555555b"),
        user1: {
          id: new ObjectId("673a1111111111111111111c"),
          name: "Emma Williams",
          image: "profile_emma.jpg"
        },
        user2: {
          id: new ObjectId("673a1111111111111111111a"),
          name: "Dr. Sarah Johnson",
          image: "profile_sarah.jpg"
        },
        lastMessage: "Could we schedule office hours?"
      }
    ];
    await db.collection('chats').insertMany(chats);
    console.log(`  ✓ Inserted ${chats.length} chats`);
    
    // Insert messages
    console.log('\n✉️  Inserting messages...');
    const messages = [
      {
        _id: new ObjectId("673a6666666666666666666a"),
        senderId: new ObjectId("673a1111111111111111111c"),
        receiverId: new ObjectId("673a1111111111111111111d"),
        text: "Hey James, can you help me with the loop assignment?",
        attachmentsId: [],
        createdAt: new Date("2024-09-16T09:00:00")
      },
      {
        _id: new ObjectId("673a6666666666666666666b"),
        senderId: new ObjectId("673a1111111111111111111d"),
        receiverId: new ObjectId("673a1111111111111111111c"),
        text: "Sure! What part are you stuck on?",
        attachmentsId: [],
        createdAt: new Date("2024-09-16T09:15:00")
      },
      {
        _id: new ObjectId("673a6666666666666666666c"),
        senderId: new ObjectId("673a1111111111111111111c"),
        receiverId: new ObjectId("673a1111111111111111111d"),
        text: "Thanks for the help with the assignment!",
        attachmentsId: [],
        createdAt: new Date("2024-09-16T10:30:00")
      },
      {
        _id: new ObjectId("673a6666666666666666666d"),
        senderId: new ObjectId("673a1111111111111111111c"),
        receiverId: new ObjectId("673a1111111111111111111a"),
        text: "Hello Dr. Johnson, could we schedule office hours?",
        attachmentsId: [],
        createdAt: new Date("2024-09-20T14:00:00")
      }
    ];
    await db.collection('messages').insertMany(messages);
    console.log(`  ✓ Inserted ${messages.length} messages`);
    
    // Insert files
    console.log('\n📎 Inserting files...');
    const files = [
      {
        _id: new ObjectId("673a7777777777777777777a"),
        fileName: "syllabus_cs101.pdf",
        fileType: "pdf",
        fileData: "binary_data_placeholder",
        courseId: "CS101",
        postId: new ObjectId("673a2222222222222222222a"),
        messageId: null,
        createdAt: new Date("2024-09-01")
      }
    ];
    await db.collection('files').insertMany(files);
    console.log(`  ✓ Inserted ${files.length} file`);
    
    console.log('\n✅ DATABASE SETUP COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Database: ${DB_NAME}`);
    console.log('Collections: 8');
    console.log('Total Documents: 27');
    console.log('Schema Validation: 2 collections');
    console.log('Indexes: 7');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
  }
}

setupDatabase();

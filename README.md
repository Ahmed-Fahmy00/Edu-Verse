# EduConnect - Educational Platform

An educational platform similar to Microsoft Teams for course management, messaging, discussions, and collaboration.

## Features

### 🔐 Authentication
- Login/Signup system with beautiful UI
- Session persistence
- Demo account available

### 📚 Course Management
- Browse 12 available courses
- Enroll/Unenroll functionality
- Track enrollment capacity
- View course details and instructors

### 💬 Social Features
- Discussion posts (Questions, Announcements, Discussions)
- Comment system
- Emoji reactions (👍 ❤️ 😮 😂 😢)
- Real-time messaging between users
- User search and chat initiation

### 🎨 Modern UI/UX
- Left sidebar navigation
- Smooth animations and transitions
- Responsive design
- Dashboard with activity stats
- Enhanced profile pages

### 📊 Dashboard
- Quick stats overview
- Recent activity feed
- Enrolled courses count
- Engagement metrics

## MongoDB Requirements Fulfilled

✅ **Database & Collections**: Created `educonnect` database with 8 collections
✅ **Data Insertion**: 27+ documents with realistic data and embedded documents
✅ **CRUD Operations**: Complete Create, Read, Update, Delete operations
✅ **Aggregation Pipelines**: 4 meaningful reports:
   - Course Engagement Report
   - Student Activity Report
   - Instructor Workload Report
   - Popular Posts Report
✅ **Schema Validation**: JSON Schema for users and posts collections
✅ **Indexes**: 7 indexes for performance optimization

## Setup Instructions

### 1. Install MongoDB
If you don't have MongoDB installed:
- **Download**: https://www.mongodb.com/try/download/community
- **Install MongoDB Community Server** for Windows
- During installation, make sure to install as a service (it will start automatically)

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Setup the Database
**Option A - Using Node.js (Recommended):**
```bash
node setup-database.js
```

**Option B - Using MongoDB Compass (GUI):**
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect to `mongodb://localhost:27017`
3. Import the data manually or use the mongosh shell from Compass

**Option C - If mongosh is installed:**
```bash
mongosh < mongodb-script.js
```

### 4. Configure Environment
```bash
npm install
```

### 5. Configure Environment (Optional)
```bash
# Copy the example env file
copy .env.example .env

# Edit .env if you need custom settings (default works for local MongoDB)
```

### 7. Start the Server
```bash
npm start

# Or for development with auto-reload:
npm run dev
```

### 8. Access the Application
Open your browser and navigate to: `http://localhost:3000`

## Project Structure

```
educonnect/
├── mongodb-script.js      # Complete MongoDB setup script
├── server.js              # Express API server
├── package.json           # Node.js dependencies
├── .env.example           # Environment variables template
├── public/
│   ├── index.html         # Main HTML page
│   ├── styles.css         # Styling
│   └── app.js             # Frontend JavaScript
└── README.md              # This file
```

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/:courseId/posts` - Get posts for a course

### Posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:postId/comments` - Get comments for a post
- `GET /api/posts/:postId/reactions` - Get reactions for a post

### Comments
- `POST /api/comments` - Add a comment to a post

### Reactions
- `POST /api/reactions` - Add/update reaction to a post

### Messages
- `GET /api/users/:userId/chats` - Get user's chats
- `GET /api/messages/:user1Id/:user2Id` - Get messages between users
- `POST /api/messages` - Send a message

### Users
- `GET /api/users` - Get users (with optional filters)
- `GET /api/users/:id` - Get user by ID

## Database Schema

### Collections:
- **users**: User accounts (students, instructors, admins)
- **courses**: Course information
- **posts**: Discussion posts, questions, announcements
- **comments**: Comments on posts
- **reactions**: Reactions to posts (like, love, etc.)
- **chats**: Chat conversations between users
- **messages**: Individual messages
- **files**: File attachments

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Authentication**: JWT (ready for implementation)

## Demo Account

Login with Emma Williams (student):
- **Email:** emma.williams@student.edu
- **Password:** password123
- **Enrolled in:** CS101, MATH201

Or create your own account using the signup page!

## Future Enhancements

- User authentication and authorization
- File upload functionality
- Real-time notifications with WebSockets
- Video conferencing integration
- Assignment submission system
- Grade management

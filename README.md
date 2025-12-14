# 🎓 EduVerse - University Learning Management System

A full-stack Learning Management System (LMS) designed for universities, enabling seamless interaction between students and instructors through courses, posts, real-time messaging, and more.

🔗 **Live Demo**: [https://edu-verse-eta.vercel.app](https://edu-verse-eta.vercel.app)

---

## ✨ Features

### 🔐 Authentication & User Management
- User registration with role selection (Student/Instructor)
- Secure login with JWT authentication
- Password reset via email
- Profile management with avatar upload
- User search functionality

### 📚 Course Management
- Browse all available courses
- Course enrollment/unenrollment for students
- Course creation for instructors
- Course capacity management
- View enrolled students count
- Course details with instructor information

### 📝 Posts & Announcements
- Create posts with multiple types:
  - 💬 Discussions
  - ❓ Questions
  - 📢 Announcements (with deadlines)
- Rich text content with image attachments
- Edit and delete own posts
- Course-specific and general posts
- Chronological feed with auto-refresh

### 💬 Comments System
- Comment on any post
- Real-time comment updates
- User avatars and timestamps
- Nested discussion threads

### 👍 Reactions System
- Five reaction types:
  - 👍 Like
  - ❤️ Love
  - 😂 Laugh
  - 😮 Shocked
  - 😢 Sad
- Toggle reactions on/off
- Real-time reaction counts
- Track your own reactions

### 💭 Real-Time Chat & Messaging
- Direct messaging between users
- Chat list with last message preview
- Message attachments (images, PDFs, documents)
- Reply to specific messages
- Delete your own messages
- Auto-polling for new messages
- Drag-and-drop file uploads

### 📁 File Management
- Upload images, PDFs, and Word documents
- Profile picture uploads
- Post attachments
- Message attachments
- File size validation (max 10MB)
- Secure file serving

### 👤 User Profiles
- View own and other users' profiles
- Display user's posts and courses
- Edit profile information
- Upload/change profile picture
- Start chat from profile page
- User statistics (posts, comments, reactions)

### 🎨 UI/UX Features
- Clean, modern interface
- Responsive design
- Loading states and spinners
- Toast notifications
- Empty states
- Error boundaries
- Virtual list for performance

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **CSS** - Custom styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service

---

## 📁 Project Structure

```
├── backend/
│   ├── database/          # MongoDB connection
│   ├── dummy-data/        # Seed data scripts
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Reaction.js
│   │   ├── Chat.js
│   │   ├── Message.js
│   │   └── File.js
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── server.js          # Entry point
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/           # API calls
│       ├── components/    # Reusable components
│       │   ├── common/
│       │   └── ui/
│       ├── hooks/         # Custom hooks
│       ├── lib/           # Utilities
│       ├── pages/         # Page components
│       └── styles/        # CSS files
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eduverse
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

   Start the server:
   ```bash
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

   Create `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

   Start the app:
   ```bash
   npm start
   ```

4. **Seed Database (Optional)**
   ```bash
   cd backend
   node dummy-data/seed.js
   ```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register new user |
| POST | `/users/login` | User login |
| GET | `/users/me` | Get current user |
| POST | `/users/forgot-password` | Request password reset |
| POST | `/users/reset-password` | Reset password |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:id` | Get user profile |
| PUT | `/users/:id` | Update user profile |
| GET | `/users/:id/posts` | Get user's posts |
| GET | `/users/:id/courses` | Get user's courses |
| GET | `/users/search` | Search users |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | Get all courses |
| GET | `/courses/:id` | Get course by ID |
| POST | `/courses` | Create course |
| PUT | `/courses/:id` | Update course |
| DELETE | `/courses/:id` | Delete course |
| POST | `/courses/:id/enroll` | Enroll in course |
| POST | `/courses/:id/unenroll` | Unenroll from course |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Get all posts |
| GET | `/posts/:id` | Get post by ID |
| POST | `/posts` | Create post |
| PUT | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Delete post |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/comments?postId=` | Get comments for post |
| POST | `/comments` | Create comment |
| DELETE | `/comments/:id` | Delete comment |

### Reactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reactions?postId=` | Get reactions for post |
| POST | `/reactions` | Add/update reaction |
| DELETE | `/reactions/:postId` | Remove reaction |

### Chats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/chats` | Get user's chats |
| GET | `/chats/:id` | Get chat by ID |
| POST | `/chats` | Create new chat |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/messages?chatId=` | Get messages for chat |
| POST | `/messages` | Send message |
| DELETE | `/messages/:id` | Delete message |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/files/upload` | Upload file |
| GET | `/files/:id` | Get file by ID |

---

## 👥 User Roles

### Student
- Browse and enroll in courses
- Create posts and comments
- React to posts
- Chat with other users
- Manage profile

### Instructor
- All student capabilities
- Create and manage courses
- Post announcements with deadlines
- View enrolled students

---

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- File type/size validation
- CORS configuration

---

## 📱 Screenshots

The application includes:
- **Home Feed** - View and create posts
- **Courses Page** - Browse and enroll in courses
- **Course Details** - View course information and posts
- **Chat Interface** - Real-time messaging
- **User Profile** - View and edit profile
- **Authentication** - Login and registration forms

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Authors

University Database Project - Phase 2

---

Made with ❤️ for education

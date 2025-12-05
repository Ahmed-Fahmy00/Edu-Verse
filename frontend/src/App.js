import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SonnerToaster } from "./components/ui/feedback";
import { isAuthenticated } from "./api/session";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Chats from "./pages/Chats";
import PostDetail from "./pages/PostDetail";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

// Auth Route Component (redirect if already authenticated)
function AuthRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SonnerToaster />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={ <AuthRoute> <Auth /> </AuthRoute>}/>
          <Route path="/forgot-password" element={ <AuthRoute> <ForgotPassword /> </AuthRoute>}/>
          <Route path="/reset-password/:token" element={ <AuthRoute> <ResetPassword /> </AuthRoute>}/>
          <Route path="/" element={ <ProtectedRoute> <Home /> </ProtectedRoute> }/>
          <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute>}
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <Chats />
              </ProtectedRoute>
            }
          />
          <Route path="/posts/:postId" element={<ProtectedRoute> <PostDetail /></ProtectedRoute>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
